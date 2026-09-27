import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateReviewDTO) => submitMovieReview(movieId, payload),
    onMutate: async (newReviewPayload: CreateReviewDTO) => {
      const queryKey = ['movies', movieId, 'reviews']
      // Cancela refetches em andamento para não sobrescrever o update otimista
      await queryClient.cancelQueries({ queryKey })

      const previousReviews = queryClient.getQueryData<MovieReviewDTO[]>(queryKey) || []

      // Injeta avaliação temporária no cache
      const optimisticReview: MovieReviewDTO = {
        sk_movie_review_id: `temp-${Date.now()}`,
        sk_movie_id: movieId,
        nome: newReviewPayload.nome,
        nota: newReviewPayload.nota,
        comentario: newReviewPayload.comentario ?? null,
        created_at: new Date().toISOString()
      }

      queryClient.setQueryData<MovieReviewDTO[]>(queryKey, [
        optimisticReview,
        ...previousReviews.filter(
          (r) => r.nome.trim().toLowerCase() !== newReviewPayload.nome.trim().toLowerCase()
        )
      ])

      return { previousReviews }
    },
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
    onError: (error, _variables, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(['movies', movieId, 'reviews'], context.previousReviews)
      }
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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      reviewId,
      payload
    }: {
      reviewId: string
      payload: CreateReviewDTO
    }) => updateMovieReview(movieId, reviewId, payload),
    onMutate: async ({ reviewId, payload }) => {
      const queryKey = ['movies', movieId, 'reviews']
      await queryClient.cancelQueries({ queryKey })

      const previousReviews = queryClient.getQueryData<MovieReviewDTO[]>(queryKey) || []

      // Atualiza imediatamente no cache do TanStack Query
      queryClient.setQueryData<MovieReviewDTO[]>(
        queryKey,
        previousReviews.map((r) =>
          r.sk_movie_review_id === reviewId
            ? {
              ...r,
              nome: payload.nome,
              nota: payload.nota,
              comentario: payload.comentario ?? null
            }
            : r
        )
      )

      return { previousReviews }
    },
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
    onError: (error, _variables, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(['movies', movieId, 'reviews'], context.previousReviews)
      }
      onError?.(error)
    }
  })
}
