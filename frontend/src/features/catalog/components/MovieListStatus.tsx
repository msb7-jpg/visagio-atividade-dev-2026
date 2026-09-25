import React from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { SkeletonList } from './SkeletonList'

interface MovieListStatusProps {
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  hasFilters: boolean
  isGrid: boolean
}

export const MovieListStatus: React.FC<MovieListStatusProps> = ({
  isLoading,
  isError,
  isEmpty,
  hasFilters,
  isGrid
}) => {
  if (isLoading) {
    return <SkeletonList isGrid={isGrid} />
  }

  if (isError) {
    return (
      <EmptyState
        title="Erro ao carregar catálogo"
        description="Não foi possível se comunicar com o servidor. Verifique se o backend está em execução."
      />
    )
  }

  if (isEmpty) {
    return (
      <EmptyState
        title="Nenhum filme encontrado"
        description={
          hasFilters
            ? 'Tente ajustar os filtros ou pesquisar com outros termos.'
            : 'Nenhum filme cadastrado no momento.'
        }
      />
    )
  }

  return null
}
