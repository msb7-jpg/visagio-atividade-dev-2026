"""Dependências compartilhadas de injeção FastAPI (Banco de Dados e Segurança)."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.features.auth.router import get_current_admin
from app.features.auth.schemas import AdminUserDTO

# Injeção de sessão assíncrona do SQLAlchemy (usado nos repositories e services das fatias)
DbSession = Annotated[AsyncSession, Depends(get_db)]

# Injeção de autenticação administrativa JWT
# Usado para proteger endpoints restritos (ex: mutações e CRUD de filmes)
CurrentAdmin = Annotated[AdminUserDTO, Depends(get_current_admin)]
