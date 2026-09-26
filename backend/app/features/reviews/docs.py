from app.features.reviews.schemas import ReviewResponseDTO
from app.shared.docs import EndpointDoc

ListMovieReviewsDoc = EndpointDoc(
    response_model=list[ReviewResponseDTO],
    summary="Lista o histórico completo de avaliações de um filme",
    description=(
        "Retorna todas as avaliações do filme ordenadas das mais recentes para as mais antigas."
    ),
)

CreateMovieReviewDoc = EndpointDoc(
    response_model=ReviewResponseDTO,
    summary="Cadastra uma nova avaliação e recalcula atomicamente a média",
    description=(
        "Insere uma nova resenha em movie_reviews e recalcula de forma atômica "
        "e transacional o resumo em dim_reviews."
    ),
    extra_options={"status_code": 201},
)
