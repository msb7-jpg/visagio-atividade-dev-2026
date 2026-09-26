from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReviewCreateDTO(BaseModel):
    """Contrato de entrada para criação de uma avaliação de filme."""

    model_config = ConfigDict(str_strip_whitespace=True)

    nome: str = Field(
        ...,
        min_length=2,
        max_length=120,
        description="Nome do autor da avaliação",
        examples=["Lucas Silveira"],
    )
    nota: float = Field(
        ...,
        ge=0.0,
        le=10.0,
        description="Nota atribuída ao filme de 0 a 10",
        examples=[9.0],
    )
    comentario: str | None = Field(
        default=None,
        max_length=4000,
        description="Comentário ou resenha opcional do filme",
        examples=["Filme sensacional com atuações brilhantes e trilha impecável."],
    )


class ReviewResponseDTO(BaseModel):
    """Contrato de retorno de uma avaliação cadastrada."""

    model_config = ConfigDict(from_attributes=True)

    sk_movie_review_id: str
    sk_movie_id: str
    nome: str
    nota: float
    comentario: str | None = None
    created_at: datetime


class ReviewSummaryDTO(BaseModel):
    """Resumo consolidado de avaliações do filme."""

    model_config = ConfigDict(from_attributes=True)

    qtd_avaliacoes_usuarios: int = 0
    nota_media_usuarios: float | None = None
