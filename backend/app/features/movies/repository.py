from collections import defaultdict

from sqlalchemy import asc, desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.features.movies.schemas import (
    CompanyDTO,
    FinancialMetricsDTO,
    GenreDTO,
    MovieDetailDTO,
    MovieListItemDTO,
    PersonSummaryDTO,
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

    async def get_movie_by_id(self, movie_id: str) -> MovieDetailDTO | None:
        """Busca os detalhes completos de um filme pelo seu sk_movie_id ou id_filme."""
        stmt = (
            select(DimMovie)
            .where((DimMovie.sk_movie_id == movie_id) | (DimMovie.id_filme == movie_id))
            .options(
                selectinload(DimMovie.genres),
                selectinload(DimMovie.companies),
                selectinload(DimMovie.people),
                selectinload(DimMovie.performance),
                selectinload(DimMovie.reviews_summary),
            )
        )
        result = await self.session.execute(stmt)
        movie = result.scalar_one_or_none()
        if not movie:
            return None

        # Categorizar equipe técnica
        diretores: list[PersonSummaryDTO] = []
        roteiristas: list[PersonSummaryDTO] = []
        atores: list[PersonSummaryDTO] = []

        for person in getattr(movie, "people", []):
            p_dto = PersonSummaryDTO(
                sk_person_id=person.sk_person_id,
                nome_pessoa=person.nome_pessoa,
                tipo_pessoa=person.tipo_pessoa,
            )
            if person.tipo_pessoa == "Diretor":
                diretores.append(p_dto)
            elif person.tipo_pessoa == "Roteirista":
                roteiristas.append(p_dto)
            elif person.tipo_pessoa == "Ator":
                atores.append(p_dto)

        # Tratar métricas analíticas e ROI
        perf = getattr(movie, "performance", None)
        roi: float | None = None
        if perf and perf.orcamento_usd and perf.receita_usd and perf.orcamento_usd > 0:
            roi = float(((perf.receita_usd - perf.orcamento_usd) / perf.orcamento_usd) * 100)

        metrics_dto = FinancialMetricsDTO(
            orcamento_usd=getattr(perf, "orcamento_usd", None),
            receita_usd=getattr(perf, "receita_usd", None),
            lucro_usd=getattr(perf, "lucro_usd", None),
            orcamento_brl=getattr(perf, "orcamento_brl", None),
            receita_brl=getattr(perf, "receita_brl", None),
            lucro_brl=getattr(perf, "lucro_brl", None),
            roi_percentual=roi,
            popularidade=float(getattr(perf, "popularidade", 0.0) or 0.0),
            nota_tmdb=float(getattr(perf, "nota_tmdb", None)) if getattr(perf, "nota_tmdb", None) is not None else None,
            qtd_tmdb=getattr(perf, "qtd_tmdb", None),
            nota_imdb=float(getattr(perf, "nota_imdb", None)) if getattr(perf, "nota_imdb", None) is not None else None,
            qtd_imdb=getattr(perf, "qtd_imdb", None),
        )

        rev = getattr(movie, "reviews_summary", None)
        user_rating_val = getattr(rev, "nota_media_usuarios", None)

        return MovieDetailDTO(
            sk_movie_id=movie.sk_movie_id,
            id_filme=movie.id_filme,
            titulo=movie.titulo,
            data_lancamento=movie.data_lancamento.isoformat() if movie.data_lancamento else None,
            ano_lancamento=movie.ano_lancamento,
            duracao_minutos=movie.duracao_minutos,
            status_filme=movie.status_filme,
            sinopse=movie.sinopse,
            url_poster=movie.url_poster,
            url_backdrop=movie.url_backdrop,
            generos=[GenreDTO(sk_genre_id=g.sk_genre_id, nome_genero=g.nome_genero) for g in getattr(movie, "genres", [])],
            produtoras=[CompanyDTO(sk_company_id=c.sk_company_id, nome_produtora=c.nome_produtora) for c in getattr(movie, "companies", [])],
            diretores=diretores,
            roteiristas=roteiristas,
            atores=atores,
            metricas=metrics_dto,
            nota_media_usuarios=float(user_rating_val) if user_rating_val is not None else None,
            qtd_avaliacoes_usuarios=getattr(rev, "qtd_avaliacoes_usuarios", 0) or 0,
        )
