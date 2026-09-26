"""Cria tabela user_movie_interactions para favoritos e watchlist.

Revision ID: 0003_user_movie_interactions
Revises: 0002_perf_pop_idx
Create Date: 2026-09-26
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "0003_user_movie_interactions"
down_revision: str | Sequence[str] | None = "0002_perf_pop_idx"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "user_movie_interactions",
        sa.Column("sk_interaction_id", sa.String(length=64), nullable=False),
        sa.Column("user_id", sa.String(length=128), nullable=False),
        sa.Column("sk_movie_id", sa.String(length=64), nullable=False),
        sa.Column("is_favorite", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("in_watchlist", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(
            ["sk_movie_id"],
            ["dim_movies.sk_movie_id"],
            name=op.f("fk_user_movie_interactions_sk_movie_id_dim_movies"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("sk_interaction_id", name=op.f("pk_user_movie_interactions")),
        sa.UniqueConstraint("user_id", "sk_movie_id", name=op.f("uq_user_movie_interactions_user_id_sk_movie_id")),
    )
    op.create_index(
        op.f("ix_user_movie_interactions_user_id"),
        "user_movie_interactions",
        ["user_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_user_movie_interactions_sk_movie_id"),
        "user_movie_interactions",
        ["sk_movie_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_user_movie_interactions_is_favorite"),
        "user_movie_interactions",
        ["is_favorite"],
        unique=False,
    )
    op.create_index(
        op.f("ix_user_movie_interactions_in_watchlist"),
        "user_movie_interactions",
        ["in_watchlist"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_user_movie_interactions_in_watchlist"), table_name="user_movie_interactions")
    op.drop_index(op.f("ix_user_movie_interactions_is_favorite"), table_name="user_movie_interactions")
    op.drop_index(op.f("ix_user_movie_interactions_sk_movie_id"), table_name="user_movie_interactions")
    op.drop_index(op.f("ix_user_movie_interactions_user_id"), table_name="user_movie_interactions")
    op.drop_table("user_movie_interactions")
