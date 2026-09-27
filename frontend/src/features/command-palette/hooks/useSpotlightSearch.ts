import { quickSearchMovies, type QuickSearchMovieItem } from '@/features/command-palette/api/spotlightApi'
import { peopleApi } from '@/features/people/api/peopleApi'
import type { CommandPersonItem } from '@/features/command-palette/types/command-palette.types'
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

  const isEnabled = debouncedQuery.trim().length >= 2

  const moviesQuery = useQuery<QuickSearchMovieItem[]>({
    queryKey: ['spotlight', 'movies', debouncedQuery],
    queryFn: () => quickSearchMovies(debouncedQuery),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5
  })

  const peopleQuery = useQuery<CommandPersonItem[]>({
    queryKey: ['spotlight', 'people', debouncedQuery],
    queryFn: () => peopleApi.quickSearchPeople(debouncedQuery),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5
  })

  const isLoading = moviesQuery.isLoading || peopleQuery.isLoading

  return {
    results: moviesQuery.data ?? [],
    personResults: peopleQuery.data ?? [],
    isLoading,
    isDebouncing: query !== debouncedQuery
  }
}
