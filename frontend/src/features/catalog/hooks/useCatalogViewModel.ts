import { useCatalogParams } from '@/features/catalog/hooks/useCatalogParams'
import {
  useMoviesQuery,
  useGenresQuery,
  useAvailableYearsQuery,
  useAvailableStatusesQuery
} from '@/features/catalog/hooks/useMoviesQuery'

export function useCatalogViewModel() {
  const catalogParams = useCatalogParams()

  const { data: moviesData, isLoading, isFetching, isError } = useMoviesQuery({
    page: catalogParams.page,
    pageSize: 24,
    q: catalogParams.q,
    genre: catalogParams.genre,
    year: catalogParams.year,
    status: catalogParams.status,
    sortBy: catalogParams.sortBy,
    order: catalogParams.sortOrder
  })

  const { data: genresData } = useGenresQuery()
  const { data: availableYearsData } = useAvailableYearsQuery()
  const { data: availableStatusesData } = useAvailableStatusesQuery()

  return {
    ...catalogParams,
    movies: moviesData?.items ?? [],
    total: moviesData?.total ?? 0,
    totalPages: moviesData?.total_pages ?? 1,
    genres: genresData ?? [],
    availableYears: availableYearsData ?? [],
    availableStatuses: availableStatusesData ?? ['Lançado', 'Não Lançado', 'Pós-Produção', 'Em Produção', 'Planejado'],
    isLoading,
    isFetching,
    isError
  }
}
