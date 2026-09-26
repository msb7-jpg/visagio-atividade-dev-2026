from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.features.metadata.docs import CompaniesDocs, DirectorsDocs, GenresDocs
from app.features.metadata.handler import (
    get_all_genres,
    get_top_companies,
    search_directors,
)
from app.features.movies.schemas import CompanyDTO, GenreDTO, PersonSummaryDTO

metadata_router = APIRouter()


@metadata_router.get("/genres", **GenresDocs.to_dict())
async def list_genres(session: Annotated[AsyncSession, Depends(get_db)]):
    genres = await get_all_genres(session)
    return [GenreDTO.model_validate(genre) for genre in genres]


@metadata_router.get("/companies", **CompaniesDocs.to_dict())
async def list_companies(session: Annotated[AsyncSession, Depends(get_db)]):
    companies = await get_top_companies(session)
    return [CompanyDTO.model_validate(c) for c in companies]


@metadata_router.get("/directors", **DirectorsDocs.to_dict())
async def list_directors(
    session: Annotated[AsyncSession, Depends(get_db)],
    search: str = Query("", description="Termo de busca para o nome do diretor"),
    limit: int = Query(20, ge=1, le=100, description="Quantidade máxima de diretores retornados"),
):
    directors = await search_directors(session, search=search, limit=limit)
    return [PersonSummaryDTO.model_validate(d) for d in directors]
