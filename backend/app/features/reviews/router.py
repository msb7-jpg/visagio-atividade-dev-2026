from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.db.session import get_db
from app.features.reviews.docs import CreateMovieReviewDoc, ListMovieReviewsDoc
from app.features.reviews.schemas import ReviewCreateDTO, ReviewResponseDTO
from app.features.reviews.service import ReviewsService

reviews_router = APIRouter()

ReviewsSvc = Annotated[
    ReviewsService,
    Depends(lambda session=Depends(get_db): ReviewsService(session)),
]


@reviews_router.get("/{movie_id}/reviews", **ListMovieReviewsDoc.to_dict())
async def list_movie_reviews(
    movie_id: str,
    service: ReviewsSvc,
) -> list[ReviewResponseDTO]:
    """Lista todas as avaliações de um filme específico."""
    return await service.list_reviews_by_movie(movie_id)


@reviews_router.post("/{movie_id}/reviews", **CreateMovieReviewDoc.to_dict())
async def create_movie_review(
    movie_id: str,
    data: ReviewCreateDTO,
    service: ReviewsSvc,
) -> ReviewResponseDTO:
    """Cria uma nova avaliação de usuário para um filme e atualiza a média."""
    review = await service.create_review(movie_id, data)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Filme com ID '{movie_id}' não foi encontrado.",
        )
    return review


@reviews_router.put(
    "/{movie_id}/reviews/{review_id}",
    response_model=ReviewResponseDTO,
    status_code=status.HTTP_200_OK,
    summary="Atualiza uma avaliação existente e recalcula as médias",
)
async def update_movie_review(
    movie_id: str,
    review_id: str,
    data: ReviewCreateDTO,
    service: ReviewsSvc,
) -> ReviewResponseDTO:
    """Atualiza uma avaliação de usuário para um filme e atualiza a média."""
    review = await service.update_review(movie_id, review_id, data)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Avaliação ou filme '{movie_id}' não foi encontrado.",
        )
    return review

