"""Rotas RESTful para o slice de Pessoas."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.db.session import get_db
from app.features.movies.schemas import MovieFilterParams, MovieListItemDTO
from app.features.people.docs import (
    GetPersonDetailDoc,
    GetPersonMoviesDoc,
    QuickSearchPeopleDoc,
)
from app.features.people.repository import PeopleRepository
from app.features.people.schemas import PersonDetailDTO, QuickSearchPersonDTO
from app.shared.pagination import PaginatedResponse

people_router = APIRouter()

PeopleRepo = Annotated[
    PeopleRepository,
    Depends(lambda session=Depends(get_db): PeopleRepository(session)),
]


@people_router.get("/quick-search", **QuickSearchPeopleDoc.to_dict())
async def quick_search_people(
    q: Annotated[str, Query(min_length=2, description="Termo de pesquisa rápido")],
    repo: PeopleRepo,
    limit: Annotated[int, Query(ge=1, le=20, description="Limite máximo de resultados")] = 10,
) -> list[QuickSearchPersonDTO]:
    """Busca rápida de pessoas para alimentar a Command Palette."""
    return await repo.quick_search(query=q, limit=limit)


@people_router.get("/{person_id}", **GetPersonDetailDoc.to_dict())
async def get_person_detail(
    person_id: str,
    repo: PeopleRepo,
) -> PersonDetailDTO:
    """Retorna detalhes e estatísticas de carreira de uma pessoa."""
    person = await repo.get_person_detail(person_id)
    if not person:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pessoa com identificador '{person_id}' não encontrada.",
        )
    return person


@people_router.get("/{person_id}/movies", **GetPersonMoviesDoc.to_dict())
async def get_person_movies(
    person_id: str,
    filters: Annotated[MovieFilterParams, Depends()],
    repo: PeopleRepo,
) -> PaginatedResponse[MovieListItemDTO]:
    """Retorna a filmografia paginada e filtrada de uma pessoa."""
    result = await repo.get_person_movies(person_id, filters)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pessoa com identificador '{person_id}' não encontrada.",
        )
    return result
