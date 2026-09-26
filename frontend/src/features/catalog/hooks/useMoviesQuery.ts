import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  fetchMovies,
  fetchGenres,
  fetchCompanies,
  fetchAvailableYears,
  type FetchMoviesParams
} from '@/features/catalog/api/catalogApi'

export function useMoviesQuery(params: FetchMoviesParams) {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: () => fetchMovies(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 3 // 3 minutos
  })
}

export function useGenresQuery() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
    staleTime: 1000 * 60 * 30 // 30 minutos
  })
}

export function useCompaniesQuery() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
    staleTime: 1000 * 60 * 30 // 30 minutos
  })
}

export function useAvailableYearsQuery() {
  return useQuery({
    queryKey: ['available-years'],
    queryFn: fetchAvailableYears,
    staleTime: 1000 * 60 * 60 // 1 hora
  })
}
