"""Rotas de autenticação administrativa do RocketFilms."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.features.auth.docs import LoginDocs, MeDocs
from app.features.auth.schemas import AdminUserDTO, LoginRequest, TokenResponse
from app.features.auth.service import AuthService

auth_router = APIRouter()
security = HTTPBearer(auto_error=False)


async def get_current_admin(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
) -> AdminUserDTO:
    """Valida o Bearer token JWT da requisição e injeta os dados do administrador."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de acesso ausente ou inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not (user := AuthService.decode_token(credentials.credentials)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado ou inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


@auth_router.post("/login", **LoginDocs.to_dict())
async def login(credentials: LoginRequest) -> TokenResponse:
    """Processa o login administrativo."""
    if not (auth_result := AuthService.authenticate_admin(credentials)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos",
        )
    return auth_result


@auth_router.get("/me", **MeDocs.to_dict())
async def get_current_admin_info(
    current_admin: Annotated[AdminUserDTO, Depends(get_current_admin)],
) -> AdminUserDTO:
    """Retorna os dados do administrador autenticado."""
    return current_admin
