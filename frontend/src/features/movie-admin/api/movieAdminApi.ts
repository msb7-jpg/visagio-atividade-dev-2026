import type {
  CreateMoviePayload,
  DirectorItem,
  MovieDetailDTO,
  UpdateMoviePayload
} from '@/features/movie-admin/types/movie-admin.types'
import { apiClient } from '@/lib/api-client'

export const movieAdminApi = {
  createMovie: async (payload: CreateMoviePayload): Promise<MovieDetailDTO> => {
    const response = await apiClient.post<MovieDetailDTO>('/movies', payload)
    return response.data
  },

  updateMovie: async (
    movieId: string,
    payload: UpdateMoviePayload
  ): Promise<MovieDetailDTO> => {
    const response = await apiClient.put<MovieDetailDTO>(`/movies/${movieId}`, payload)
    return response.data
  },

  deleteMovie: async (movieId: string): Promise<void> => {
    await apiClient.delete(`/movies/${movieId}`)
  },

  searchDirectors: async (query = '', limit = 15): Promise<DirectorItem[]> => {
    const response = await apiClient.get<DirectorItem[]>('/directors', {
      params: { search: query, limit }
    })
    return response.data
  }
}
