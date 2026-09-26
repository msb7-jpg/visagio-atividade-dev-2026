"""Schemas Pydantic para a biblioteca do usuário (favoritos e watchlist)."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UserLibraryIdsDTO(BaseModel):
    """IDs de filmes favoritados e na watchlist do usuário para cache leve."""

    model_config = ConfigDict(from_attributes=True)

    favorites: list[str] = Field(
        default_factory=list,
        description="Lista de IDs substitutos (sk_movie_id) dos filmes favoritados",
    )
    watchlist: list[str] = Field(
        default_factory=list,
        description="Lista de IDs substitutos (sk_movie_id) dos filmes na watchlist",
    )


class UserMovieInteractionDTO(BaseModel):
    """Status consolidado de interação do usuário com um filme."""

    model_config = ConfigDict(from_attributes=True)

    sk_movie_id: str = Field(..., description="ID substituto do filme")
    is_favorite: bool = Field(..., description="Se o filme está marcado como favorito")
    in_watchlist: bool = Field(..., description="Se o filme está na watchlist")
    updated_at: datetime = Field(..., description="Data/hora da última alteração")


class UserLibraryMovieItemDTO(BaseModel):
    """Dados resumidos de um filme pertencente à biblioteca do usuário."""

    model_config = ConfigDict(from_attributes=True)

    sk_movie_id: str
    id_filme: str
    titulo: str
    ano_lancamento: int | None = None
    duracao_minutos: int | None = None
    url_poster: str | None = None
    url_backdrop: str | None = None
    nota_media_usuarios: float | None = None
    qtd_avaliacoes_usuarios: int = 0
    generos: list[str] = Field(default_factory=list)
    diretores: list[str] = Field(default_factory=list)
    is_favorite: bool = False
    in_watchlist: bool = False
    updated_at: datetime


class PaginatedUserLibraryMoviesDTO(BaseModel):
    """Resposta paginada de filmes da biblioteca do usuário."""

    items: list[UserLibraryMovieItemDTO]
    total: int
    page: int
    page_size: int
    total_pages: int
