"""Repositório e consultas para o slice de Pessoas."""

import math

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.features.movies.schemas import MovieFilterParams, MovieListItemDTO
from app.features.people.schemas import PersonDetailDTO, QuickSearchPersonDTO
from app.movies.models import (
    DimGenre,
    DimMovie,
    DimPerson,
    DimReview,
    FactMoviePerformance,
    bridge_movie_genre,
    bridge_movie_person,
)
from app.shared.pagination import PaginatedResponse


class PeopleRepository:
    """Acesso a dados e agregações para DimPerson e filmografia."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_person_by_id(self, person_id: str) -> DimPerson | None:
        """Busca registro de DimPerson por sk_person_id ou nome exato."""
        stmt = select(DimPerson).where(
            (DimPerson.sk_person_id == person_id) | (DimPerson.nome_pessoa == person_id)
        )
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def get_person_detail(self, person_id: str) -> PersonDetailDTO | None:
        """Calcula agregações de carreira e dados da pessoa."""
        person = await self.get_person_by_id(person_id)
        if not person:
            return None

        # Descobrir todas as pessoas que compartilham o mesmo nome para unificar papéis se houver
        papeis_stmt = select(DimPerson.tipo_pessoa).where(
            DimPerson.nome_pessoa == person.nome_pessoa
        ).distinct()
        papeis_res = await self.session.execute(papeis_stmt)
        papeis = [p[0] for p in papeis_res.fetchall() if p[0]]

        # Subquery de filmes vinculados a essa pessoa (ou pessoas de mesmo nome)
        person_ids_stmt = select(DimPerson.sk_person_id).where(
            DimPerson.nome_pessoa == person.nome_pessoa
        )
        movie_ids_stmt = select(bridge_movie_person.c.sk_movie_id).where(
            bridge_movie_person.c.sk_person_id.in_(person_ids_stmt)
        ).distinct()

        # Estatísticas agregadas
        stats_stmt = (
            select(
                func.count(DimMovie.sk_movie_id).label("total"),
                func.avg(DimReview.nota_media_usuarios).label("avg_rating"),
                func.min(DimMovie.ano_lancamento).label("min_ano"),
                func.max(DimMovie.ano_lancamento).label("max_ano"),
            )
            .outerjoin(DimReview, DimMovie.sk_movie_id == DimReview.sk_movie_id)
            .where(DimMovie.sk_movie_id.in_(movie_ids_stmt))
        )
        stats_res = await self.session.execute(stats_stmt)
        row = stats_res.fetchone()

        total = row.total if row and row.total is not None else 0
        avg_rating = float(row.avg_rating) if row and row.avg_rating is not None else None
        min_ano = row.min_ano if row and row.min_ano is not None else None
        max_ano = row.max_ano if row and row.max_ano is not None else None

        return PersonDetailDTO(
            sk_person_id=person.sk_person_id,
            nome_pessoa=person.nome_pessoa,
            tipo_pessoa=person.tipo_pessoa,
            total_filmes=total,
            nota_media_filmes=round(avg_rating, 2) if avg_rating is not None else None,
            primeiro_ano=min_ano,
            ultimo_ano=max_ano,
            papeis=papeis if papeis else [person.tipo_pessoa],
        )

    async def get_person_movies(
        self, person_id: str, filters: MovieFilterParams
    ) -> PaginatedResponse[MovieListItemDTO] | None:
        """Busca filmes paginados da filmografia da pessoa aplicando filtros de catálogo."""
        person = await self.get_person_by_id(person_id)
        if not person:
            return None

        person_ids_stmt = select(DimPerson.sk_person_id).where(
            DimPerson.nome_pessoa == person.nome_pessoa
        )
        person_movie_ids = select(bridge_movie_person.c.sk_movie_id).where(
            bridge_movie_person.c.sk_person_id.in_(person_ids_stmt)
        )

        query_filters = [DimMovie.sk_movie_id.in_(person_movie_ids)]

        # Filtros adicionais de busca, gênero e ano
        if filters.q and filters.q.strip():
            query_filters.append(DimMovie.titulo.ilike(f"%{filters.q.strip()}%"))

        if filters.genre and filters.genre.strip():
            genre_ids_subq = select(DimGenre.sk_genre_id).where(
                DimGenre.nome_genero.ilike(filters.genre.strip())
            )
            genre_movie_ids_subq = select(bridge_movie_genre.c.sk_movie_id).where(
                bridge_movie_genre.c.sk_genre_id.in_(genre_ids_subq)
            )
            query_filters.append(DimMovie.sk_movie_id.in_(genre_movie_ids_subq))

        if filters.year is not None:
            query_filters.append(DimMovie.ano_lancamento == filters.year)

        # Total
        count_stmt = select(func.count(DimMovie.sk_movie_id)).where(*query_filters)
        total = (await self.session.execute(count_stmt)).scalar() or 0

        # Query principal
        stmt = (
            select(DimMovie)
            .outerjoin(
                FactMoviePerformance,
                DimMovie.sk_movie_id == FactMoviePerformance.sk_movie_id,
            )
            .outerjoin(DimReview, DimMovie.sk_movie_id == DimReview.sk_movie_id)
            .where(*query_filters)
        )

        # Ordenação
        sort_by = filters.sort_by or "popularidade"
        sort_order = filters.order or "desc"

        if sort_by == "nota_media_usuarios":
            order_col = DimReview.nota_media_usuarios
        elif sort_by == "receita_usd":
            order_col = FactMoviePerformance.receita_usd
        elif sort_by == "ano_lancamento":
            order_col = DimMovie.ano_lancamento
        elif sort_by == "titulo":
            order_col = DimMovie.titulo
        else:
            order_col = FactMoviePerformance.popularidade

        if sort_order == "asc":
            stmt = stmt.order_by(order_col.asc().nulls_last(), DimMovie.titulo.asc())
        else:
            stmt = stmt.order_by(order_col.desc().nulls_last(), DimMovie.titulo.asc())

        # Paginação
        offset = (filters.page - 1) * filters.page_size
        stmt = (
            stmt.offset(offset)
            .limit(filters.page_size)
            .options(
                selectinload(DimMovie.genres),
                selectinload(DimMovie.companies),
                selectinload(DimMovie.people),
                selectinload(DimMovie.performance),
                selectinload(DimMovie.reviews_summary),
            )
        )

        res = await self.session.execute(stmt)
        movies = res.scalars().all()

        items = [MovieListItemDTO.from_movie_model(m) for m in movies]
        total_pages = math.ceil(total / filters.page_size) if total > 0 else 0

        return PaginatedResponse[MovieListItemDTO](
            items=items,
            total=total,
            page=filters.page,
            page_size=filters.page_size,
            total_pages=total_pages,
        )

    async def quick_search(self, query: str, limit: int = 10) -> list[QuickSearchPersonDTO]:
        """Busca rápida de pessoas pelo nome de forma otimizada
        para o profiler e Command Palette."""
        if not query or len(query.strip()) < 2:
            return []

        term = f"%{query.strip()}%"

        # Etapa 1: Busca rápida pelos nomes utilizando o índice em dim_people
        people_stmt = (
            select(
                DimPerson.sk_person_id,
                DimPerson.nome_pessoa,
                DimPerson.tipo_pessoa,
            )
            .where(DimPerson.nome_pessoa.ilike(term))
            .limit(limit * 4)
        )
        people_res = await self.session.execute(people_stmt)
        people = people_res.fetchall()

        if not people:
            return []

        person_ids = [p.sk_person_id for p in people]

        # Etapa 2: Contagem de filmes apenas para os IDs selecionados
        counts_stmt = (
            select(
                bridge_movie_person.c.sk_person_id,
                func.count(bridge_movie_person.c.sk_movie_id).label("total_filmes"),
            )
            .where(bridge_movie_person.c.sk_person_id.in_(person_ids))
            .group_by(bridge_movie_person.c.sk_person_id)
        )
        counts_res = await self.session.execute(counts_stmt)
        counts_map = dict(counts_res.fetchall())

        results = [
            QuickSearchPersonDTO(
                sk_person_id=p.sk_person_id,
                nome_pessoa=p.nome_pessoa,
                tipo_pessoa=p.tipo_pessoa,
                total_filmes=counts_map.get(p.sk_person_id, 0),
            )
            for p in people
        ]

        # Ordena por maior relevância de obras no catálogo
        results.sort(key=lambda x: (x.total_filmes, -len(x.nome_pessoa)), reverse=True)
        return results[:limit]
