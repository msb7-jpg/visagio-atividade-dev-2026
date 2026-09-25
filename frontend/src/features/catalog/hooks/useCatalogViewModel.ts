import { useCatalogParams } from '@/features/catalog/hooks/useCatalogParams'
import { useMoviesQuery, useGenresQuery } from '@/features/catalog/hooks/useMoviesQuery'

export function useCatalogViewModel() {
  const catalogParams = useCatalogParams()

  const { data: moviesData, isLoading, isError } = useMoviesQuery({
    page: catalogParams.page,
    pageSize: 24,
    q: catalogParams.q,
    genre: catalogParams.genre,
    sortBy: catalogParams.sortBy,
    order: catalogParams.sortBy === 'titulo' ? 'asc' : 'desc'
  })

  const { data: genresData } = useGenresQuery()

  return {
    ...catalogParams,
    movies: moviesData?.items ?? [],
    total: moviesData?.total ?? 0,
    totalPages: moviesData?.total_pages ?? 1,
    genres: genresData ?? [],
    isLoading,
    isError
  }
}
