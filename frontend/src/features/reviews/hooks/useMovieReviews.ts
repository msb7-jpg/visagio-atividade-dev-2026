import { useMutation, useQuery } from '@tanstack/react-query'
import {
  fetchMovieReviews,
  submitMovieReview,
  updateMovieReview
} from '@/features/reviews/api/reviewsApi'
import type { CreateReviewDTO, MovieReviewDTO } from '@/features/reviews/types/reviews.types'

export function useMovieReviewsQuery(movieId: string) {
  return useQuery({
    queryKey: ['movies', movieId, 'reviews'],
    queryFn: () => fetchMovieReviews(movieId),
    enabled: Boolean(movieId)
  })
}

interface UseSubmitMovieReviewOptions {
  movieId: string
  onSuccess?: (data: MovieReviewDTO) => void
  onError?: (error: unknown) => void
}

export function useSubmitMovieReviewMutation({
  movieId,
  onSuccess,
  onError
}: UseSubmitMovieReviewOptions) {
  return useMutation({
    mutationFn: (payload: CreateReviewDTO) => submitMovieReview(movieId, payload),
    meta: {
      invalidates: [
        ['movies', movieId, 'reviews'],
        ['movies', movieId],
        ['movies']
      ],
      successMessage: 'Sua avaliação foi publicada com sucesso!'
    },
    onSuccess: (data) => {
      onSuccess?.(data)
    },
    onError: (error) => {
      onError?.(error)
    }
  })
}

interface UseUpdateMovieReviewOptions {
  movieId: string
  onSuccess?: (data: MovieReviewDTO) => void
  onError?: (error: unknown) => void
}

export function useUpdateMovieReviewMutation({
  movieId,
  onSuccess,
  onError
}: UseUpdateMovieReviewOptions) {
  return useMutation({
    mutationFn: ({
      reviewId,
      payload
    }: {
      reviewId: string
      payload: CreateReviewDTO
    }) => updateMovieReview(movieId, reviewId, payload),
    meta: {
      invalidates: [
        ['movies', movieId, 'reviews'],
        ['movies', movieId],
        ['movies']
      ],
      successMessage: 'Sua avaliação foi atualizada com sucesso!'
    },
    onSuccess: (data) => {
      onSuccess?.(data)
    },
    onError: (error) => {
      onError?.(error)
    }
  })
}
