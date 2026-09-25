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
    DimGenre,
    DimMovie,
    DimPerson,
    DimReview,
    FactMoviePerformance,
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
        base_query = (
            select(DimMovie)
            .outerjoin(FactMoviePerformance, DimMovie.sk_movie_id == FactMoviePerformance.sk_movie_id)
            .outerjoin(DimReview, DimMovie.sk_movie_id == DimReview.sk_movie_id)
        )

        if query and query.strip():
            term = f"%{query.strip()}%"
            # Busca por título ou por nome de diretor/ator
            person_subq = (
                select(bridge_movie_person.c.sk_movie_id)
                .join(DimPerson, bridge_movie_person.c.sk_person_id == DimPerson.sk_person_id)
                .where(DimPerson.nome_pessoa.ilike(term))
            )
            base_query = base_query.where(
                (DimMovie.titulo.ilike(term)) | (DimMovie.sk_movie_id.in_(person_subq))
            )

        if genre and genre.strip():
            genre_subq = (
                select(bridge_movie_genre.c.sk_movie_id)
                .join(DimGenre, bridge_movie_genre.c.sk_genre_id == DimGenre.sk_genre_id)
                .where(DimGenre.nome_genero.ilike(genre.strip()))
            )
            base_query = base_query.where(DimMovie.sk_movie_id.in_(genre_subq))

        # Contagem total
        count_stmt = select(func.count()).select_from(base_query.subquery())
        total = (await self.session.execute(count_stmt)).scalar() or 0

        # Ordenação
        sort_col = {
            "popularidade": func.coalesce(FactMoviePerformance.popularidade, 0.0),
            "nota_media_usuarios": func.coalesce(DimReview.nota_media_usuarios, 0.0),
            "receita_usd": func.coalesce(FactMoviePerformance.receita_usd, 0),
            "ano_lancamento": func.coalesce(DimMovie.ano_lancamento, 0),
            "titulo": DimMovie.titulo,
        }.get(sort_by, func.coalesce(FactMoviePerformance.popularidade, 0.0))

        direction = desc if order == "desc" else asc
        ordered_query = (
            base_query.order_by(direction(sort_col), DimMovie.sk_movie_id)
            .offset(params.offset)
            .limit(params.page_size)
            .options(
                selectinload(DimMovie.genres),
                selectinload(DimMovie.companies),
                selectinload(DimMovie.people),
                selectinload(DimMovie.performance),
                selectinload(DimMovie.reviews_summary),
            )
        )

        result = await self.session.execute(ordered_query)
        movies = result.scalars().all()

        items: list[MovieListItemDTO] = []
        for m in movies:
            diretores = [
                p.nome_pessoa for p in m.people if getattr(p, "tipo_pessoa", "") == "Diretor"
            ]
            generos = [g.nome_genero for g in m.genres]
            produtoras = [c.nome_produtora for c in m.companies]

            items.append(
                MovieListItemDTO(
                    sk_movie_id=m.sk_movie_id,
                    id_filme=m.id_filme,
                    titulo=m.titulo,
                    ano_lancamento=m.ano_lancamento,
                    duracao_minutos=m.duracao_minutos,
                    sinopse=m.sinopse,
                    url_poster=m.url_poster,
                    url_backdrop=m.url_backdrop,
                    generos=generos,
                    diretores=diretores,
                    produtoras=produtoras,
                    popularidade=float(m.performance.popularidade) if m.performance and m.performance.popularidade is not None else 0.0,
                    nota_media_usuarios=float(m.reviews_summary.nota_media_usuarios) if m.reviews_summary and m.reviews_summary.nota_media_usuarios is not None else None,
                    qtd_avaliacoes_usuarios=m.reviews_summary.qtd_avaliacoes_usuarios if m.reviews_summary else 0,
                    nota_tmdb=float(m.performance.nota_tmdb) if m.performance and m.performance.nota_tmdb is not None else None,
                    nota_imdb=float(m.performance.nota_imdb) if m.performance and m.performance.nota_imdb is not None else None,
                    receita_usd=m.performance.receita_usd if m.performance else None,
                    receita_brl=m.performance.receita_brl if m.performance else None,
                )
            )

        return PaginatedResponse.create(items=items, total=total, params=params)

    async def quick_search(self, query: str, limit: int = 10) -> list[QuickSearchMovieDTO]:
        """Busca ultrarrápida com foco em digitação e sugestões instantâneas para Spotlight / Command Palette."""
        if not query or len(query.strip()) < 2:
            return []

        term = f"%{query.strip()}%"
        stmt = (
            select(DimMovie)
            .outerjoin(FactMoviePerformance, DimMovie.sk_movie_id == FactMoviePerformance.sk_movie_id)
            .outerjoin(DimReview, DimMovie.sk_movie_id == DimReview.sk_movie_id)
            .where(DimMovie.titulo.ilike(term))
            .order_by(desc(func.coalesce(FactMoviePerformance.popularidade, 0.0)), DimMovie.titulo)
            .limit(limit)
            .options(
                selectinload(DimMovie.genres),
                selectinload(DimMovie.performance),
                selectinload(DimMovie.reviews_summary),
            )
        )

        result = await self.session.execute(stmt)
        movies = result.scalars().all()

        return [
            QuickSearchMovieDTO(
                sk_movie_id=m.sk_movie_id,
                id_filme=m.id_filme,
                titulo=m.titulo,
                ano_lancamento=m.ano_lancamento,
                url_poster=m.url_poster,
                nota_media_usuarios=float(m.reviews_summary.nota_media_usuarios) if m.reviews_summary and m.reviews_summary.nota_media_usuarios is not None else None,
                popularidade=float(m.performance.popularidade) if m.performance and m.performance.popularidade is not None else 0.0,
                generos=[g.nome_genero for g in m.genres],
            )
            for m in movies
        ]
