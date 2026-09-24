from app.db.base import Base
from app.movies import models  # noqa: F401  Registra os modelos ORM.


def test_movie_schema_registers_expected_tables() -> None:
    expected_tables = {
        "bridge_movie_company",
        "bridge_movie_genre",
        "bridge_movie_person",
        "dim_companies",
        "dim_genres",
        "dim_movies",
        "dim_people",
        "dim_reviews",
        "fact_movies_performance",
        "movie_reviews",
    }

    assert set(Base.metadata.tables) == expected_tables
    assert "idioma_original" not in Base.metadata.tables["dim_movies"].columns


def test_movie_review_columns_match_shared_csv() -> None:
    table = Base.metadata.tables["movie_reviews"]

    assert {
        "sk_movie_review_id", 
        "sk_movie_id", 
        "nome", 
        "nota", 
        "comentario"
    } <= set(table.columns.keys())
    assert table.primary_key.columns.keys() == ["sk_movie_review_id"]
