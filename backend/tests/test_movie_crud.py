"""Testes de integração do CRUD administrativo de filmes (POST, PUT, DELETE)."""

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.features.auth.service import AuthService
from app.main import app
from app.movies.models import DimGenre, DimMovie


@pytest.fixture
def admin_headers():
    token, _ = AuthService.create_access_token(
        data={
            "sub": "admin-test",
            "email": "admin@rocketfilms.com",
            "nome": "Admin Tester",
            "role": "admin",
        }
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def seed_genre():
    async with AsyncSessionLocal() as session:
        genre = (
            await session.execute(
                select(DimGenre).where(DimGenre.nome_genero == "Ação e Aventura Teste")
            )
        ).scalar_one_or_none()
        if not genre:
            genre = DimGenre(nome_genero="Ação e Aventura Teste")
            session.add(genre)
            await session.commit()
            await session.refresh(genre)
        return genre


@pytest.mark.asyncio
async def test_create_movie_unauthorized():
    """Tentar criar filme sem token admin deve retornar 401."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/movies",
            json={
                "titulo": "Filme Não Autorizado",
                "ano_lancamento": 2024,
            },
        )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_movie_success(admin_headers, seed_genre):
    """Criação bem-sucedida de filme com token administrativo e gêneros."""
    transport = ASGITransport(app=app)
    created_id = None
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/movies",
            headers=admin_headers,
            json={
                "titulo": "Oppenheimer Rocket",
                "diretor": "Christopher Nolan",
                "ano_lancamento": 2023,
                "duracao_minutos": 180,
                "sinopse": "A história do projeto Manhattan e a criação da bomba atômica.",
                "url_poster": "https://image.tmdb.org/t/p/w500/oppenheimer.jpg",
                "generos_ids": [seed_genre.sk_genre_id],
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["titulo"] == "Oppenheimer Rocket"
        assert data["ano_lancamento"] == 2023
        assert data["duracao_minutos"] == 180
        assert data["url_poster"] == "https://image.tmdb.org/t/p/w500/oppenheimer.jpg"
        assert len(data["generos"]) == 1
        assert data["generos"][0]["nome_genero"] == "Ação e Aventura Teste"
        assert len(data["diretores"]) == 1
        assert data["diretores"][0]["nome_pessoa"] == "Christopher Nolan"
        created_id = data["sk_movie_id"]

    # Teardown: remove o filme criado
    if created_id:
        async with AsyncSessionLocal() as session:
            movie = (
                await session.execute(
                    select(DimMovie).where(DimMovie.sk_movie_id == created_id)
                )
            ).scalar_one_or_none()
            if movie:
                await session.delete(movie)
                await session.commit()


@pytest.mark.asyncio
async def test_update_movie_success(admin_headers, seed_genre):
    """Atualização com sucesso de metadados, diretor e gêneros."""
    transport = ASGITransport(app=app)
    created_id = None
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Criação prévia
        create_res = await client.post(
            "/api/v1/movies",
            headers=admin_headers,
            json={
                "titulo": "Filme Original",
                "diretor": "Diretor Um",
                "ano_lancamento": 2020,
                "duracao_minutos": 100,
            },
        )
        assert create_res.status_code == 201
        created_id = create_res.json()["sk_movie_id"]

        # Atualização
        update_res = await client.put(
            f"/api/v1/movies/{created_id}",
            headers=admin_headers,
            json={
                "titulo": "Filme Atualizado com Sucesso",
                "diretor": "Diretor Dois",
                "ano_lancamento": 2021,
                "duracao_minutos": 125,
                "sinopse": "Nova sinopse editada.",
                "generos_ids": [seed_genre.sk_genre_id],
            },
        )
        assert update_res.status_code == 200
        updated_data = update_res.json()
        assert updated_data["titulo"] == "Filme Atualizado com Sucesso"
        assert updated_data["ano_lancamento"] == 2021
        assert updated_data["duracao_minutos"] == 125
        assert updated_data["sinopse"] == "Nova sinopse editada."
        assert len(updated_data["diretores"]) == 1
        assert updated_data["diretores"][0]["nome_pessoa"] == "Diretor Dois"
        assert len(updated_data["generos"]) == 1

    # Teardown
    if created_id:
        async with AsyncSessionLocal() as session:
            movie = (
                await session.execute(
                    select(DimMovie).where(DimMovie.sk_movie_id == created_id)
                )
            ).scalar_one_or_none()
            if movie:
                await session.delete(movie)
                await session.commit()


@pytest.mark.asyncio
async def test_delete_movie_success(admin_headers):
    """Exclusão de filme por admin e confirmação de 404 subsequente."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Criação
        create_res = await client.post(
            "/api/v1/movies",
            headers=admin_headers,
            json={
                "titulo": "Filme Para Ser Deletado",
                "ano_lancamento": 2022,
            },
        )
        assert create_res.status_code == 201
        movie_id = create_res.json()["sk_movie_id"]

        # Deleção sem auth -> 401
        delete_unauth = await client.delete(f"/api/v1/movies/{movie_id}")
        assert delete_unauth.status_code == 401

        # Deleção com auth -> 204
        delete_res = await client.delete(
            f"/api/v1/movies/{movie_id}", headers=admin_headers
        )
        assert delete_res.status_code == 204

        # Busca subsequente -> 404
        get_res = await client.get(f"/api/v1/movies/{movie_id}")
        assert get_res.status_code == 404


@pytest.mark.asyncio
async def test_list_directors_endpoint():
    """Busca de diretores para autocompletar na criação de filmes."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/directors?limit=10")
        assert res.status_code == 200
        data = res.json()
        assert isinstance(data, list)
        if len(data) > 0:
            assert "nome_pessoa" in data[0]
            assert "tipo_pessoa" in data[0]
            assert data[0]["tipo_pessoa"] == "Diretor"
