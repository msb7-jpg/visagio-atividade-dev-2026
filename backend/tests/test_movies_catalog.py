import pytest
from httpx import ASGITransport, AsyncClient

from app.db.session import AsyncSessionLocal
from app.main import app
from app.movies.models import (
    DimGenre,
    DimMovie,
    DimReview,
    FactMoviePerformance,
    bridge_movie_genre,
)


@pytest.fixture
async def seed_test_catalog():
    """Insere dados sintéticos para testes de catálogo e busca rápida."""
    async with AsyncSessionLocal() as session:
        # Obter ou criar gêneros
        from sqlalchemy import select

        genre_scifi = (
            await session.execute(
                select(DimGenre).where(DimGenre.nome_genero == "Ficção Científica")
            )
        ).scalar_one_or_none()
        if not genre_scifi:
            genre_scifi = DimGenre(nome_genero="Ficção Científica")
            session.add(genre_scifi)

        genre_drama = (
            await session.execute(select(DimGenre).where(DimGenre.nome_genero == "Drama"))
        ).scalar_one_or_none()
        if not genre_drama:
            genre_drama = DimGenre(nome_genero="Drama")
            session.add(genre_drama)

        await session.flush()

        # Filmes
        m1 = DimMovie(
            id_filme="test-matrix-1999",
            titulo="The Matrix",
            ano_lancamento=1999,
            duracao_minutos=136,
            sinopse="Neo descobre a verdade sobre a simulação.",
            url_poster="https://image.tmdb.org/t/p/w500/matrix.jpg",
        )
        m2 = DimMovie(
            id_filme="test-interstellar-2014",
            titulo="Interstellar",
            ano_lancamento=2014,
            duracao_minutos=169,
            sinopse="Uma equipe de exploradores viaja através de um buraco de minhoca no espaço.",
            url_poster="https://image.tmdb.org/t/p/w500/interstellar.jpg",
        )
        session.add_all([m1, m2])
        await session.flush()

        # Vincula gêneros
        await session.execute(
            bridge_movie_genre.insert().values(
                [
                    {"sk_movie_id": m1.sk_movie_id, "sk_genre_id": genre_scifi.sk_genre_id},
                    {"sk_movie_id": m2.sk_movie_id, "sk_genre_id": genre_scifi.sk_genre_id},
                    {"sk_movie_id": m2.sk_movie_id, "sk_genre_id": genre_drama.sk_genre_id},
                ]
            )
        )

        # Performance analítica
        p1 = FactMoviePerformance(
            sk_movie_id=m1.sk_movie_id,
            popularidade=85.5,
            receita_usd=463517383,
        )
        p2 = FactMoviePerformance(
            sk_movie_id=m2.sk_movie_id,
            popularidade=95.0,
            receita_usd=701729206,
        )
        session.add_all([p1, p2])

        # Reviews consolidadas
        r1 = DimReview(
            sk_movie_id=m1.sk_movie_id,
            nota_media_usuarios=8.7,
            qtd_avaliacoes_usuarios=120,
        )
        r2 = DimReview(
            sk_movie_id=m2.sk_movie_id,
            nota_media_usuarios=9.1,
            qtd_avaliacoes_usuarios=250,
        )
        session.add_all([r1, r2])

        await session.commit()

    yield

    # Limpeza
    async with AsyncSessionLocal() as session:
        await session.execute(
            bridge_movie_genre.delete().where(
                bridge_movie_genre.c.sk_movie_id.in_([m1.sk_movie_id, m2.sk_movie_id])
            )
        )
        movie_1 = await session.get(DimMovie, m1.sk_movie_id)
        if movie_1:
            await session.delete(movie_1)
        movie_2 = await session.get(DimMovie, m2.sk_movie_id)
        if movie_2:
            await session.delete(movie_2)
        await session.commit()


@pytest.mark.asyncio
async def test_list_movies_pagination(seed_test_catalog):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/movies?page=1&page_size=10")
        assert resp.status_code == 200
        data = resp.json()
        assert "items" in data
        assert "total" in data
        assert data["page"] == 1
        assert data["page_size"] == 10
        assert data["total"] >= 2


@pytest.mark.asyncio
async def test_list_movies_filter_query(seed_test_catalog):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/movies?q=Matrix")
        assert resp.status_code == 200
        data = resp.json()
        assert any(item["titulo"] == "The Matrix" for item in data["items"])


@pytest.mark.asyncio
async def test_list_movies_filter_genre(seed_test_catalog):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/movies?genre=Drama&q=Interstellar")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) >= 1
        assert data["items"][0]["titulo"] == "Interstellar"
        assert "Drama" in data["items"][0]["generos"]


@pytest.mark.asyncio
async def test_quick_search_spotlight(seed_test_catalog):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/movies/quick-search?q=Inter")
        assert resp.status_code == 200
        items = resp.json()
        assert len(items) >= 1
        assert items[0]["titulo"] == "Interstellar"
        assert items[0]["nota_media_usuarios"] == 9.1
        assert "Ficção Científica" in items[0]["generos"]


@pytest.mark.asyncio
async def test_list_genres(seed_test_catalog):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/genres")
        assert resp.status_code == 200
        genres = resp.json()
        assert any(g["nome_genero"] == "Ficção Científica" for g in genres)


@pytest.mark.asyncio
async def test_get_available_years(seed_test_catalog):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/movies/available-years")
        assert resp.status_code == 200
        years = resp.json()
        assert isinstance(years, list)
        assert len(years) >= 2
        # Deve conter os anos do seed (2014, 1999) ordenados decrescentemente
        assert 2014 in years
        assert 1999 in years
        assert years == sorted(years, reverse=True)


@pytest.mark.asyncio
async def test_list_movies_filter_year(seed_test_catalog):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/movies?year=1999")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) >= 1
        assert all(item["ano_lancamento"] == 1999 for item in data["items"])
        assert any(item["titulo"] == "The Matrix" for item in data["items"])
