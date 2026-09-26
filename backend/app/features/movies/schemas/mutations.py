from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class MovieCreateDTO(BaseModel):
    """Payload para criação de um novo filme pelo administrador."""

    model_config = ConfigDict(extra="forbid")

    titulo: str = Field(..., min_length=1, max_length=500, description="Título oficial do filme")
    diretor: str | None = Field(
        default=None, max_length=255, description="Nome do diretor principal da obra"
    )
    ano_lancamento: int = Field(
        ..., ge=1888, le=2030, description="Ano de lançamento entre 1888 e 2030"
    )
    data_lancamento: date | None = Field(
        default=None, description="Data completa de lançamento se disponível"
    )
    duracao_minutos: int | None = Field(
        default=None, ge=1, le=1000, description="Duração do filme em minutos"
    )
    status_filme: str | None = Field(
        default="Released", max_length=50, description="Status de lançamento da obra"
    )
    sinopse: str | None = Field(
        default=None, max_length=4000, description="Sinopse narrativa do filme"
    )
    url_poster: str | None = Field(
        default=None, max_length=2048, description="URL do pôster oficial (2:3)"
    )
    url_backdrop: str | None = Field(
        default=None, max_length=2048, description="URL da imagem de fundo panorâmica"
    )
    generos_ids: list[str] = Field(
        default_factory=list, description="Lista de identificadores dos gêneros associados"
    )


class MovieUpdateDTO(BaseModel):
    """Payload para atualização de filme existente pelo administrador."""

    model_config = ConfigDict(extra="forbid")

    titulo: str | None = Field(
        default=None, min_length=1, max_length=500, description="Título oficial do filme"
    )
    diretor: str | None = Field(
        default=None, max_length=255, description="Nome do diretor principal da obra"
    )
    ano_lancamento: int | None = Field(
        default=None, ge=1888, le=2030, description="Ano de lançamento entre 1888 e 2030"
    )
    data_lancamento: date | None = Field(
        default=None, description="Data completa de lançamento se disponível"
    )
    duracao_minutos: int | None = Field(
        default=None, ge=1, le=1000, description="Duração do filme em minutos"
    )
    status_filme: str | None = Field(
        default=None, max_length=50, description="Status de lançamento da obra"
    )
    sinopse: str | None = Field(
        default=None, max_length=4000, description="Sinopse narrativa do filme"
    )
    url_poster: str | None = Field(
        default=None, max_length=2048, description="URL do pôster oficial (2:3)"
    )
    url_backdrop: str | None = Field(
        default=None, max_length=2048, description="URL da imagem de fundo panorâmica"
    )
    generos_ids: list[str] | None = Field(
        default=None, description="Lista de identificadores dos gêneros associados"
    )
