"""Testes de integração para a biblioteca do usuário (favoritos e watchlist)."""

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.features.auth.service import AuthService
from app.main import app
from app.movies.models import DimGenre, DimMovie, bridge_movie_genre


@pytest.fixture
def auth_headers():
    """Gera token de autenticação JWT de teste."""
    token, _ = AuthService.create_access_token(
        data={
            "sub": "user-test-library-01",
            "email": "user@rocketfilms.com",
            "nome": "Cinéfilo Teste",
            "role": "admin",
        }
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def seed_library_movies():
    """Cria filmes de teste com gêneros e garante limpeza no teardown."""
    async with AsyncSessionLocal() as session:
        genre = (
            await session.execute(
                select(DimGenre).where(DimGenre.nome_genero == "Sci-Fi Teste Library")
            )
        ).scalar_one_or_none()
        if not genre:
            genre = DimGenre(nome_genero="Sci-Fi Teste Library")
            session.add(genre)
            await session.commit()
            await session.refresh(genre)

        movie_1 = DimMovie(
            id_filme="test-lib-movie-1",
            titulo="Interestelar Teste",
            ano_lancamento=2014,
            duracao_minutos=169,
            sinopse="Uma viagem no espaço-tempo.",
        )
        movie_2 = DimMovie(
            id_filme="test-lib-movie-2",
            titulo="A Origem Teste",
            ano_lancamento=2010,
            duracao_minutos=148,
            sinopse="Roubo em sonhos compartilhados.",
        )
        session.add_all([movie_1, movie_2])
        await session.commit()
        await session.refresh(movie_1)
        await session.refresh(movie_2)

        # Associa gênero
        await session.execute(
            bridge_movie_genre.insert().values(
                [
                    {"sk_movie_id": movie_1.sk_movie_id, "sk_genre_id": genre.sk_genre_id},
                    {"sk_movie_id": movie_2.sk_movie_id, "sk_genre_id": genre.sk_genre_id},
                ]
            )
        )
        await session.commit()

        sk_1 = movie_1.sk_movie_id
        sk_2 = movie_2.sk_movie_id

    yield sk_1, sk_2

    # Cleanup
    async with AsyncSessionLocal() as session:
        for sk in (sk_1, sk_2):
            m = await session.get(DimMovie, sk)
            if m:
                await session.delete(m)
        g = (
            await session.execute(
                select(DimGenre).where(DimGenre.nome_genero == "Sci-Fi Teste Library")
            )
        ).scalar_one_or_none()
        if g:
            await session.delete(g)
        await session.commit()


@pytest.mark.asyncio
async def test_user_library_unauthorized():
    """Requisições sem token devem retornar 401 Unauthorized."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res1 = await client.get("/api/v1/user/library/ids")
        assert res1.status_code == 401

        res2 = await client.post("/api/v1/user/library/some-id/favorite")
        assert res2.status_code == 401

        res3 = await client.post("/api/v1/user/library/some-id/watchlist")
        assert res3.status_code == 401


@pytest.mark.asyncio
async def test_toggle_favorite_and_watchlist(auth_headers, seed_library_movies):
    """Testa alternância de favorito e watchlist para filmes."""
    sk_1, sk_2 = seed_library_movies
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Inicialmente biblioteca de IDs vazia para o usuário
        res = await client.get("/api/v1/user/library/ids", headers=auth_headers)
        assert res.status_code == 200
        data = res.json()
        assert sk_1 not in data["favorites"]
        assert sk_1 not in data["watchlist"]

        # 2. Favorita o filme 1
        fav_res = await client.post(
            f"/api/v1/user/library/{sk_1}/favorite", headers=auth_headers
        )
        assert fav_res.status_code == 200
        fav_data = fav_res.json()
        assert fav_data["sk_movie_id"] == sk_1
        assert fav_data["is_favorite"] is True
        assert fav_data["in_watchlist"] is False

        # Verifica IDs
        res = await client.get("/api/v1/user/library/ids", headers=auth_headers)
        data = res.json()
        assert sk_1 in data["favorites"]

        # 3. Adiciona filme 1 à watchlist
        watch_res = await client.post(
            f"/api/v1/user/library/{sk_1}/watchlist", headers=auth_headers
        )
        assert watch_res.status_code == 200
        watch_data = watch_res.json()
        assert watch_data["is_favorite"] is True
        assert watch_data["in_watchlist"] is True

        # 4. Desfavorita o filme 1 (toggle off)
        unfav_res = await client.post(
            f"/api/v1/user/library/{sk_1}/favorite", headers=auth_headers
        )
        assert unfav_res.status_code == 200
        unfav_data = unfav_res.json()
        assert unfav_data["is_favorite"] is False
        assert unfav_data["in_watchlist"] is True

        res = await client.get("/api/v1/user/library/ids", headers=auth_headers)
        data = res.json()
        assert sk_1 not in data["favorites"]
        assert sk_1 in data["watchlist"]


@pytest.mark.asyncio
async def test_get_library_movies_paginated(auth_headers, seed_library_movies):
    """Testa listagem paginada dos filmes favoritados e na watchlist."""
    sk_1, sk_2 = seed_library_movies
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Filme 1: Favorito
        await client.post(f"/api/v1/user/library/{sk_1}/favorite", headers=auth_headers)
        # Filme 2: Watchlist
        await client.post(f"/api/v1/user/library/{sk_2}/watchlist", headers=auth_headers)

        # Consulta lista de favoritos
        res_fav = await client.get(
            "/api/v1/user/library/movies?type=favorites", headers=auth_headers
        )
        assert res_fav.status_code == 200
        data_fav = res_fav.json()
        assert data_fav["total"] >= 1
        found_fav = [m for m in data_fav["items"] if m["sk_movie_id"] == sk_1]
        assert len(found_fav) == 1
        assert found_fav[0]["titulo"] == "Interestelar Teste"
        assert "Sci-Fi Teste Library" in found_fav[0]["generos"]

        # Consulta lista de watchlist
        res_watch = await client.get(
            "/api/v1/user/library/movies?type=watchlist", headers=auth_headers
        )
        assert res_watch.status_code == 200
        data_watch = res_watch.json()
        assert data_watch["total"] >= 1
        found_watch = [m for m in data_watch["items"] if m["sk_movie_id"] == sk_2]
        assert len(found_watch) == 1
        assert found_watch[0]["titulo"] == "A Origem Teste"


@pytest.mark.asyncio
async def test_toggle_nonexistent_movie_404(auth_headers):
    """Tentar favoritar filme inexistente deve retornar 404."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post(
            "/api/v1/user/library/id-que-nao-existe-9999/favorite",
            headers=auth_headers,
        )
        assert res.status_code == 404
