import pytest
from httpx import ASGITransport, AsyncClient

from app.db.session import AsyncSessionLocal
from app.main import app
from app.movies.models import (
    DimMovie,
    DimPerson,
    DimReview,
    bridge_movie_person,
)


@pytest.fixture
async def seed_test_person_data():
    """Insere dados sintéticos para testes de pessoa e filmografia."""
    async with AsyncSessionLocal() as session:
        # Criar pessoa (ex: Christopher Nolan)
        person = DimPerson(
            nome_pessoa="Christopher Nolan Test",
            tipo_pessoa="Diretor",
        )
        session.add(person)
        await session.flush()

        # Criar filmes
        m1 = DimMovie(
            id_filme="test-nolan-inception",
            titulo="Inception Test",
            ano_lancamento=2010,
            duracao_minutos=148,
            sinopse="Dom Cobb é um ladrão que invade sonhos.",
            status_filme="Lançado",
        )
        m2 = DimMovie(
            id_filme="test-nolan-oppenheimer",
            titulo="Oppenheimer Test",
            ano_lancamento=2023,
            duracao_minutos=180,
            sinopse="A história do Projeto Manhattan.",
            status_filme="Lançado",
        )
        session.add_all([m1, m2])
        await session.flush()

        # Bridge
        await session.execute(
            bridge_movie_person.insert().values(
                [
                    {"sk_movie_id": m1.sk_movie_id, "sk_person_id": person.sk_person_id},
                    {"sk_movie_id": m2.sk_movie_id, "sk_person_id": person.sk_person_id},
                ]
            )
        )

        # Reviews
        r1 = DimReview(
            sk_movie_id=m1.sk_movie_id,
            nota_media_usuarios=9.0,
            qtd_avaliacoes_usuarios=100,
        )
        r2 = DimReview(
            sk_movie_id=m2.sk_movie_id,
            nota_media_usuarios=8.8,
            qtd_avaliacoes_usuarios=200,
        )
        session.add_all([r1, r2])
        await session.commit()

        yield person, m1, m2

    # Limpeza
    async with AsyncSessionLocal() as session:
        await session.execute(
            bridge_movie_person.delete().where(
                bridge_movie_person.c.sk_person_id == person.sk_person_id
            )
        )
        p = await session.get(DimPerson, person.sk_person_id)
        if p:
            await session.delete(p)
        db_m1 = await session.get(DimMovie, m1.sk_movie_id)
        if db_m1:
            await session.delete(db_m1)
        db_m2 = await session.get(DimMovie, m2.sk_movie_id)
        if db_m2:
            await session.delete(db_m2)
        await session.commit()


@pytest.mark.asyncio
async def test_get_person_detail(seed_test_person_data):
    person, m1, m2 = seed_test_person_data
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get(f"/api/v1/people/{person.sk_person_id}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["sk_person_id"] == person.sk_person_id
        assert data["nome_pessoa"] == "Christopher Nolan Test"
        assert data["total_filmes"] == 2
        assert data["primeiro_ano"] == 2010
        assert data["ultimo_ano"] == 2023
        assert data["nota_media_filmes"] == 8.9


@pytest.mark.asyncio
async def test_get_person_detail_not_found():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/people/inexistente-123")
        assert resp.status_code == 404


@pytest.mark.asyncio
async def test_get_person_movies_pagination_and_filter(seed_test_person_data):
    person, m1, m2 = seed_test_person_data
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Listar todos
        resp = await client.get(f"/api/v1/people/{person.sk_person_id}/movies?page=1&page_size=10")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] == 2
        assert len(data["items"]) == 2

        # Filtrar por ano
        resp_year = await client.get(
            f"/api/v1/people/{person.sk_person_id}/movies?year=2023"
        )
        assert resp_year.status_code == 200
        data_year = resp_year.json()
        assert data_year["total"] == 1
        assert data_year["items"][0]["titulo"] == "Oppenheimer Test"


@pytest.mark.asyncio
async def test_quick_search_people(seed_test_person_data):
    person, _, _ = seed_test_person_data
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/people/quick-search?q=Nolan Test")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        found = [p for p in data if p["sk_person_id"] == person.sk_person_id]
        assert len(found) == 1
        assert found[0]["nome_pessoa"] == "Christopher Nolan Test"
        assert found[0]["total_filmes"] == 2
        assert "Diretor" in found[0]["papeis"]


@pytest.mark.asyncio
async def test_quick_search_people_deduplication():
    """Garante que registros múltiplos da mesma pessoa com papéis diferentes são unificados."""
    async with AsyncSessionLocal() as session:
        p1 = DimPerson(nome_pessoa="Quentin Dup Test", tipo_pessoa="Diretor")
        p2 = DimPerson(nome_pessoa="Quentin Dup Test", tipo_pessoa="Roteirista")
        session.add_all([p1, p2])
        await session.commit()

    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            resp = await client.get("/api/v1/people/quick-search?q=Quentin Dup Test")
            assert resp.status_code == 200
            data = resp.json()
            found = [p for p in data if p["nome_pessoa"] == "Quentin Dup Test"]
            # Deve retornar exatamente 1 registro unificado
            assert len(found) == 1
            assert "Diretor" in found[0]["papeis"]
            assert "Roteirista" in found[0]["papeis"]
            assert "Diretor" in found[0]["tipo_pessoa"]
            assert "Roteirista" in found[0]["tipo_pessoa"]
    finally:
        async with AsyncSessionLocal() as session:
            db_p1 = await session.get(DimPerson, p1.sk_person_id)
            if db_p1:
                await session.delete(db_p1)
            db_p2 = await session.get(DimPerson, p2.sk_person_id)
            if db_p2:
                await session.delete(db_p2)
            await session.commit()

