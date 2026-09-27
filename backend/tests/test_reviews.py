import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.main import app
from app.movies.models import DimMovie


@pytest.fixture
async def seed_review_movie():
    """Cria um filme limpo para testes de avaliações e garante teardown."""
    async with AsyncSessionLocal() as session:
        movie = (
            await session.execute(
                select(DimMovie).where(DimMovie.id_filme == "test-review-movie")
            )
        ).scalar_one_or_none()

        if not movie:
            movie = DimMovie(
                id_filme="test-review-movie",
                titulo="Filme Teste de Reviews",
                ano_lancamento=2024,
                duracao_minutos=120,
                status_filme="Released",
                sinopse="Sinopse de teste para o fluxo de resenhas.",
            )
            session.add(movie)
            await session.commit()
            await session.refresh(movie)

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
async def test_create_review_success_and_recalculates_average(seed_review_movie):
    id_filme, sk_movie_id = seed_review_movie
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Envia a primeira avaliação
        payload_1 = {
            "nome": "Carlos Drummond",
            "nota": 8.0,
            "comentario": "Excelente direção de arte e roteiro intrigante até o final.",
        }
        res_1 = await client.post(f"/api/v1/movies/{id_filme}/reviews", json=payload_1)
        assert res_1.status_code == 201
        data_1 = res_1.json()
        assert data_1["nome"] == payload_1["nome"]
        assert data_1["nota"] == 8.0
        assert data_1["sk_movie_id"] == sk_movie_id

        # 2. Envia a segunda avaliação
        payload_2 = {
            "nome": "Clarice Lispector",
            "nota": 10.0,
            "comentario": "Uma obra visceral e poética, atuações deslumbrantes.",
        }
        res_2 = await client.post(f"/api/v1/movies/{id_filme}/reviews", json=payload_2)
        assert res_2.status_code == 201

        # 3. Lista histórico e verifica ordenação decrescente por data
        list_res = await client.get(f"/api/v1/movies/{id_filme}/reviews")
        assert list_res.status_code == 200
        reviews_list = list_res.json()
        assert len(reviews_list) == 2
        assert {r["nome"] for r in reviews_list} == {"Clarice Lispector", "Carlos Drummond"}

        # 4. Verifica na ficha técnica se a média foi recalculada corretamente: (8.0 + 10.0)/2 = 9.0
        detail_res = await client.get(f"/api/v1/movies/{id_filme}")
        assert detail_res.status_code == 200
        movie_detail = detail_res.json()
        assert movie_detail["qtd_avaliacoes_usuarios"] == 2
        assert movie_detail["nota_media_usuarios"] == 9.0


@pytest.mark.asyncio
async def test_create_review_validation_errors(seed_review_movie):
    id_filme, _ = seed_review_movie
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Nota acima de 10
        invalid_rating = {
            "nome": "Testador",
            "nota": 11.0,
            "comentario": "Comentário válido com tamanho suficiente.",
        }
        res = await client.post(f"/api/v1/movies/{id_filme}/reviews", json=invalid_rating)
        assert res.status_code == 422

        # Nota negativa
        negative_rating = {
            "nome": "Testador",
            "nota": -1.0,
            "comentario": "Comentário válido com tamanho suficiente.",
        }
        res = await client.post(f"/api/v1/movies/{id_filme}/reviews", json=negative_rating)
        assert res.status_code == 422

        # Comentário excessivo (> 4000 caracteres)
        long_comment = {
            "nome": "Testador",
            "nota": 7.5,
            "comentario": "A" * 4001,
        }
        res = await client.post(f"/api/v1/movies/{id_filme}/reviews", json=long_comment)
        assert res.status_code == 422


@pytest.mark.asyncio
async def test_create_quick_review_without_comment(seed_review_movie):
    """Testa avaliação rápida de 1 clique (sem comentário obrigatório)."""
    id_filme, sk_movie_id = seed_review_movie
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "nome": "Cinéfilo Rápido",
            "nota": 9.5,
        }
        res = await client.post(f"/api/v1/movies/{id_filme}/reviews", json=payload)
        assert res.status_code == 201
        data = res.json()
        assert data["nome"] == "Cinéfilo Rápido"
        assert data["nota"] == 9.5
        assert data["comentario"] is None
        assert data["sk_movie_id"] == sk_movie_id


@pytest.mark.asyncio
async def test_create_review_movie_not_found():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post(
            "/api/v1/movies/movie-inexistente-xyz/reviews",
            json={
                "nome": "Avaliador Fantasma",
                "nota": 5.0,
                "comentario": "Tentando avaliar um filme que não existe.",
            },
        )
        assert res.status_code == 404


@pytest.mark.asyncio
async def test_update_review_success_and_recalculates_average(seed_review_movie):
    """Testa atualização de review existente via PUT e recálculo correto da média."""
    id_filme, sk_movie_id = seed_review_movie
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Cria review inicial com nota 6.0
        create_res = await client.post(
            f"/api/v1/movies/{id_filme}/reviews",
            json={"nome": "Editor", "nota": 6.0, "comentario": "Opinião inicial modesta."},
        )
        assert create_res.status_code == 201
        review_data = create_res.json()
        review_id = review_data["sk_movie_review_id"]

        # Atualiza a nota para 10.0 e comentário
        update_res = await client.put(
            f"/api/v1/movies/{id_filme}/reviews/{review_id}",
            json={
                "nome": "Editor",
                "nota": 10.0,
                "comentario": "Mudei de ideia, revendo o filme achei extraordinário!",
            },
        )
        assert update_res.status_code == 200
        updated = update_res.json()
        assert updated["nota"] == 10.0
        assert "extraordinário" in updated["comentario"]

        # Atualiza novamente com comentário None / nulo
        # (cenário de quick rating ou edição sem texto)
        update_null_res = await client.put(
            f"/api/v1/movies/{id_filme}/reviews/{review_id}",
            json={
                "nome": "Editor",
                "nota": 8.0,
                "comentario": None,
            },
        )
        assert update_null_res.status_code == 200
        updated_null = update_null_res.json()
        assert updated_null["nota"] == 8.0
        assert updated_null["comentario"] is None

        # Ficha do filme deve refletir média 8.0
        movie_res = await client.get(f"/api/v1/movies/{id_filme}")
        assert movie_res.status_code == 200
        movie = movie_res.json()
        assert movie["nota_media_usuarios"] == 8.0

