"""Documentação OpenAPI para os endpoints do slice de Pessoas."""

from app.features.movies.schemas import MovieListItemDTO
from app.features.people.schemas import PersonDetailDTO, QuickSearchPersonDTO
from app.shared.docs import EndpointDoc
from app.shared.pagination import PaginatedResponse

GetPersonDetailDoc = EndpointDoc(
    response_model=PersonDetailDTO,
    summary="Obtém os dados detalhados e estatísticas de uma pessoa",
    description=(
        "Retorna perfil, papéis conhecidos, número de filmes no catálogo, "
        "nota média e anos de atividade."
    ),
)

GetPersonMoviesDoc = EndpointDoc(
    response_model=PaginatedResponse[MovieListItemDTO],
    summary="Lista a filmografia paginada e filtrada de uma pessoa",
    description=(
        "Retorna filmes nos quais a pessoa atuou, dirigiu ou escreveu, "
        "com suporte a paginação, ordenação e filtros por gênero e ano."
    ),
)

QuickSearchPeopleDoc = EndpointDoc(
    response_model=list[QuickSearchPersonDTO],
    summary="Busca rápida otimizada de pessoas para a Command Palette",
    description="Pesquisa instantânea em nomes de pessoas com contagem de obras.",
)
