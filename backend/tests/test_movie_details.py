from decimal import Decimal

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.main import app
from app.movies.models import (
    DimCompany,
    DimGenre,
    DimMovie,
    DimPerson,
    DimReview,
    FactMoviePerformance,
    bridge_movie_company,
    bridge_movie_genre,
    bridge_movie_person,
)


@pytest.fixture
async def seed_detail_movie():
    """Insere um filme completo com elenco, produtoras, performance e reviews."""
    async with AsyncSessionLocal() as session:
        # Gênero
        genre = (
            await session.execute(
                select(DimGenre).where(DimGenre.nome_genero == "Ficção Científica Detalhes")
            )
        ).scalar_one_or_none()
        if not genre:
            genre = DimGenre(nome_genero="Ficção Científica Detalhes")
            session.add(genre)

        # Produtora
        company = (
            await session.execute(
                select(DimCompany).where(DimCompany.nome_produtora == "Warner Bros. Pictures")
            )
        ).scalar_one_or_none()
        if not company:
            company = DimCompany(nome_produtora="Warner Bros. Pictures")
            session.add(company)

        # Pessoas
        director = (
            await session.execute(
                select(DimPerson).where(
                    DimPerson.nome_pessoa == "Christopher Nolan",
                    DimPerson.tipo_pessoa == "Diretor",
                )
            )
        ).scalar_one_or_none()
        if not director:
            director = DimPerson(nome_pessoa="Christopher Nolan", tipo_pessoa="Diretor")
            session.add(director)

        actor = (
            await session.execute(
                select(DimPerson).where(
                    DimPerson.nome_pessoa == "Matthew McConaughey",
                    DimPerson.tipo_pessoa == "Ator",
                )
            )
        ).scalar_one_or_none()
        if not actor:
            actor = DimPerson(nome_pessoa="Matthew McConaughey", tipo_pessoa="Ator")
            session.add(actor)

        writer = (
            await session.execute(
                select(DimPerson).where(
                    DimPerson.nome_pessoa == "Jonathan Nolan",
                    DimPerson.tipo_pessoa == "Roteirista",
                )
            )
        ).scalar_one_or_none()
        if not writer:
            writer = DimPerson(nome_pessoa="Jonathan Nolan", tipo_pessoa="Roteirista")
            session.add(writer)

        await session.flush()

        # Filme
        movie = (
            await session.execute(
                select(DimMovie).where(DimMovie.id_filme == "test-odyssey-detail")
            )
        ).scalar_one_or_none()
        if not movie:
            movie = DimMovie(
                id_filme="test-odyssey-detail",
                titulo="Odyssey Detail Edition",
                ano_lancamento=2014,
                duracao_minutos=169,
                status_filme="Released",
                sinopse="Uma viagem interestelar em busca de um novo lar para a humanidade.",
                url_poster="https://image.tmdb.org/t/p/w500/odyssey-detail.jpg",
                url_backdrop="https://image.tmdb.org/t/p/w1280/odyssey-backdrop.jpg",
            )
            session.add(movie)
            await session.flush()

            # Relações secundárias
            await session.execute(
                bridge_movie_genre.insert().values(
                    sk_movie_id=movie.sk_movie_id, sk_genre_id=genre.sk_genre_id
                )
            )
            await session.execute(
                bridge_movie_company.insert().values(
                    sk_movie_id=movie.sk_movie_id, sk_company_id=company.sk_company_id
                )
            )
            await session.execute(
                bridge_movie_person.insert().values(
                    sk_movie_id=movie.sk_movie_id, sk_person_id=director.sk_person_id
                )
            )
            await session.execute(
                bridge_movie_person.insert().values(
                    sk_movie_id=movie.sk_movie_id, sk_person_id=actor.sk_person_id
                )
            )
            await session.execute(
                bridge_movie_person.insert().values(
                    sk_movie_id=movie.sk_movie_id, sk_person_id=writer.sk_person_id
                )
            )

            # Performance
            perf = FactMoviePerformance(
                sk_movie_id=movie.sk_movie_id,
                orcamento_usd=Decimal("165000000.00"),
                receita_usd=Decimal("701729206.00"),
                lucro_usd=Decimal("536729206.00"),
                orcamento_brl=Decimal("825000000.00"),
                receita_brl=Decimal("3508646030.00"),
                lucro_brl=Decimal("2683646030.00"),
                popularidade=185.5,
                nota_tmdb=8.6,
                qtd_tmdb=32000,
                nota_imdb=8.7,
                qtd_imdb=1900000,
            )
            session.add(perf)

            # Review agregada
            rev = DimReview(
                sk_movie_id=movie.sk_movie_id,
                nota_media_usuarios=9.2,
                qtd_avaliacoes_usuarios=42,
            )
            session.add(rev)

        await session.commit()
        movie_id_filme = movie.id_filme
        movie_sk_id = movie.sk_movie_id

    yield movie_id_filme, movie_sk_id

    async with AsyncSessionLocal() as session:
        movie_to_delete = (
            await session.execute(
                select(DimMovie).where(DimMovie.id_filme == movie_id_filme)
            )
        ).scalar_one_or_none()
        if movie_to_delete:
            await session.delete(movie_to_delete)
            await session.commit()


