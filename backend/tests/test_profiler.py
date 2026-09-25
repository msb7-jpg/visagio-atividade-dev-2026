import pytest
from httpx import ASGITransport, AsyncClient

from app.core.profiler import (
    QueryRecord,
    analyze_queries_for_n_plus_one,
)
from app.main import app


@pytest.mark.asyncio
async def test_profiler_middleware_headers():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/health")
        assert resp.status_code == 200
        assert "x-query-count" in resp.headers
        assert "x-db-time-ms" in resp.headers
        assert "x-process-time-ms" in resp.headers


@pytest.mark.asyncio
async def test_movies_endpoint_query_count_under_budget():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/movies?page=1&page_size=10")
        assert resp.status_code == 200
        query_count = int(resp.headers.get("x-query-count", "0"))
        # Garante que não há explosão N+1 de queries:
        # Contagem + lista + eager loads (perf, genres, comp, revs, diretores) <= 8
        assert query_count <= 8


def test_analyze_queries_for_n_plus_one():
    # Simula queries com parâmetros diferentes
    records = [
        QueryRecord(
            statement="SELECT * FROM table WHERE id = 1",
            duration_ms=1.0,
            parameters=None,
        ),
        QueryRecord(
            statement="SELECT * FROM table WHERE id = 2",
            duration_ms=1.0,
            parameters=None,
        ),
        QueryRecord(
            statement="SELECT * FROM table WHERE id = 3",
            duration_ms=1.0,
            parameters=None,
        ),
    ]
    # Statements normalizados diferentes não disparam alerta
    assert len(analyze_queries_for_n_plus_one(records)) == 0

    # Statements idênticos repetidos >= 3 vezes
    records_duplicated = [
        QueryRecord(
            statement="SELECT * FROM dim_people WHERE id = ?",
            duration_ms=1.0,
            parameters=None,
        )
        for _ in range(3)
    ]
    suspects = analyze_queries_for_n_plus_one(records_duplicated)
    assert len(suspects) == 1
    assert suspects[0][1] == 3
