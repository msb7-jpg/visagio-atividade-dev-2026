from typing import Annotated, Literal

from fastapi import Query
from pydantic import BaseModel

from app.shared.pagination import PaginationParams

SortField = Literal[
    "popularidade",
    "nota_media_usuarios",
    "receita_usd",
    "ano_lancamento",
    "titulo",
]
SortOrder = Literal["asc", "desc"]


class MovieFilterParams(BaseModel):
    page: Annotated[int, Query(ge=1, description="Página atual")] = 1
    page_size: Annotated[int, Query(ge=1, le=100, description="Itens por página")] = 20

    q: Annotated[str | None, Query(description="Busca textual por título ou diretor/ator")] = None
    genre: Annotated[str | None, Query(description="Filtro de gênero")] = None
    company: Annotated[str | None, Query(description="Filtro de produtora/estúdio")] = None
    year: Annotated[int | None, Query(description="Filtro de ano de lançamento")] = None

    sort_by: Annotated[SortField, Query(description="Campo de ordenação")] = "popularidade"
    order: Annotated[SortOrder, Query(description="Direção da ordenação (asc/desc)")] = "desc"

    def to_pagination_params(self) -> PaginationParams:
        """Converte para o objeto unificado de paginação."""
        return PaginationParams(page=self.page, page_size=self.page_size)
