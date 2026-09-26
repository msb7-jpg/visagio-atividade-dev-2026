import { useQuery } from '@tanstack/react-query'
import { movieDetailsApi } from '@/features/movie-details/api/movieDetailsApi'
import type { MovieDetailDTO } from '@/features/movie-details/types/movie-details.types'

export function useMovieDetailsQuery(movieId: string | undefined) {
  return useQuery<MovieDetailDTO, Error>({
    queryKey: ['movies', movieId],
    queryFn: () => {
      if (!movieId) {
        throw new Error('ID do filme não fornecido')
      }
      return movieDetailsApi.getMovieById(movieId)
    },
    enabled: Boolean(movieId),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000
  })
}
