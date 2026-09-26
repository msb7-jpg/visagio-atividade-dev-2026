import { apiClient } from '@/lib/api-client'
import type {
  PaginatedUserLibraryMoviesDTO,
  UserLibraryIdsDTO,
  UserMovieInteractionDTO
} from '@/features/user-library/types/user-library.types'

export async function getUserLibraryIds(): Promise<UserLibraryIdsDTO> {
  const response = await apiClient.get<UserLibraryIdsDTO>('/user/library/ids')
  return response.data
}

export async function getUserLibraryMovies(
  type: 'favorites' | 'watchlist' | 'all' = 'favorites',
  page = 1,
  pageSize = 20
): Promise<PaginatedUserLibraryMoviesDTO> {
  const response = await apiClient.get<PaginatedUserLibraryMoviesDTO>('/user/library/movies', {
    params: {
      type,
      page,
      page_size: pageSize
    }
  })
  return response.data
}

export async function toggleFavoriteMovie(movieId: string): Promise<UserMovieInteractionDTO> {
  const response = await apiClient.post<UserMovieInteractionDTO>(
    `/user/library/${movieId}/favorite`
  )
  return response.data
}

export async function toggleWatchlistMovie(movieId: string): Promise<UserMovieInteractionDTO> {
  const response = await apiClient.post<UserMovieInteractionDTO>(
    `/user/library/${movieId}/watchlist`
  )
  return response.data
}

export async function getMovieInteraction(movieId: string): Promise<UserMovieInteractionDTO> {
  const response = await apiClient.get<UserMovieInteractionDTO>(`/user/library/${movieId}`)
  return response.data
}
