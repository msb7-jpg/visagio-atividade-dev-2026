from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.features.movies.schemas.common import CompanyDTO, GenreDTO, PersonSummaryDTO
from app.features.movies.schemas.metrics import FinancialMetricsDTO


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

    @classmethod
    def from_model(cls, movie: Any) -> "MovieDetailDTO":
        """Mapeia os modelos do banco de dados agregados para o DTO de resposta."""
        diretores: list[PersonSummaryDTO] = []
        roteiristas: list[PersonSummaryDTO] = []
        atores: list[PersonSummaryDTO] = []

        for person in getattr(movie, "people", []):
            p_dto = PersonSummaryDTO(
                sk_person_id=person.sk_person_id,
                nome_pessoa=person.nome_pessoa,
                tipo_pessoa=person.tipo_pessoa,
            )
            if person.tipo_pessoa == "Diretor":
                diretores.append(p_dto)
            elif person.tipo_pessoa == "Roteirista":
                roteiristas.append(p_dto)
            elif person.tipo_pessoa == "Ator":
                atores.append(p_dto)

        perf = getattr(movie, "performance", None)
        metrics_dto = FinancialMetricsDTO.from_model(perf)

        rev = getattr(movie, "reviews_summary", None)
        user_rating_val = getattr(rev, "nota_media_usuarios", None)

        return cls(
            sk_movie_id=movie.sk_movie_id,
            id_filme=movie.id_filme,
            titulo=movie.titulo,
            data_lancamento=movie.data_lancamento.isoformat() if movie.data_lancamento else None,
            ano_lancamento=movie.ano_lancamento,
            duracao_minutos=movie.duracao_minutos,
            status_filme=movie.status_filme,
            sinopse=movie.sinopse,
            url_poster=movie.url_poster,
            url_backdrop=movie.url_backdrop,
            generos=[
                GenreDTO(sk_genre_id=g.sk_genre_id, nome_genero=g.nome_genero)
                for g in getattr(movie, "genres", [])
            ],
            produtoras=[
                CompanyDTO(sk_company_id=c.sk_company_id, nome_produtora=c.nome_produtora)
                for c in getattr(movie, "companies", [])
            ],
            diretores=diretores,
            roteiristas=roteiristas,
            atores=atores,
            metricas=metrics_dto,
            nota_media_usuarios=float(user_rating_val) if user_rating_val is not None else None,
            qtd_avaliacoes_usuarios=getattr(rev, "qtd_avaliacoes_usuarios", 0) or 0,
        )
