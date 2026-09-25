from collections import defaultdict

from sqlalchemy import asc, desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.features.movies.schemas import (
    MovieListItemDTO,
    QuickSearchMovieDTO,
    SortField,
    SortOrder,
)
from app.movies.models import (
    DimCompany,
    DimGenre,
    DimMovie,
    DimPerson,
    DimReview,
    FactMoviePerformance,
    bridge_movie_company,
    bridge_movie_genre,
    bridge_movie_person,
)
from app.shared.pagination import PaginatedResponse, PaginationParams


class MoviesRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_movies(
        self,
        params: PaginationParams,
        query: str | None = None,
        genre: str | None = None,
        company: str | None = None,
        sort_by: SortField = "popularidade",
        order: SortOrder = "desc",
    ) -> PaginatedResponse[MovieListItemDTO]:
        """Consulta paginada com filtros dinâmicos e carregamento otimizado de relacionamentos."""
        filters = []

        if query and query.strip():
            term = f"%{query.strip()}%"
            # Subqueries em cascata usando chaves indexadas para evitar full scans com JOIN
            person_ids_subq = (
                select(DimPerson.sk_person_id)
                .where(DimPerson.nome_pessoa.ilike(term))
            )
            person_movie_ids_subq = (
                select(bridge_movie_person.c.sk_movie_id)
                .where(bridge_movie_person.c.sk_person_id.in_(person_ids_subq))
            )
            filters.append(
                (DimMovie.titulo.ilike(term))
                | (DimMovie.sk_movie_id.in_(person_movie_ids_subq))
            )

        if genre and genre.strip():
            genre_ids_subq = (
                select(DimGenre.sk_genre_id)
                .where(DimGenre.nome_genero.ilike(genre.strip()))
            )
            genre_movie_ids_subq = (
                select(bridge_movie_genre.c.sk_movie_id)
                .where(bridge_movie_genre.c.sk_genre_id.in_(genre_ids_subq))
            )
            filters.append(DimMovie.sk_movie_id.in_(genre_movie_ids_subq))

        if company and company.strip():
            company_ids_subq = (
                select(DimCompany.sk_company_id)
                .where(DimCompany.nome_produtora.ilike(company.strip()))
            )
            company_movie_ids_subq = (
                select(bridge_movie_company.c.sk_movie_id)
                .where(bridge_movie_company.c.sk_company_id.in_(company_ids_subq))
            )
            filters.append(DimMovie.sk_movie_id.in_(company_movie_ids_subq))

        # Contagem total ultra rápida sem outer joins redundantes
        count_stmt = select(func.count(DimMovie.sk_movie_id))
        if filters:
            count_stmt = count_stmt.where(*filters)
        total = (await self.session.execute(count_stmt)).scalar() or 0

        if total == 0:
            return PaginatedResponse.create(items=[], total=0, params=params)

        # Configuração da consulta de itens paginados
        items_query = select(DimMovie)

        # Adiciona joins apenas conforme o critério de ordenação selecionado
        if sort_by in ("popularidade", "receita_usd"):
            items_query = items_query.outerjoin(
                FactMoviePerformance,
                DimMovie.sk_movie_id == FactMoviePerformance.sk_movie_id,
            )
            sort_col = (
                func.coalesce(FactMoviePerformance.popularidade, 0.0)
                if sort_by == "popularidade"
                else func.coalesce(FactMoviePerformance.receita_usd, 0)
            )
        elif sort_by == "nota_media_usuarios":
            items_query = items_query.outerjoin(
                DimReview,
                DimMovie.sk_movie_id == DimReview.sk_movie_id,
            )
            sort_col = func.coalesce(DimReview.nota_media_usuarios, 0.0)
        elif sort_by == "ano_lancamento":
            sort_col = func.coalesce(DimMovie.ano_lancamento, 0)
        else:
            sort_col = DimMovie.titulo

        if filters:
            items_query = items_query.where(*filters)

        direction = desc if order == "desc" else asc
        ordered_query = (
            items_query.order_by(direction(sort_col), DimMovie.sk_movie_id)
            .offset(params.offset)
            .limit(params.page_size)
            .options(
                selectinload(DimMovie.genres),
                selectinload(DimMovie.companies),
                selectinload(DimMovie.performance),
                selectinload(DimMovie.reviews_summary),
            )
        )

        result = await self.session.execute(ordered_query)
        movies = result.scalars().all()

        # Busca direcionada apenas para diretores da página, prevenindo overfetching de pessoas
        directors_by_movie: dict[str, list[str]] = defaultdict(list)
        if movies:
            movie_ids = [m.sk_movie_id for m in movies]
            directors_stmt = (
                select(bridge_movie_person.c.sk_movie_id, DimPerson.nome_pessoa)
                .join(DimPerson, bridge_movie_person.c.sk_person_id == DimPerson.sk_person_id)
                .where(
                    bridge_movie_person.c.sk_movie_id.in_(movie_ids),
                    DimPerson.tipo_pessoa == "Diretor",
                )
            )
            directors_result = await self.session.execute(directors_stmt)
            for movie_id, person_name in directors_result.all():
                directors_by_movie[movie_id].append(person_name)

        items = [
            MovieListItemDTO.from_movie_model(
                movie,
                diretores=directors_by_movie.get(movie.sk_movie_id, []),
            )
            for movie in movies
        ]

        return PaginatedResponse.create(items=items, total=total, params=params)

    async def quick_search(self, query: str, limit: int = 10) -> list[QuickSearchMovieDTO]:
        """Busca ultrarrápida com foco em digitação instantânea para Command Palette."""
        if not query or len(query.strip()) < 2:
            return []

        term = f"%{query.strip()}%"
        stmt = (
            select(DimMovie)
            .outerjoin(
                FactMoviePerformance,
                DimMovie.sk_movie_id == FactMoviePerformance.sk_movie_id,
            )
            .where(DimMovie.titulo.ilike(term))
            .order_by(
                desc(func.coalesce(FactMoviePerformance.popularidade, 0.0)),
                DimMovie.titulo,
            )
            .limit(limit)
            .options(
                selectinload(DimMovie.genres),
                selectinload(DimMovie.performance),
                selectinload(DimMovie.reviews_summary),
            )
        )

        result = await self.session.execute(stmt)
        movies = result.scalars().all()

        return [QuickSearchMovieDTO.from_movie_model(m) for m in movies]
