from app.features.movies.schemas import (
    MovieDetailDTO,
    MovieListItemDTO,
    QuickSearchMovieDTO,
)
from app.shared.docs import EndpointDoc
from app.shared.pagination import PaginatedResponse

ListMoviesDoc = EndpointDoc(
    response_model=PaginatedResponse[MovieListItemDTO],
    summary="Listagem paginada e filtrada de filmes para o catálogo",
    description="Retorna uma lista paginada aplicando filtros dinâmicos de texto, gênero, produtora e ordenação.",
)

QuickSearchDoc = EndpointDoc(
    response_model=list[QuickSearchMovieDTO],
    summary="Busca rápida otimizada para Command Palette / Spotlight",
    description="Pesquisa instantânea em títulos ordenada por relevância e popularidade.",
)

GetMovieDetailDoc = EndpointDoc(
    response_model=MovieDetailDTO,
    summary="Obtém a ficha técnica completa e métricas de um filme por ID",
    description="Retorna detalhes completos, elenco/equipe técnica, métricas financeiras (orçamento, receita, ROI) e notas.",
)

CreateMovieDoc = EndpointDoc(
    response_model=MovieDetailDTO,
    summary="Cadastra um novo filme no catálogo (Requer Admin)",
    description="Cria um novo registro de filme com validação estrita de metadados, associação de gêneros e diretor.",
    extra_options={"status_code": 201},
)

UpdateMovieDoc = EndpointDoc(
    response_model=MovieDetailDTO,
    summary="Atualiza informações de um filme existente (Requer Admin)",
    description="Atualiza parcialmente ou integralmente os metadados do filme, seus gêneros e equipe.",
)

DeleteMovieDoc = EndpointDoc(
    response_model=None,
    summary="Exclui um filme do catálogo e suas associações (Requer Admin)",
    description="Remove de forma transacional e segura o filme, suas associações de gênero/equipe e métricas.",
    extra_options={"status_code": 204},
)
