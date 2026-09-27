import { apiClient } from '@/lib/api-client'
import type {
  PersonDetail,
  PersonFilmographyResponse,
  QuickSearchPerson
} from '@/features/people/types/people.types'

export interface PersonMoviesParams {
  page?: number
  page_size?: number
  q?: string
  genre?: string
  year?: number
  sort_by?: string
  order?: 'asc' | 'desc'
}

export const peopleApi = {
  getPersonDetail: async (personId: string): Promise<PersonDetail> => {
    const { data } = await apiClient.get<PersonDetail>(`/people/${personId}`)
    return data
  },

  getPersonMovies: async (
    personId: string,
    params: PersonMoviesParams = {}
  ): Promise<PersonFilmographyResponse> => {
    const cleanParams: Record<string, string | number> = {}
    if (params.page) cleanParams.page = params.page
    if (params.page_size) cleanParams.page_size = params.page_size
    if (params.q?.trim()) cleanParams.q = params.q.trim()
    if (params.genre?.trim()) cleanParams.genre = params.genre.trim()
    if (params.year) cleanParams.year = params.year
    if (params.sort_by) cleanParams.sort_by = params.sort_by
    if (params.order) cleanParams.order = params.order

    const { data } = await apiClient.get<PersonFilmographyResponse>(
      `/people/${personId}/movies`,
      { params: cleanParams }
    )
    return data
  },

  quickSearchPeople: async (
    query: string,
    limit: number = 8
  ): Promise<QuickSearchPerson[]> => {
    if (!query || query.trim().length < 2) return []
    const { data } = await apiClient.get<QuickSearchPerson[]>(
      '/people/quick-search',
      {
        params: { q: query.trim(), limit }
      }
    )
    return data
  }
}
