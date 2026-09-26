"""Rotas da biblioteca do usuário (favoritos e watchlist)."""

from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.features.auth.router import get_current_admin
from app.features.auth.schemas import AdminUserDTO
from app.features.user_library.docs import (
    GetLibraryIdsDoc,
    GetLibraryMoviesDoc,
    GetMovieInteractionDoc,
    ToggleFavoriteDoc,
    ToggleWatchlistDoc,
)
from app.features.user_library.schemas import (
    PaginatedUserLibraryMoviesDTO,
    UserLibraryIdsDTO,
    UserMovieInteractionDTO,
)
from app.features.user_library.service import UserLibraryService

user_library_router = APIRouter()


@user_library_router.get("/library/ids", **GetLibraryIdsDoc.to_dict())
async def get_library_ids(
    current_user: Annotated[AdminUserDTO, Depends(get_current_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UserLibraryIdsDTO:
    """Retorna IDs de filmes favoritados e na watchlist do usuário."""
    service = UserLibraryService(db)
    return await service.get_user_library_ids(current_user.id)


@user_library_router.get("/library/movies", **GetLibraryMoviesDoc.to_dict())
async def get_library_movies(
    current_user: Annotated[AdminUserDTO, Depends(get_current_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
    type: Literal["favorites", "watchlist", "all"] = Query(
        "favorites", description="Tipo de lista desejada"
    ),
    page: int = Query(1, ge=1, description="Número da página"),
    page_size: int = Query(20, ge=1, le=100, description="Tamanho da página"),
) -> PaginatedUserLibraryMoviesDTO:
    """Lista filmes salvos na biblioteca do usuário."""
    service = UserLibraryService(db)
    return await service.get_library_movies(
        user_id=current_user.id,
        list_type=type,
        page=page,
        page_size=page_size,
    )


@user_library_router.post("/library/{movie_id}/favorite", **ToggleFavoriteDoc.to_dict())
async def toggle_favorite(
    movie_id: str,
    current_user: Annotated[AdminUserDTO, Depends(get_current_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UserMovieInteractionDTO:
    """Alterna o status de favorito de um filme para o usuário autenticado."""
    service = UserLibraryService(db)
    try:
        return await service.toggle_favorite(current_user.id, movie_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        ) from e


@user_library_router.post("/library/{movie_id}/watchlist", **ToggleWatchlistDoc.to_dict())
async def toggle_watchlist(
    movie_id: str,
    current_user: Annotated[AdminUserDTO, Depends(get_current_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UserMovieInteractionDTO:
    """Alterna a presença de um filme na watchlist do usuário autenticado."""
    service = UserLibraryService(db)
    try:
        return await service.toggle_watchlist(current_user.id, movie_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        ) from e


@user_library_router.get("/library/{movie_id}", **GetMovieInteractionDoc.to_dict())
async def get_movie_interaction(
    movie_id: str,
    current_user: Annotated[AdminUserDTO, Depends(get_current_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UserMovieInteractionDTO | None:
    """Retorna os dados de interação do filme com o usuário logado."""
    service = UserLibraryService(db)
    interaction = await service.get_movie_interaction(current_user.id, movie_id)
    if not interaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nenhuma interação registrada para este filme",
        )
    return interaction
