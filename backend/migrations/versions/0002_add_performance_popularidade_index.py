"""Adiciona indice de popularidade para fact_movies_performance.

Revision ID: 0002_perf_pop_idx
Revises: 0001_initial_movie_schema
Create Date: 2026-09-25
"""

from collections.abc import Sequence

from alembic import op

revision: str = "0002_perf_pop_idx"
down_revision: str | Sequence[str] | None = "0001_initial_movie_schema"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_index(
        "ix_fact_movies_performance_popularidade",
        "fact_movies_performance",
        ["popularidade"],
        unique=False,
        if_not_exists=True,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_fact_movies_performance_popularidade",
        table_name="fact_movies_performance",
    )
