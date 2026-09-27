import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCatalogViewModel } from '../useCatalogViewModel'
import * as catalogParamsHook from '@/features/catalog/hooks/useCatalogParams'
import * as moviesQueryHook from '@/features/catalog/hooks/useMoviesQuery'

describe('useCatalogViewModel', () => {
  it('consolida dados paginados e estados de carregamento', () => {
    vi.spyOn(catalogParamsHook, 'useCatalogParams').mockReturnValue({
      page: 1,
      q: 'Matrix',
      genre: 'Ação',
      year: undefined,
      status: '',
      sortBy: 'popularidade',
      sortOrder: 'desc',
      viewMode: 'grid',
      setPage: vi.fn(),
      setQ: vi.fn(),
      setGenre: vi.fn(),
      setYear: vi.fn(),
      setStatus: vi.fn(),
      setSortBy: vi.fn(),
      setSortOrder: vi.fn(),
      toggleSort: vi.fn(),
      setViewMode: vi.fn()
    })

    vi.spyOn(moviesQueryHook, 'useMoviesQuery').mockReturnValue({
      data: {
        items: [
          {
            sk_movie_id: '1',
            id_filme: 'matrix',
            titulo: 'The Matrix',
            ano_lancamento: 1999,
            duracao_minutos: 136,
            sinopse: 'Neo',
            url_poster: null,
            url_backdrop: null,
            generos: ['Ação'],
            diretores: ['Lana'],
            produtoras: ['Warner'],
            popularidade: 90,
            nota_media_usuarios: 9,
            qtd_avaliacoes_usuarios: 100,
            nota_tmdb: 8.5,
            nota_imdb: 8.7,
            receita_usd: 1000,
            receita_brl: 5000
          }
        ],
        total: 1,
        page: 1,
        page_size: 24,
        total_pages: 1
      },
      isLoading: false,
      isError: false
    } as unknown as ReturnType<typeof moviesQueryHook.useMoviesQuery>)

    vi.spyOn(moviesQueryHook, 'useGenresQuery').mockReturnValue({
      data: [{ sk_genre_id: 'g-1', nome_genero: 'Ação' }]
    } as unknown as ReturnType<typeof moviesQueryHook.useGenresQuery>)

    vi.spyOn(moviesQueryHook, 'useAvailableYearsQuery').mockReturnValue({
      data: [2024, 2023, 1999]
    } as unknown as ReturnType<typeof moviesQueryHook.useAvailableYearsQuery>)

    vi.spyOn(moviesQueryHook, 'useAvailableStatusesQuery').mockReturnValue({
      data: ['Lançado', 'Pós-Produção', 'Não Lançado']
    } as unknown as ReturnType<typeof moviesQueryHook.useAvailableStatusesQuery>)

    const { result } = renderHook(() => useCatalogViewModel())

    expect(result.current.page).toBe(1)
    expect(result.current.q).toBe('Matrix')
    expect(result.current.movies).toHaveLength(1)
    expect(result.current.total).toBe(1)
    expect(result.current.genres).toHaveLength(1)
    expect(result.current.availableStatuses).toHaveLength(3)
    expect(result.current.isLoading).toBe(false)
  })
})
