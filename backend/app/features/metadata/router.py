from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.features.movies.schemas import CompanyDTO, GenreDTO
from app.movies.models import DimCompany, DimGenre

metadata_router = APIRouter()


@metadata_router.get(
    "/genres",
    response_model=list[GenreDTO],
    summary="Listagem deduplicada de gêneros para filtros",
)
async def list_genres(
    session: Annotated[AsyncSession, Depends(get_db)],
) -> list[GenreDTO]:
    stmt = select(DimGenre).order_by(DimGenre.nome_genero)
    result = await session.execute(stmt)
    genres = result.scalars().all()
    return [GenreDTO.model_validate(g) for g in genres]


@metadata_router.get(
    "/companies",
    response_model=list[CompanyDTO],
    summary="Listagem de estúdios e produtoras para filtros analíticos",
)
async def list_companies(
    session: Annotated[AsyncSession, Depends(get_db)],
) -> list[CompanyDTO]:
    stmt = select(DimCompany).order_by(DimCompany.nome_produtora).limit(50)
    result = await session.execute(stmt)
    companies = result.scalars().all()
    return [CompanyDTO.model_validate(c) for c in companies]
