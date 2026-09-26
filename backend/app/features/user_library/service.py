"""Serviço transacional para gestão de biblioteca do usuário (favoritos e watchlist)."""

import math

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.features.user_library.schemas import (
    PaginatedUserLibraryMoviesDTO,
    UserLibraryIdsDTO,
    UserLibraryMovieItemDTO,
    UserMovieInteractionDTO,
)
from app.movies.models import DimMovie, UserMovieInteraction


class UserLibraryService:
    """Serviço para manipulação de interações do usuário (favoritos e watchlist)."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def _resolve_movie_sk_id(self, movie_id: str) -> str | None:
        """Resolve se o identificador informado é sk_movie_id ou id_filme."""
        stmt = select(DimMovie.sk_movie_id).where(
            (DimMovie.sk_movie_id == movie_id) | (DimMovie.id_filme == movie_id)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_user_library_ids(self, user_id: str) -> UserLibraryIdsDTO:
        """Retorna listas de IDs de filmes favoritados e na watchlist para cache leve."""
        fav_stmt = (
            select(UserMovieInteraction.sk_movie_id)
            .where(
                UserMovieInteraction.user_id == user_id,
                UserMovieInteraction.is_favorite.is_(True),
            )
            .order_by(UserMovieInteraction.updated_at.desc())
        )
        fav_res = await self.session.execute(fav_stmt)
        favorites = list(fav_res.scalars().all())

        watch_stmt = (
            select(UserMovieInteraction.sk_movie_id)
            .where(
                UserMovieInteraction.user_id == user_id,
                UserMovieInteraction.in_watchlist.is_(True),
            )
            .order_by(UserMovieInteraction.updated_at.desc())
        )
        watch_res = await self.session.execute(watch_stmt)
        watchlist = list(watch_res.scalars().all())

        return UserLibraryIdsDTO(favorites=favorites, watchlist=watchlist)

    async def get_movie_interaction(
        self, user_id: str, movie_id: str
    ) -> UserMovieInteractionDTO | None:
        """Retorna o status de interação do usuário com um filme específico."""
        sk_id = await self._resolve_movie_sk_id(movie_id)
        if not sk_id:
            return None

        stmt = select(UserMovieInteraction).where(
            UserMovieInteraction.user_id == user_id,
            UserMovieInteraction.sk_movie_id == sk_id,
        )
        res = await self.session.execute(stmt)
        interaction = res.scalar_one_or_none()
        if not interaction:
            return None
        return UserMovieInteractionDTO.model_validate(interaction)

    async def toggle_favorite(self, user_id: str, movie_id: str) -> UserMovieInteractionDTO:
        """Inverte o status de favorito de um filme para o usuário."""
        sk_id = await self._resolve_movie_sk_id(movie_id)
        if not sk_id:
            raise ValueError(f"Filme com identificador '{movie_id}' não encontrado")

        stmt = select(UserMovieInteraction).where(
            UserMovieInteraction.user_id == user_id,
            UserMovieInteraction.sk_movie_id == sk_id,
        )
        res = await self.session.execute(stmt)
        interaction = res.scalar_one_or_none()

        if interaction is None:
            interaction = UserMovieInteraction(
                user_id=user_id,
                sk_movie_id=sk_id,
                is_favorite=True,
                in_watchlist=False,
            )
            self.session.add(interaction)
        else:
            interaction.is_favorite = not interaction.is_favorite

        await self.session.commit()
        await self.session.refresh(interaction)
        return UserMovieInteractionDTO.model_validate(interaction)

    async def toggle_watchlist(self, user_id: str, movie_id: str) -> UserMovieInteractionDTO:
        """Inverte o status de watchlist de um filme para o usuário."""
        sk_id = await self._resolve_movie_sk_id(movie_id)
        if not sk_id:
            raise ValueError(f"Filme com identificador '{movie_id}' não encontrado")

        stmt = select(UserMovieInteraction).where(
            UserMovieInteraction.user_id == user_id,
            UserMovieInteraction.sk_movie_id == sk_id,
        )
        res = await self.session.execute(stmt)
        interaction = res.scalar_one_or_none()

        if interaction is None:
            interaction = UserMovieInteraction(
                user_id=user_id,
                sk_movie_id=sk_id,
                is_favorite=False,
                in_watchlist=True,
            )
            self.session.add(interaction)
        else:
            interaction.in_watchlist = not interaction.in_watchlist

        await self.session.commit()
        await self.session.refresh(interaction)
        return UserMovieInteractionDTO.model_validate(interaction)

    async def get_library_movies(
        self,
        user_id: str,
        list_type: str = "favorites",
        page: int = 1,
        page_size: int = 20,
    ) -> PaginatedUserLibraryMoviesDTO:
        """Retorna lista paginada de filmes salvos na biblioteca do usuário."""
        query = select(UserMovieInteraction).where(UserMovieInteraction.user_id == user_id)

        if list_type == "favorites":
            query = query.where(UserMovieInteraction.is_favorite.is_(True))
        elif list_type == "watchlist":
            query = query.where(UserMovieInteraction.in_watchlist.is_(True))
        else:
            query = query.where(
                (UserMovieInteraction.is_favorite.is_(True))
                | (UserMovieInteraction.in_watchlist.is_(True))
            )

        # Contagem total
        count_stmt = select(func.count()).select_from(query.subquery())
        count_res = await self.session.execute(count_stmt)
        total = count_res.scalar_one()

        offset = (page - 1) * page_size
        paged_stmt = (
            query.options(
                selectinload(UserMovieInteraction.movie).selectinload(DimMovie.genres),
                selectinload(UserMovieInteraction.movie).selectinload(DimMovie.people),
                selectinload(UserMovieInteraction.movie).selectinload(DimMovie.reviews_summary),
            )
            .order_by(UserMovieInteraction.updated_at.desc())
            .offset(offset)
            .limit(page_size)
        )

        res = await self.session.execute(paged_stmt)
        interactions = res.scalars().all()

        items: list[UserLibraryMovieItemDTO] = []
        for inter in interactions:
            m = inter.movie
            genres = [g.nome_genero for g in m.genres] if m.genres else []
            diretores = (
                [p.nome_pessoa for p in m.people if p.tipo_pessoa == "Diretor"]
                if m.people
                else []
            )
            rating = m.reviews_summary.nota_media_usuarios if m.reviews_summary else None
            rating_count = m.reviews_summary.qtd_avaliacoes_usuarios if m.reviews_summary else 0

            items.append(
                UserLibraryMovieItemDTO(
                    sk_movie_id=m.sk_movie_id,
                    id_filme=m.id_filme,
                    titulo=m.titulo,
                    ano_lancamento=m.ano_lancamento,
                    duracao_minutos=m.duracao_minutos,
                    url_poster=m.url_poster,
                    url_backdrop=m.url_backdrop,
                    nota_media_usuarios=rating,
                    qtd_avaliacoes_usuarios=rating_count,
                    generos=genres,
                    diretores=diretores,
                    is_favorite=inter.is_favorite,
                    in_watchlist=inter.in_watchlist,
                    updated_at=inter.updated_at,
                )
            )

        total_pages = math.ceil(total / page_size) if total > 0 else 1

        return PaginatedUserLibraryMoviesDTO(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )
