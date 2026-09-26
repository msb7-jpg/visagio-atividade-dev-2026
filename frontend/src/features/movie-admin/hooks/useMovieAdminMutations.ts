import { movieAdminApi } from '@/features/movie-admin/api/movieAdminApi'
import type {
  CreateMoviePayload,
  MovieDetailDTO,
  UpdateMoviePayload
} from '@/features/movie-admin/types/movie-admin.types'
import { routes } from '@/routes/routes.types'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'

interface UseCreateMovieMutationOptions {
  onSuccess?: (data: MovieDetailDTO) => void
  onError?: (error: Error) => void
}

export function useCreateMovieMutation(
  options?: UseCreateMovieMutationOptions
): UseMutationResult<MovieDetailDTO, Error, CreateMoviePayload> {
  return useMutation({
    mutationFn: (payload: CreateMoviePayload) => movieAdminApi.createMovie(payload),
    meta: {
      redirectOnSuccess: (data: unknown) =>
        routes.movieDetail((data as MovieDetailDTO).sk_movie_id),
      invalidates: [['movies']],
      successMessage: 'Filme cadastrado com sucesso!'
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data)
    },
    onError: (err) => {
      options?.onError?.(err)
    }
  })
}

interface UseUpdateMovieMutationOptions {
  onSuccess?: (data: MovieDetailDTO) => void
  onError?: (error: Error) => void
}

export function useUpdateMovieMutation(
  options?: UseUpdateMovieMutationOptions
): UseMutationResult<
  MovieDetailDTO,
  Error,
  { movieId: string; payload: UpdateMoviePayload }
> {
  return useMutation({
    mutationFn: ({ movieId, payload }: { movieId: string; payload: UpdateMoviePayload }) =>
      movieAdminApi.updateMovie(movieId, payload),
    meta: {
      redirectOnSuccess: (data: unknown) =>
        routes.movieDetail((data as MovieDetailDTO).sk_movie_id),
      invalidates: [['movies'], ['movie-detail']],
      successMessage: 'Filme atualizado com sucesso!'
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data)
    },
    onError: (err) => {
      options?.onError?.(err)
    }
  })
}

interface UseDeleteMovieMutationOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useDeleteMovieMutation(
  options?: UseDeleteMovieMutationOptions
): UseMutationResult<void, Error, string> {
  return useMutation({
    mutationFn: (movieId: string) => movieAdminApi.deleteMovie(movieId),
    meta: {
      redirectOnSuccess: routes.home(),
      invalidates: [['movies']],
      successMessage: 'Filme excluído com sucesso!'
    },
    onSuccess: () => {
      options?.onSuccess?.()
    },
    onError: (err) => {
      options?.onError?.(err)
    }
  })
}
