import { apiClient } from '@/lib/api-client'
import type { CreateReviewDTO, MovieReviewDTO } from '@/features/reviews/types/reviews.types'

export async function fetchMovieReviews(movieId: string): Promise<MovieReviewDTO[]> {
  const response = await apiClient.get<MovieReviewDTO[]>(`/movies/${movieId}/reviews`)
  return response.data
}

export async function submitMovieReview(
  movieId: string,
  payload: CreateReviewDTO
): Promise<MovieReviewDTO> {
  const response = await apiClient.post<MovieReviewDTO>(`/movies/${movieId}/reviews`, payload)
  return response.data
}

export async function updateMovieReview(
  movieId: string,
  reviewId: string,
  payload: CreateReviewDTO
): Promise<MovieReviewDTO> {
  const response = await apiClient.put<MovieReviewDTO>(
    `/movies/${movieId}/reviews/${reviewId}`,
    payload
  )
  return response.data
}
