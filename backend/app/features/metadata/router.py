from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.features.metadata.docs import CompaniesDocs, GenresDocs
from app.features.metadata.handler import get_all_genres, get_top_companies
from app.features.movies.schemas import CompanyDTO, GenreDTO

metadata_router = APIRouter()


@metadata_router.get("/genres", GenresDocs.to_dict())
async def list_genres(session: Annotated[AsyncSession, Depends(get_db)]):
    genres = await get_all_genres(session)
    return [GenreDTO.model_validate(genre) for genre in genres]


@metadata_router.get("/companies", CompaniesDocs.to_dict())
async def list_companies(session: Annotated[AsyncSession, Depends(get_db)]):
    companies = await get_top_companies(session)
    return [CompanyDTO.model_validate(c) for c in companies]
