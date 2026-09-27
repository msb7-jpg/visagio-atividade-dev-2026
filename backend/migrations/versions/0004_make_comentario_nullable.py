"""Torna a coluna comentario em movie_reviews nullable.

Revision ID: 0004_make_comentario_nullable
Revises: 0003_user_movie_interactions
Create Date: 2026-09-27
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "0004_make_comentario_nullable"
down_revision: str | Sequence[str] | None = "0003_user_movie_interactions"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    with op.batch_alter_table("movie_reviews", schema=None) as batch_op:
        batch_op.alter_column(
            "comentario",
            existing_type=sa.String(length=4000),
            nullable=True,
        )


def downgrade() -> None:
    with op.batch_alter_table("movie_reviews", schema=None) as batch_op:
        batch_op.alter_column(
            "comentario",
            existing_type=sa.String(length=4000),
            nullable=False,
            server_default="",
        )
