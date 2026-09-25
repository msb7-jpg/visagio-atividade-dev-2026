import React from 'react'
import type { MovieListItem } from '@/features/catalog/api/catalogApi'
import type { ViewModeOption } from '@/features/catalog/hooks/useCatalogParams'
import { MovieGridList } from './MovieGridList'
import { MovieRowList } from './MovieRowList'
import { MovieListStatus } from './MovieListStatus'
import { shouldShowStatus } from '@/features/catalog/utils/list-status-helper'
import { AnimatePresence, motion } from 'framer-motion'

interface MovieListViewProps {
  movies: MovieListItem[]
  viewMode: ViewModeOption
  isLoading: boolean
  isFetching?: boolean
  isError: boolean
  hasFilters: boolean
}

export const MovieListView: React.FC<MovieListViewProps> = ({
  movies,
  viewMode,
  isLoading,
  isFetching = false,
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

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: isFetching ? 0.75 : 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full"
      >
        {isGrid ? <MovieGridList movies={movies} /> : <MovieRowList movies={movies} />}
      </motion.div>
    </AnimatePresence>
  )
}