@pytest.mark.asyncio
async def test_get_movie_detail_by_id_filme_success(seed_detail_movie):
    id_filme, _ = seed_detail_movie
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(f"/api/v1/movies/{id_filme}")

    assert response.status_code == 200
    data = response.json()

    assert data["id_filme"] == id_filme
    assert data["titulo"] == "Odyssey Detail Edition"
    assert data["duracao_minutos"] == 169
    assert data["status_filme"] == "Released"
    assert data["url_poster"] == "https://image.tmdb.org/t/p/w500/odyssey-detail.jpg"
    assert data["url_backdrop"] == "https://image.tmdb.org/t/p/w1280/odyssey-backdrop.jpg"

    # Verificações de relacionamentos
    assert len(data["generos"]) >= 1
    assert any(g["nome_genero"] == "Ficção Científica Detalhes" for g in data["generos"])

    assert len(data["produtoras"]) >= 1
    assert any(c["nome_produtora"] == "Warner Bros. Pictures" for c in data["produtoras"])

    assert len(data["diretores"]) >= 1
    assert any(d["nome_pessoa"] == "Christopher Nolan" for d in data["diretores"])

    assert len(data["atores"]) >= 1
    assert any(a["nome_pessoa"] == "Matthew McConaughey" for a in data["atores"])

    assert len(data["roteiristas"]) >= 1
    assert any(r["nome_pessoa"] == "Jonathan Nolan" for r in data["roteiristas"])

    # Verificações de métricas e ROI
    metricas = data["metricas"]
    assert float(metricas["orcamento_usd"]) == 165000000.0
    assert float(metricas["receita_usd"]) == 701729206.0
    assert metricas["roi_percentual"] is not None
    assert metricas["roi_percentual"] > 300.0  # > 300% de ROI
    assert metricas["popularidade"] == 185.5
    assert metricas["nota_tmdb"] == 8.6
    assert metricas["nota_imdb"] == 8.7

    # Avaliação RocketFilms
    assert data["nota_media_usuarios"] == 9.2
    assert data["qtd_avaliacoes_usuarios"] == 42


@pytest.mark.asyncio
async def test_get_movie_detail_by_sk_movie_id_success(seed_detail_movie):
    _, sk_movie_id = seed_detail_movie
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(f"/api/v1/movies/{sk_movie_id}")

    assert response.status_code == 200
    data = response.json()
    assert data["sk_movie_id"] == sk_movie_id
    assert data["titulo"] == "Odyssey Detail Edition"


@pytest.mark.asyncio
async def test_get_movie_detail_not_found():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/movies/non-existent-movie-id-123456")

    assert response.status_code == 404
    data = response.json()
    assert "não foi encontrado" in data["detail"]
