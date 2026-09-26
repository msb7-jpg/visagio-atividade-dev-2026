"""Serviço de autenticação administrativa e gestão de tokens JWT com PyJWT e Pwdlib."""

from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from jwt.exceptions import PyJWTError
from pwdlib import PasswordHash

from app.core.config import get_settings
from app.features.auth.schemas import AdminUserDTO, LoginRequest, TokenResponse

settings = get_settings()

password_hash = PasswordHash.recommended()


class AuthService:
    """Regras de negócio para autenticação de administrador."""

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        """Verifica se a senha plana corresponde ao hash armazenado via pwdlib."""
        return password_hash.verify(plain_password, hashed_password)

    @classmethod
    def get_password_hash(cls, password: str) -> str:
        """Gera hash seguro da senha fornecida via pwdlib (Argon2 por padrão)."""
        return password_hash.hash(password)

    @classmethod
    def create_access_token(
        cls, data: dict[str, Any], expires_delta: timedelta | None = None
    ) -> tuple[str, int]:
        """Cria um token JWT codificado com claims e timestamp de expiração usando PyJWT."""
        to_encode = data.copy()
        expire_minutes = (
            expires_delta.total_seconds() / 60
            if expires_delta
            else settings.jwt_access_token_expire_minutes
        )
        expire_seconds = int(expire_minutes * 60)
        expire = datetime.now(UTC) + timedelta(seconds=expire_seconds)

        to_encode.update({"exp": expire, "iat": datetime.now(UTC)})
        encoded_jwt = jwt.encode(
            to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm
        )
        return encoded_jwt, expire_seconds

    @classmethod
    def authenticate_admin(cls, request: LoginRequest) -> TokenResponse | None:
        """Valida credenciais do administrador e emite TokenResponse."""
        invalid_email = request.email.lower() != settings.admin_email.lower()
        invalid_password = request.senha != settings.admin_password

        if invalid_email or invalid_password:
            return None

        token_claims = {
            "sub": "admin-rocketfilms-01",
            "email": settings.admin_email,
            "nome": settings.admin_name,
            "role": "admin",
        }

        token, expires_in = cls.create_access_token(data=token_claims)
        return TokenResponse(
            access_token=token, 
            token_type="bearer", 
            expires_in=expires_in
        )

    @classmethod
    def decode_token(cls, token: str) -> AdminUserDTO | None:
        """Decodifica e valida o token JWT usando PyJWT."""
        try:
            payload = jwt.decode(
                token,
                settings.jwt_secret_key,
                algorithms=[settings.jwt_algorithm],
            )
            user_id: str | None = payload.get("sub")
            email: str | None = payload.get("email")
            nome: str | None = payload.get("nome")
            role: str | None = payload.get("role")

            if user_id is None or email is None:
                return None

            return AdminUserDTO(
                id=user_id,
                email=email,
                nome=nome or settings.admin_name,
                role=role or "admin",
            )
        except PyJWTError:
            return None
