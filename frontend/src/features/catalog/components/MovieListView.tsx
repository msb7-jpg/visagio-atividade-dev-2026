import React from 'react'
import type { MovieListItem } from '@/features/catalog/api/catalogApi'
import type { ViewModeOption } from '@/features/catalog/hooks/useCatalogParams'
import { MovieGridList } from './MovieGridList'
import { MovieRowList } from './MovieRowList'
import { MovieListStatus } from './MovieListStatus'
import { shouldShowStatus } from '@/features/catalog/utils/list-status-helper'

interface MovieListViewProps {
  movies: MovieListItem[]
  viewMode: ViewModeOption
  isLoading: boolean
  isError: boolean
  hasFilters: boolean
}

export const MovieListView: React.FC<MovieListViewProps> = ({
  movies,
  viewMode,
  isLoading,
  isError,
  hasFilters
}) => {
  const isGrid = viewMode === 'grid'
  const isInitialLoading = isLoading && movies.length === 0
  const isEmpty = !isInitialLoading && !isError && movies.length === 0

  if (shouldShowStatus(isLoading, isError, movies.length)) {
    return (
      <MovieListStatus
        isLoading={isInitialLoading}
        isError={isError}
        isEmpty={isEmpty}
        hasFilters={hasFilters}
        isGrid={isGrid}
      />
    )
  }

  return isGrid ? <MovieGridList movies={movies} /> : <MovieRowList movies={movies} />
}
