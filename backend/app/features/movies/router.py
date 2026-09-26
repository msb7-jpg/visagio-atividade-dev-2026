from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.features.movies.repository import MoviesRepository
from app.features.movies.schemas import (
    MovieDetailDTO,
    MovieListItemDTO,
    QuickSearchMovieDTO,
    SortField,
    SortOrder,
)
from app.shared.pagination import PaginatedResponse, PaginationParams

movies_router = APIRouter()


def get_movies_repository(
    session: Annotated[AsyncSession, Depends(get_db)],
) -> MoviesRepository:
    return MoviesRepository(session)


@movies_router.get(
    "",
    response_model=PaginatedResponse[MovieListItemDTO],
    summary="Listagem paginada e filtrada de filmes para o catálogo",
)
async def list_movies(
    page: Annotated[int, Query(ge=1, description="Página atual")] = 1,
    page_size: Annotated[int, Query(ge=1, le=100, description="Itens por página")] = 20,
    q: Annotated[str | None, Query(description="Busca textual por título ou diretor/ator")] = None,
    genre: Annotated[str | None, Query(description="Filtro de gênero")] = None,
    sort_by: Annotated[SortField, Query(description="Campo de ordenação")] = "popularidade",
    order: Annotated[SortOrder, Query(description="Direção da ordenação (asc/desc)")] = "desc",
    repo: MoviesRepository = Depends(get_movies_repository),
) -> PaginatedResponse[MovieListItemDTO]:
    params = PaginationParams(page=page, page_size=page_size)
    return await repo.list_movies(
        params=params,
        query=q,
        genre=genre,
        sort_by=sort_by,
        order=order,
    )


@movies_router.get(
    "/quick-search",
    response_model=list[QuickSearchMovieDTO],
    summary="Busca rápida otimizada para Command Palette / Spotlight",
)
async def quick_search(
    q: Annotated[str, Query(min_length=2, description="Termo de pesquisa rápido")],
    limit: Annotated[int, Query(ge=1, le=20, description="Limite máximo de resultados")] = 10,
    repo: MoviesRepository = Depends(get_movies_repository),
) -> list[QuickSearchMovieDTO]:
    return await repo.quick_search(query=q, limit=limit)


@movies_router.get(
    "/{movie_id}",
    response_model=MovieDetailDTO,
    summary="Obtém a ficha técnica completa e métricas de um filme por ID",
)
async def get_movie_detail(
    movie_id: str,
    repo: MoviesRepository = Depends(get_movies_repository),
) -> MovieDetailDTO:
    movie = await repo.get_movie_by_id(movie_id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Filme com ID '{movie_id}' não foi encontrado.",
        )
    return movie
