"""Cria o esquema inicial do catálogo de filmes.

Revision ID: 0001_initial_movie_schema
Revises:
Create Date: 2026-09-18
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0001_initial_movie_schema"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "dim_companies",
        sa.Column("sk_company_id", sa.String(64), primary_key=True),
        sa.Column("nome_produtora", sa.String(255), nullable=False, unique=True),
    )
    op.create_table(
        "dim_genres",
        sa.Column("sk_genre_id", sa.String(64), primary_key=True),
        sa.Column("nome_genero", sa.String(50), nullable=False, unique=True),
    )
    op.create_table(
        "dim_movies",
        sa.Column("sk_movie_id", sa.String(64), primary_key=True),
        sa.Column("id_filme", sa.String(50), nullable=False),
        sa.Column("titulo", sa.String(500), nullable=False),
        sa.Column("data_lancamento", sa.Date()),
        sa.Column("ano_lancamento", sa.Integer()),
        sa.Column("duracao_minutos", sa.Integer()),
        sa.Column("status_filme", sa.String(50)),
        sa.Column("sinopse", sa.String(4000)),
        sa.Column("url_poster", sa.String(2048)),
        sa.Column("url_backdrop", sa.String(2048)),
    )
    op.create_index("ix_dim_movies_ano_lancamento", "dim_movies", ["ano_lancamento"])
    op.create_index("ix_dim_movies_id_filme", "dim_movies", ["id_filme"], unique=True)
    op.create_index("ix_dim_movies_titulo", "dim_movies", ["titulo"])
    op.create_table(
        "dim_people",
        sa.Column("sk_person_id", sa.String(64), primary_key=True),
        sa.Column("nome_pessoa", sa.String(255), nullable=False),
        sa.Column("tipo_pessoa", sa.String(20), nullable=False),
        sa.CheckConstraint(
            "tipo_pessoa IN ('Ator', 'Diretor', 'Roteirista')", name="tipo_pessoa_valido"
        ),
        sa.UniqueConstraint(
            "nome_pessoa", "tipo_pessoa", name="uq_dim_people_nome_pessoa_tipo_pessoa"
        ),
    )
    op.create_index("ix_dim_people_nome_pessoa", "dim_people", ["nome_pessoa"])
    op.create_table(
        "bridge_movie_company",
        sa.Column(
            "sk_movie_id",
            sa.String(64),
            sa.ForeignKey("dim_movies.sk_movie_id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "sk_company_id",
            sa.String(64),
            sa.ForeignKey("dim_companies.sk_company_id", ondelete="CASCADE"),
            primary_key=True,
        ),
    )
    op.create_table(
        "bridge_movie_genre",
        sa.Column(
            "sk_movie_id",
            sa.String(64),
            sa.ForeignKey("dim_movies.sk_movie_id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "sk_genre_id",
            sa.String(64),
            sa.ForeignKey("dim_genres.sk_genre_id", ondelete="CASCADE"),
            primary_key=True,
        ),
    )
    op.create_table(
        "bridge_movie_person",
        sa.Column(
            "sk_movie_id",
            sa.String(64),
            sa.ForeignKey("dim_movies.sk_movie_id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "sk_person_id",
            sa.String(64),
            sa.ForeignKey("dim_people.sk_person_id", ondelete="CASCADE"),
            primary_key=True,
        ),
    )
    op.create_index("ix_bridge_movie_person_sk_person_id", "bridge_movie_person", ["sk_person_id"])
    op.create_table(
        "dim_reviews",
        sa.Column("sk_review_id", sa.String(64), primary_key=True),
        sa.Column(
            "sk_movie_id",
            sa.String(64),
            sa.ForeignKey("dim_movies.sk_movie_id", ondelete="CASCADE"),
            nullable=False,
            unique=True,
        ),
        sa.Column("qtd_avaliacoes_usuarios", sa.Integer(), nullable=False),
        sa.Column("nota_media_usuarios", sa.Double()),
    )
    op.create_table(
        "fact_movies_performance",
        sa.Column(
            "sk_movie_id",
            sa.String(64),
            sa.ForeignKey("dim_movies.sk_movie_id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("orcamento_usd", sa.Numeric(18, 2)),
        sa.Column("receita_usd", sa.Numeric(18, 2)),
        sa.Column("lucro_usd", sa.Numeric(18, 2), nullable=False),
        sa.Column("orcamento_brl", sa.Numeric(18, 2)),
        sa.Column("receita_brl", sa.Numeric(18, 2)),
        sa.Column("lucro_brl", sa.Numeric(18, 2), nullable=False),
        sa.Column("popularidade", sa.Double()),
        sa.Column("nota_tmdb", sa.Double()),
        sa.Column("qtd_tmdb", sa.Integer()),
        sa.Column("nota_imdb", sa.Double()),
        sa.Column("qtd_imdb", sa.Integer()),
    )
    op.create_table(
        "movie_reviews",
        sa.Column("sk_movie_review_id", sa.String(64), primary_key=True),
        sa.Column(
            "sk_movie_id",
            sa.String(64),
            sa.ForeignKey("dim_movies.sk_movie_id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("nome", sa.String(120), nullable=False),
        sa.Column("nota", sa.Double(), nullable=False),
        sa.Column("comentario", sa.String(4000), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("(CURRENT_TIMESTAMP)"),
            nullable=False,
        ),
        sa.CheckConstraint("nota >= 0 AND nota <= 10", name="nota_range"),
    )
    op.create_index("ix_movie_reviews_sk_movie_id", "movie_reviews", ["sk_movie_id"])


def downgrade() -> None:
    op.drop_index("ix_movie_reviews_sk_movie_id", table_name="movie_reviews")
    op.drop_table("movie_reviews")
    op.drop_table("fact_movies_performance")
    op.drop_table("dim_reviews")
    op.drop_index("ix_bridge_movie_person_sk_person_id", table_name="bridge_movie_person")
    op.drop_table("bridge_movie_person")
    op.drop_table("bridge_movie_genre")
    op.drop_table("bridge_movie_company")
    op.drop_index("ix_dim_people_nome_pessoa", table_name="dim_people")
    op.drop_table("dim_people")
    op.drop_index("ix_dim_movies_titulo", table_name="dim_movies")
    op.drop_index("ix_dim_movies_id_filme", table_name="dim_movies")
    op.drop_index("ix_dim_movies_ano_lancamento", table_name="dim_movies")
    op.drop_table("dim_movies")
    op.drop_table("dim_genres")
    op.drop_table("dim_companies")
