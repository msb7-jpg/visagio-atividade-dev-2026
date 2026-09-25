import { apiClient } from '@/lib/api-client'

export interface QuickSearchMovieItem {
  sk_movie_id: string
  id_filme: string
  titulo: string
  ano_lancamento: number | null
  url_poster: string | null
  nota_media_usuarios: number | null
  popularidade: number
  generos: string[]
}

export async function quickSearchMovies(
  query: string,
  limit: number = 8
): Promise<QuickSearchMovieItem[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  const response = await apiClient.get<QuickSearchMovieItem[]>(
    '/movies/quick-search',
    {
      params: { q: query.trim(), limit }
    }
  )

  return response.data
}
