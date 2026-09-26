from decimal import Decimal
from typing import Any

from pydantic import BaseModel


class FinancialMetricsDTO(BaseModel):
    """Métricas financeiras e avaliações externas da camada analítica."""

    orcamento_usd: Decimal | None = None
    receita_usd: Decimal | None = None
    lucro_usd: Decimal | None = None
    orcamento_brl: Decimal | None = None
    receita_brl: Decimal | None = None
    lucro_brl: Decimal | None = None
    roi_percentual: float | None = None
    popularidade: float = 0.0
    nota_tmdb: float | None = None
    qtd_tmdb: int | None = None
    nota_imdb: float | None = None
    qtd_imdb: int | None = None

    @classmethod
    def from_model(cls, perf: Any | None) -> "FinancialMetricsDTO":
        """Calcula ROI e formata métricas a partir da FactMoviePerformance."""
        if not perf:
            return cls()

        roi: float | None = None
        if perf.orcamento_usd and perf.receita_usd and perf.orcamento_usd > 0:
            roi = float(((perf.receita_usd - perf.orcamento_usd) / perf.orcamento_usd) * 100)

        return cls(
            orcamento_usd=getattr(perf, "orcamento_usd", None),
            receita_usd=getattr(perf, "receita_usd", None),
            lucro_usd=getattr(perf, "lucro_usd", None),
            orcamento_brl=getattr(perf, "orcamento_brl", None),
            receita_brl=getattr(perf, "receita_brl", None),
            lucro_brl=getattr(perf, "lucro_brl", None),
            roi_percentual=roi,
            popularidade=float(getattr(perf, "popularidade", 0.0) or 0.0),
            nota_tmdb=(
                float(getattr(perf, "nota_tmdb", None))
                if getattr(perf, "nota_tmdb", None) is not None
                else None
            ),
            qtd_tmdb=getattr(perf, "qtd_tmdb", None),
            nota_imdb=(
                float(getattr(perf, "nota_imdb", None))
                if getattr(perf, "nota_imdb", None) is not None
                else None
            ),
            qtd_imdb=getattr(perf, "qtd_imdb", None),
        )
