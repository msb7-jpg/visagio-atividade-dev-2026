from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.db.session import get_db
from app.features.auth.router import get_current_admin
from app.features.auth.schemas import AdminUserDTO
from app.features.movies.docs import (
    AvailableStatusesDoc,
    AvailableYearsDoc,
    CreateMovieDoc,
    DeleteMovieDoc,
    GetMovieDetailDoc,
    ListMoviesDoc,
    QuickSearchDoc,
    UpdateMovieDoc,
)
from app.features.movies.repository import MoviesRepository
from app.features.movies.schemas import (
    MovieCreateDTO,
    MovieDetailDTO,
    MovieFilterParams,
    MovieListItemDTO,
    MovieUpdateDTO,
    QuickSearchMovieDTO,
)
from app.features.movies.service import MoviesService
from app.shared.pagination import PaginatedResponse

movies_router = APIRouter()

MoviesRepo = Annotated[
    MoviesRepository,
    Depends(lambda session=Depends(get_db): MoviesRepository(session)),
]

MoviesServ = Annotated[
    MoviesService,
    Depends(lambda session=Depends(get_db): MoviesService(session)),
]


@movies_router.get("", **ListMoviesDoc.to_dict())
async def list_movies(
    filters: Annotated[MovieFilterParams, Depends()],
    repo: MoviesRepo,
) -> PaginatedResponse[MovieListItemDTO]:
    return await repo.list_movies(filters)


@movies_router.get("/quick-search", **QuickSearchDoc.to_dict())
async def quick_search(
    q: Annotated[str, Query(min_length=2, description="Termo de pesquisa rápido")],
    repo: MoviesRepo,
    limit: Annotated[int, Query(ge=1, le=20, description="Limite máximo de resultados")] = 10,
) -> list[QuickSearchMovieDTO]:
    return await repo.quick_search(query=q, limit=limit)


@movies_router.get("/available-years", **AvailableYearsDoc.to_dict())
async def get_available_years(
    repo: MoviesRepo,
) -> list[int]:
    """Retorna os anos distintos de lançamento disponíveis no catálogo."""
    return await repo.get_available_years()


@movies_router.get("/available-statuses", **AvailableStatusesDoc.to_dict())
async def get_available_statuses(
    repo: MoviesRepo,
) -> list[str]:
    """Retorna os status de filmes disponíveis no catálogo."""
    return await repo.get_available_statuses()


@movies_router.get("/{movie_id}", **GetMovieDetailDoc.to_dict())
async def get_movie_detail(
    movie_id: str,
    repo: MoviesRepo,
) -> MovieDetailDTO:
    if not (movie := await repo.get_movie_by_id(movie_id)):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Filme com ID '{movie_id}' não foi encontrado.",
        )
    return movie


@movies_router.post("", **CreateMovieDoc.to_dict())
async def create_movie(
    payload: MovieCreateDTO,
    service: MoviesServ,
    _current_admin: Annotated[AdminUserDTO, Depends(get_current_admin)],
) -> MovieDetailDTO:
    """Cria um novo filme no catálogo (Requer Admin)."""
    return await service.create_movie(payload)


@movies_router.put("/{movie_id}", **UpdateMovieDoc.to_dict())
async def update_movie(
    movie_id: str,
    payload: MovieUpdateDTO,
    service: MoviesServ,
    _current_admin: Annotated[AdminUserDTO, Depends(get_current_admin)],
) -> MovieDetailDTO:
    """Atualiza informações de um filme existente (Requer Admin)."""
    updated = await service.update_movie(movie_id, payload)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Filme com ID '{movie_id}' não foi encontrado para atualização.",
        )
    return updated


@movies_router.delete("/{movie_id}", **DeleteMovieDoc.to_dict())
async def delete_movie(
    movie_id: str,
    service: MoviesServ,
    _current_admin: Annotated[AdminUserDTO, Depends(get_current_admin)],
) -> None:
    """Exclui um filme do catálogo e suas associações (Requer Admin)."""
    deleted = await service.delete_movie(movie_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Filme com ID '{movie_id}' não foi encontrado para exclusão.",
        )
