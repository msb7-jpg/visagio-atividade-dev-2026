"""Testes unitários e de integração do slice de autenticação administrativa."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import get_settings
from app.features.auth.service import AuthService
from app.main import app

settings = get_settings()


@pytest.mark.asyncio
async def test_auth_service_generate_and_decode_token():
    """Valida a geração de token JWT e sua decodificação consistente."""
    token, expires_in = AuthService.create_access_token(
        data={
            "sub": "admin-1", 
            "email": "admin@rocketfilms.com", 
            "nome": "Admin", 
            "role": "admin"
        }
    )
    assert token is not None
    assert expires_in > 0

    decoded = AuthService.decode_token(token)
    assert decoded is not None
    assert decoded.id == "admin-1"
    assert decoded.email == "admin@rocketfilms.com"
    assert decoded.role == "admin"


@pytest.mark.asyncio
async def test_auth_login_successful():
    """Testa login com credenciais corretas de administrador."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": settings.admin_email, "senha": settings.admin_password},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["expires_in"] > 0


@pytest.mark.asyncio
async def test_auth_login_invalid_password():
    """Testa login com senha incorreta retornando 401."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": settings.admin_email, "senha": "senha-incorreta-123"},
        )
        assert response.status_code == 401
        assert response.json()["detail"] == "E-mail ou senha inválidos"


@pytest.mark.asyncio
async def test_auth_login_unknown_email():
    """Testa login com e-mail não cadastrado retornando 401."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": "usuario_estranho@dominio.com", "senha": "qualquercoisa"},
        )
        assert response.status_code == 401
        assert response.json()["detail"] == "E-mail ou senha inválidos"


@pytest.mark.asyncio
async def test_auth_me_with_valid_token():
    """Testa o endpoint /auth/me enviando o Bearer token JWT válido."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        # 1. Faz login
        login_res = await client.post(
            "/api/v1/auth/login",
            json={"email": settings.admin_email, "senha": settings.admin_password},
        )
        token = login_res.json()["access_token"]

        # 2. Chama /me
        me_res = await client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert me_res.status_code == 200
        user = me_res.json()
        assert user["email"] == settings.admin_email
        assert user["role"] == "admin"


@pytest.mark.asyncio
async def test_auth_me_unauthorized():
    """Testa a proteção do endpoint /auth/me sem token ou com token inválido."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        # Sem header
        res_no_token = await client.get("/api/v1/auth/me")
        assert res_no_token.status_code == 401

        # Token adulterado
        res_bad_token = await client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer token.completamente.falso"},
        )
        assert res_bad_token.status_code == 401


def test_auth_service_pwdlib_hashing_and_verification():
    """Valida o hashing com Argon2 e verificação de senha usando pwdlib."""
    raw_password = "minha-senha-secreta-admin"
    hashed = AuthService.get_password_hash(raw_password)

    assert hashed.startswith("$argon2id$")
    assert AuthService.verify_password(raw_password, hashed) is True
    assert AuthService.verify_password("senha-errada", hashed) is False
