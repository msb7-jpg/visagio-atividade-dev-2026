from decimal import Decimal
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


class GenreDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sk_genre_id: str
    nome_genero: str


class CompanyDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sk_company_id: str
    nome_produtora: str


class MovieListItemDTO(BaseModel):
    """Item resumido do catálogo de filmes para Grid ou List."""

    model_config = ConfigDict(from_attributes=True)

    sk_movie_id: str
    id_filme: str
    titulo: str
    ano_lancamento: int | None = None
    duracao_minutos: int | None = None
    sinopse: str | None = None
    url_poster: str | None = None
    url_backdrop: str | None = None

    # Metadados adicionais
    generos: list[str] = Field(default_factory=list)
    diretores: list[str] = Field(default_factory=list)
    produtoras: list[str] = Field(default_factory=list)

    # Indicadores analíticos
    popularidade: float = 0.0
    nota_media_usuarios: float | None = None
    qtd_avaliacoes_usuarios: int = 0
    nota_tmdb: float | None = None
    nota_imdb: float | None = None
    receita_usd: Decimal | None = None
    receita_brl: Decimal | None = None

    @classmethod
    def from_movie_model(
        cls,
        m: Any,
        generos: list[str] | None = None,
        diretores: list[str] | None = None,
        produtoras: list[str] | None = None,
    ) -> "MovieListItemDTO":
        """Constrói o DTO a partir do modelo ORM DimMovie tratando valores nulos e relações."""
        perf = getattr(m, "performance", None)
        rev = getattr(m, "reviews_summary", None)

        pop_val = getattr(perf, "popularidade", None)
        tmdb_val = getattr(perf, "nota_tmdb", None)
        imdb_val = getattr(perf, "nota_imdb", None)
        user_rating_val = getattr(rev, "nota_media_usuarios", None)

        if generos is None:
            generos = [g.nome_genero for g in getattr(m, "genres", [])]
        if produtoras is None:
            produtoras = [c.nome_produtora for c in getattr(m, "companies", [])]
        if diretores is None:
            diretores = [
                p.nome_pessoa
                for p in getattr(m, "people", [])
                if getattr(p, "tipo_pessoa", "") == "Diretor"
            ]

        return cls(
            sk_movie_id=m.sk_movie_id,
            id_filme=m.id_filme,
            titulo=m.titulo,
            ano_lancamento=m.ano_lancamento,
            duracao_minutos=m.duracao_minutos,
            sinopse=m.sinopse,
            url_poster=m.url_poster,
            url_backdrop=m.url_backdrop,
            generos=generos,
            diretores=diretores,
            produtoras=produtoras,
            popularidade=float(pop_val) if pop_val is not None else 0.0,
            nota_media_usuarios=float(user_rating_val) if user_rating_val is not None else None,
            qtd_avaliacoes_usuarios=getattr(rev, "qtd_avaliacoes_usuarios", 0) or 0,
            nota_tmdb=float(tmdb_val) if tmdb_val is not None else None,
            nota_imdb=float(imdb_val) if imdb_val is not None else None,
            receita_usd=getattr(perf, "receita_usd", None),
            receita_brl=getattr(perf, "receita_brl", None),
        )


class QuickSearchMovieDTO(BaseModel):
    """Item ultraleve otimizado para Spotlight / Command Palette."""

    model_config = ConfigDict(from_attributes=True)

    sk_movie_id: str
    id_filme: str
    titulo: str
    ano_lancamento: int | None = None
    url_poster: str | None = None
    nota_media_usuarios: float | None = None
    popularidade: float = 0.0
    generos: list[str] = Field(default_factory=list)

    @classmethod
    def from_movie_model(cls, m: Any) -> "QuickSearchMovieDTO":
        """Constrói o DTO de busca rápida a partir de DimMovie."""
        perf = getattr(m, "performance", None)
        rev = getattr(m, "reviews_summary", None)

        pop_val = getattr(perf, "popularidade", None)
        user_rating_val = getattr(rev, "nota_media_usuarios", None)

        return cls(
            sk_movie_id=m.sk_movie_id,
            id_filme=m.id_filme,
            titulo=m.titulo,
            ano_lancamento=m.ano_lancamento,
            url_poster=m.url_poster,
            nota_media_usuarios=float(user_rating_val) if user_rating_val is not None else None,
            popularidade=float(pop_val) if pop_val is not None else 0.0,
            generos=[g.nome_genero for g in getattr(m, "genres", [])],
        )


SortField = Literal[
    "popularidade",
    "nota_media_usuarios",
    "receita_usd",
    "ano_lancamento",
    "titulo",
]
SortOrder = Literal["asc", "desc"]


class PersonSummaryDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sk_person_id: str
    nome_pessoa: str
    tipo_pessoa: str


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


class MovieDetailDTO(BaseModel):
    """Ficha técnica detalhada completa de um filme."""

    model_config = ConfigDict(from_attributes=True)

    sk_movie_id: str
    id_filme: str
    titulo: str
    data_lancamento: str | None = None
    ano_lancamento: int | None = None
    duracao_minutos: int | None = None
    status_filme: str | None = None
    sinopse: str | None = None
    url_poster: str | None = None
    url_backdrop: str | None = None

    # Relacionamentos
    generos: list[GenreDTO] = Field(default_factory=list)
    produtoras: list[CompanyDTO] = Field(default_factory=list)
    diretores: list[PersonSummaryDTO] = Field(default_factory=list)
    roteiristas: list[PersonSummaryDTO] = Field(default_factory=list)
    atores: list[PersonSummaryDTO] = Field(default_factory=list)

    # Métricas e notas
    metricas: FinancialMetricsDTO = Field(default_factory=FinancialMetricsDTO)
    nota_media_usuarios: float | None = None
    qtd_avaliacoes_usuarios: int = 0
