import { apiClient } from '@/lib/api-client'
import type { MovieDetailDTO } from '@/features/movie-details/types/movie-details.types'

export const movieDetailsApi = {
  getMovieById: async (movieId: string): Promise<MovieDetailDTO> => {
    const response = await apiClient.get<MovieDetailDTO>(`/movies/${movieId}`)
    return response.data
  }
}
