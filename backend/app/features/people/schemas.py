"""Schemas Pydantic para o slice de Pessoas (diretores, atores, roteiristas)."""

from pydantic import BaseModel, ConfigDict, Field


class PersonDetailDTO(BaseModel):
    """Perfil detalhado de uma pessoa com agregados de sua filmografia."""

    model_config = ConfigDict(from_attributes=True)

    sk_person_id: str = Field(..., description="ID substituto da pessoa")
    nome_pessoa: str = Field(..., description="Nome completo da pessoa")
    tipo_pessoa: str = Field(..., description="Papel principal ou registrado da pessoa")
    total_filmes: int = Field(0, description="Total de filmes relacionados no catálogo")
    nota_media_filmes: float | None = Field(
        None, description="Nota média agregada das avaliações dos filmes desta pessoa"
    )
    primeiro_ano: int | None = Field(
        None, description="Ano do filme mais antigo registrado"
    )
    ultimo_ano: int | None = Field(
        None, description="Ano do filme mais recente registrado"
    )
    papeis: list[str] = Field(
        default_factory=list, description="Lista de papéis desempenhados (Ator, Diretor, etc.)"
    )


class QuickSearchPersonDTO(BaseModel):
    """Item ultraleve para Command Palette / Spotlight."""

    model_config = ConfigDict(from_attributes=True)

    sk_person_id: str
    nome_pessoa: str
    tipo_pessoa: str
    total_filmes: int = 0
    papeis: list[str] = Field(default_factory=list, description="Lista de papéis desempenhados")

