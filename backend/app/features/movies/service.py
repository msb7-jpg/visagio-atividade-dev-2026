from uuid import uuid4

from sqlalchemy import delete, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.features.movies.schemas import (
    MovieCreateDTO,
    MovieDetailDTO,
    MovieUpdateDTO,
)
from app.movies.models import (
    DimGenre,
    DimMovie,
    DimPerson,
    DimReview,
    FactMoviePerformance,
    bridge_movie_company,
    bridge_movie_genre,
    bridge_movie_person,
    generate_surrogate_key,
)


class MoviesService:
    """Serviço de operações transacionais e mutações do catálogo de filmes."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def _resolve_movie(self, movie_id: str) -> DimMovie | None:
        """Busca o modelo DimMovie com relacionamentos pré-carregados para mutações seguras."""
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
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def create_movie(self, data: MovieCreateDTO) -> MovieDetailDTO:
        """Cadastra um novo filme no catálogo com relacionamentos atômicos."""
        sk_movie_id = generate_surrogate_key()
        # Gera id_filme único compatível
        unique_id = f"custom-{uuid4().hex[:10]}"

        movie = DimMovie(
            sk_movie_id=sk_movie_id,
            id_filme=unique_id,
            titulo=data.titulo.strip(),
            ano_lancamento=data.ano_lancamento,
            data_lancamento=data.data_lancamento,
            duracao_minutos=data.duracao_minutos,
            status_filme=data.status_filme or "Released",
            sinopse=data.sinopse.strip() if data.sinopse else None,
            url_poster=data.url_poster.strip() if data.url_poster else None,
            url_backdrop=data.url_backdrop.strip() if data.url_backdrop else None,
        )

        # Associar gêneros se fornecidos
        if data.generos_ids:
            genre_stmt = select(DimGenre).where(
                or_(
                    DimGenre.sk_genre_id.in_(data.generos_ids),
                    DimGenre.nome_genero.in_(data.generos_ids),
                )
            )
            genres_res = await self.session.execute(genre_stmt)
            movie.genres = list(genres_res.scalars().all())
        else:
            movie.genres = []

        # Associar diretor se informado
        if data.diretor and data.diretor.strip():
            director_name = data.diretor.strip()
            person_stmt = select(DimPerson).where(
                (DimPerson.nome_pessoa == director_name) & (DimPerson.tipo_pessoa == "Diretor")
            )
            person_res = await self.session.execute(person_stmt)
            person = person_res.scalar_one_or_none()
            if not person:
                person = DimPerson(
                    sk_person_id=generate_surrogate_key(),
                    nome_pessoa=director_name,
                    tipo_pessoa="Diretor",
                )
                self.session.add(person)
                await self.session.flush()

            movie.people = [person]
        else:
            movie.people = []

        # Inicializa métricas analíticas e sumário de avaliações neutros
        performance = FactMoviePerformance(
            sk_movie_id=sk_movie_id,
            orcamento_usd=0,
            receita_usd=0,
            lucro_usd=0,
            popularidade=0.0,
        )
        reviews_summary = DimReview(
            sk_movie_id=sk_movie_id,
            qtd_avaliacoes_usuarios=0,
            nota_media_usuarios=None,
        )

        movie.performance = performance
        movie.reviews_summary = reviews_summary

        self.session.add(movie)
        await self.session.commit()

        # Recarrega para gerar DTO consistente
        reloaded = await self._resolve_movie(sk_movie_id)
        if not reloaded:
            raise RuntimeError("Falha ao recuperar filme recém-criado.")
        return MovieDetailDTO.from_model(reloaded)

    async def update_movie(self, movie_id: str, data: MovieUpdateDTO) -> MovieDetailDTO | None:
        """Atualiza informações de um filme existente e seus relacionamentos."""
        movie = await self._resolve_movie(movie_id)
        if not movie:
            return None

        if data.titulo is not None:
            movie.titulo = data.titulo.strip()
        if data.ano_lancamento is not None:
            movie.ano_lancamento = data.ano_lancamento
        if data.data_lancamento is not None:
            movie.data_lancamento = data.data_lancamento
        if data.duracao_minutos is not None:
            movie.duracao_minutos = data.duracao_minutos
        if data.status_filme is not None:
            movie.status_filme = data.status_filme
        if data.sinopse is not None:
            movie.sinopse = data.sinopse.strip() if data.sinopse else None
        if data.url_poster is not None:
            movie.url_poster = data.url_poster.strip() if data.url_poster else None
        if data.url_backdrop is not None:
            movie.url_backdrop = data.url_backdrop.strip() if data.url_backdrop else None

        # Atualização de gêneros se a lista foi explicitamente enviada
        if data.generos_ids is not None:
            if data.generos_ids:
                genre_stmt = select(DimGenre).where(
                    or_(
                        DimGenre.sk_genre_id.in_(data.generos_ids),
                        DimGenre.nome_genero.in_(data.generos_ids),
                    )
                )
                genres_res = await self.session.execute(genre_stmt)
                movie.genres = list(genres_res.scalars().all())
            else:
                movie.genres = []

        # Atualização do diretor se explicitamente enviado
        if data.diretor is not None:
            # Preserva elenco e roteiristas, remove diretores anteriores
            non_directors = [p for p in movie.people if p.tipo_pessoa != "Diretor"]
            if data.diretor.strip():
                director_name = data.diretor.strip()
                person_stmt = select(DimPerson).where(
                    (DimPerson.nome_pessoa == director_name)
                    & (DimPerson.tipo_pessoa == "Diretor")
                )
                person_res = await self.session.execute(person_stmt)
                person = person_res.scalar_one_or_none()
                if not person:
                    person = DimPerson(
                        sk_person_id=generate_surrogate_key(),
                        nome_pessoa=director_name,
                        tipo_pessoa="Diretor",
                    )
                    self.session.add(person)
                    await self.session.flush()

                movie.people = non_directors + [person]
            else:
                movie.people = non_directors

        await self.session.commit()

        reloaded = await self._resolve_movie(movie.sk_movie_id)
        if not reloaded:
            return None
        return MovieDetailDTO.from_model(reloaded)

    async def delete_movie(self, movie_id: str) -> bool:
        """Exclui um filme e remove atomicamente suas pontes e registros associados."""
        movie = await self._resolve_movie(movie_id)
        if not movie:
            return False

        # Desvincula relacionamentos m2m via ORM para evitar conflitos de StaleDataError
        movie.genres = []
        movie.companies = []
        movie.people = []
        await self.session.flush()

        await self.session.delete(movie)
        await self.session.commit()
        return True
