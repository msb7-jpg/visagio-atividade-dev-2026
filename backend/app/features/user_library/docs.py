"""Documentação OpenAPI para os endpoints da biblioteca do usuário."""

from app.features.user_library.schemas import (
    PaginatedUserLibraryMoviesDTO,
    UserLibraryIdsDTO,
    UserMovieInteractionDTO,
)
from app.shared.docs import EndpointDoc

GetLibraryIdsDoc = EndpointDoc(
    response_model=UserLibraryIdsDTO,
    summary="Obtém lista rápida de IDs favoritados e na watchlist",
    description=(
        "Retorna array leve com os IDs dos filmes favoritados e na watchlist "
        "do usuário autenticado para cache otimizado na UI."
    ),
)

ToggleFavoriteDoc = EndpointDoc(
    response_model=UserMovieInteractionDTO,
    summary="Alterna (toggle) o status de favorito de um filme",
    description="Inverte o status de favorito do filme especificado para o usuário autenticado.",
)

ToggleWatchlistDoc = EndpointDoc(
    response_model=UserMovieInteractionDTO,
    summary="Alterna (toggle) o status de watchlist de um filme",
    description=(
        "Inverte a presença do filme na lista de 'Quero Assistir' "
        "(watchlist) do usuário autenticado."
    ),
)

GetMovieInteractionDoc = EndpointDoc(
    response_model=UserMovieInteractionDTO | None,
    summary="Consulta o status de interação do usuário com um filme",
    description="Retorna se o filme está favoritado ou na watchlist para o usuário autenticado.",
)

GetLibraryMoviesDoc = EndpointDoc(
    response_model=PaginatedUserLibraryMoviesDTO,
    summary="Lista paginada de filmes da biblioteca do usuário",
    description=(
        "Retorna filmes favoritados ou na watchlist com informações "
        "completas para exibição em grid."
    ),
)
