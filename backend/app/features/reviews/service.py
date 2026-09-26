from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.reviews.schemas import ReviewCreateDTO, ReviewResponseDTO
from app.movies.models import DimMovie, DimReview, MovieReview


class ReviewsService:
    """Serviço transacional para gestão de avaliações e recálculo de médias."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def _resolve_movie_sk_id(self, movie_id: str) -> str | None:
        """Resolve se o identificador informado é sk_movie_id ou id_filme."""
        stmt = select(DimMovie.sk_movie_id).where(
            (DimMovie.sk_movie_id == movie_id) | (DimMovie.id_filme == movie_id)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_reviews_by_movie(self, movie_id: str) -> list[ReviewResponseDTO]:
        """Retorna histórico de avaliações do filme ordenado por data decrescente."""
        sk_id = await self._resolve_movie_sk_id(movie_id)
        if not sk_id:
            return []

        stmt = (
            select(MovieReview)
            .where(MovieReview.sk_movie_id == sk_id)
            .order_by(MovieReview.created_at.desc(), MovieReview.sk_movie_review_id.desc())
        )
        result = await self.session.execute(stmt)
        reviews = result.scalars().all()
        return [ReviewResponseDTO.model_validate(r) for r in reviews]

    async def _recalculate_dim_review(self, sk_id: str) -> None:
        """Recalcula atomicamente a contagem e média das avaliações do filme."""
        agg_stmt = (
            select(
                func.count(MovieReview.sk_movie_review_id).label("total"),
                func.avg(MovieReview.nota).label("media"),
            )
            .where(MovieReview.sk_movie_id == sk_id)
        )
        agg_res = await self.session.execute(agg_stmt)
        total, media = agg_res.one()

        media_val = round(float(media), 2) if media is not None else None

        dim_res = await self.session.execute(
            select(DimReview).where(DimReview.sk_movie_id == sk_id)
        )
        dim_review = dim_res.scalar_one_or_none()
        if dim_review is None:
            dim_review = DimReview(
                sk_movie_id=sk_id,
                qtd_avaliacoes_usuarios=total or 0,
                nota_media_usuarios=media_val,
            )
            self.session.add(dim_review)
        else:
            dim_review.qtd_avaliacoes_usuarios = total or 0
            dim_review.nota_media_usuarios = media_val

    async def create_review(
        self, movie_id: str, data: ReviewCreateDTO
    ) -> ReviewResponseDTO | None:
        """Cria uma nova avaliação e recalcula atomicamente dim_reviews para o filme."""
        if not (sk_id := await self._resolve_movie_sk_id(movie_id)):
            return None

        review = MovieReview(
            sk_movie_id=sk_id,
            nome=data.nome,
            nota=data.nota,
            comentario=data.comentario,
        )
        self.session.add(review)
        await self.session.flush()

        await self._recalculate_dim_review(sk_id)
        await self.session.commit()
        await self.session.refresh(review)

        return ReviewResponseDTO.model_validate(review)

    async def update_review(
        self, movie_id: str, review_id: str, data: ReviewCreateDTO
    ) -> ReviewResponseDTO | None:
        """Atualiza uma avaliação existente e recalcula atomicamente dim_reviews para o filme."""
        if not (sk_id := await self._resolve_movie_sk_id(movie_id)):
            return None

        stmt = select(MovieReview).where(
            (MovieReview.sk_movie_review_id == review_id) & (MovieReview.sk_movie_id == sk_id)
        )
        res = await self.session.execute(stmt)
        review = res.scalar_one_or_none()
        if not review:
            return None

        review.nome = data.nome
        review.nota = data.nota
        review.comentario = data.comentario
        await self.session.flush()

        await self._recalculate_dim_review(sk_id)
        await self.session.commit()
        await self.session.refresh(review)

        return ReviewResponseDTO.model_validate(review)
