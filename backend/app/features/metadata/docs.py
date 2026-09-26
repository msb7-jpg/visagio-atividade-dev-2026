from app.features.movies.schemas import CompanyDTO, GenreDTO
from app.shared.docs import EndpointsDocs

GenresDocs = EndpointsDocs(
    response_model=list[GenreDTO],
    summary="Listagem deduplicada de gêneros para filtros",
    description="Retorna uma lista de gêneros deduplicados para uso em filtros analíticos."
)

CompaniesDocs = EndpointsDocs(
    response_model=list[CompanyDTO],
    summary="Listagem de estúdios e produtoras para filtros analíticos",
    description="Retorna uma lista de estúdios e produtoras para uso em filtros analíticos, limitada aos 50 principais por popularidade."
)

