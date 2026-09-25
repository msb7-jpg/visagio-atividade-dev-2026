import { describe, it, expect, vi } from 'vitest'
import { fetchMovies, fetchGenres, fetchCompanies } from '../catalogApi'
import { apiClient } from '@/lib/api-client'

vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn()
  }
}))

describe('catalogApi', () => {
  it('fetchMovies envia parâmetros padrão e customizados', async () => {
    const mockData = {
      items: [],
      total: 0,
      page: 1,
      page_size: 24,
      total_pages: 0
    }
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockData })

    const result = await fetchMovies({ page: 2, q: 'Matrix', genre: 'Ação' })
    expect(apiClient.get).toHaveBeenCalledWith('/movies', {
      params: {
        page: 2,
        page_size: 24,
        q: 'Matrix',
        genre: 'Ação',
        company: undefined,
        sort_by: 'popularidade',
        order: 'desc'
      }
    })
    expect(result).toEqual(mockData)
  })

  it('fetchGenres chama /genres', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [{ sk_genre_id: '1', nome_genero: 'Ação' }] })
    const result = await fetchGenres()
    expect(apiClient.get).toHaveBeenCalledWith('/genres')
    expect(result).toHaveLength(1)
  })

  it('fetchCompanies chama /companies', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [{ sk_company_id: '1', nome_produtora: 'Warner' }] })
    const result = await fetchCompanies()
    expect(apiClient.get).toHaveBeenCalledWith('/companies')
    expect(result).toHaveLength(1)
  })
})
