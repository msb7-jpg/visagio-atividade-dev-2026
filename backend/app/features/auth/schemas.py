"""Schemas Pydantic para o domínio de autenticação administrativa."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LoginRequest(BaseModel):
    """Payload de requisição para login de administrador."""

    model_config = ConfigDict(extra="forbid")

    email: EmailStr = Field(
        ...,
        description="E-mail de acesso administrativo",
        examples=["admin@rocketfilms.com"],
    )
    senha: str = Field(
        ...,
        min_length=1,
        description="Senha do administrador",
        examples=["admin123"],
    )


class TokenResponse(BaseModel):
    """Resposta com token de acesso JWT emitido."""

    access_token: str = Field(..., description="Token JWT de acesso")
    token_type: str = Field(default="bearer", description="Tipo do token (sempre bearer)")
    expires_in: int = Field(..., description="Tempo de expiração do token em segundos")


class AdminUserDTO(BaseModel):
    """Dados cadastrais e claims do administrador autenticado."""

    id: str = Field(..., description="Identificador único do administrador")
    email: EmailStr = Field(..., description="E-mail do administrador")
    nome: str = Field(..., description="Nome de exibição")
    role: str = Field(default="admin", description="Papel administrativo no sistema")
