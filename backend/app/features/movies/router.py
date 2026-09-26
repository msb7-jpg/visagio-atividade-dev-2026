from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.db.session import get_db
from app.features.movies.docs import (
    GetMovieDetailDoc,
    ListMoviesDoc,
    QuickSearchDoc,
)
from app.features.movies.repository import MoviesRepository
from app.features.movies.schemas import (
    MovieDetailDTO,
    MovieFilterParams,
    MovieListItemDTO,
    QuickSearchMovieDTO,
)
from app.shared.pagination import PaginatedResponse

movies_router = APIRouter()

MoviesRepo = Annotated[
    MoviesRepository,
    Depends(lambda session=Depends(get_db): MoviesRepository(session)),
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
