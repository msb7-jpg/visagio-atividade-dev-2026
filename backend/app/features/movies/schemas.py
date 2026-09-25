from decimal import Decimal
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field


class GenreDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sk_genre_id: str
    nome_genero: str


class CompanyDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sk_company_id: str
    nome_produtora: str


class MovieListItemDTO(BaseModel):
    """Item resumido do catálogo de filmes para Grid ou List."""
    model_config = ConfigDict(from_attributes=True)

    sk_movie_id: str
    id_filme: str
    titulo: str
    ano_lancamento: int | None = None
    duracao_minutos: int | None = None
    sinopse: str | None = None
    url_poster: str | None = None
    url_backdrop: str | None = None
    
    # Metadados adicionais
    generos: list[str] = Field(default_factory=list)
    diretores: list[str] = Field(default_factory=list)
    produtoras: list[str] = Field(default_factory=list)

    # Indicadores analíticos
    popularidade: float = 0.0
    nota_media_usuarios: float | None = None
    qtd_avaliacoes_usuarios: int = 0
    nota_tmdb: float | None = None
    nota_imdb: float | None = None
    receita_usd: Decimal | None = None
    receita_brl: Decimal | None = None


class QuickSearchMovieDTO(BaseModel):
    """Item ultraleve otimizado para Spotlight / Command Palette."""
    model_config = ConfigDict(from_attributes=True)

    sk_movie_id: str
    id_filme: str
    titulo: str
    ano_lancamento: int | None = None
    url_poster: str | None = None
    nota_media_usuarios: float | None = None
    popularidade: float = 0.0
    generos: list[str] = Field(default_factory=list)


SortField = Literal[
    "popularidade",
    "nota_media_usuarios",
    "receita_usd",
    "ano_lancamento",
    "titulo",
]
SortOrder = Literal["asc", "desc"]
