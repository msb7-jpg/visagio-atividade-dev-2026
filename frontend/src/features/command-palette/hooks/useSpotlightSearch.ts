import { quickSearchMovies, type QuickSearchMovieItem } from '@/features/command-palette/api/spotlightApi'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function useSpotlightSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(handler)
  }, [query])

  const queryResult = useQuery<QuickSearchMovieItem[]>({
    queryKey: ['spotlight', debouncedQuery],
    queryFn: () => quickSearchMovies(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 1000 * 60 * 5 // 5 minutos de cache para respostas rápidas
  })

  return {
    ...queryResult,
    results: queryResult.data ?? [],
    isDebouncing: query !== debouncedQuery
  }
}
