from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.movies.models import DimCompany, DimGenre


async def get_all_genres(session: AsyncSession) -> list[DimGenre]:
    stmt = select(DimGenre).order_by(DimGenre.nome_genero)
    result = await session.execute(stmt)
    return list(result.scalars().all())

async def get_top_companies(session: AsyncSession, limit: int = 50) -> list[DimCompany]:
    stmt = select(DimCompany).order_by(DimCompany.nome_produtora).limit(limit)
    result = await session.execute(stmt)
    return list(result.scalars().all())
