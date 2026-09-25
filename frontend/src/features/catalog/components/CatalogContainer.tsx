import React from 'react'
import { CatalogHeroView } from './CatalogHeroView'
import { CatalogControlBar } from './CatalogControlBar'
import { MovieListView } from './MovieListView'
import { CatalogPaginationView } from './CatalogPaginationView'
import { useCatalogViewModel } from '@/features/catalog/hooks/useCatalogViewModel'
import { useCommandPalette } from '@/features/command-palette/hooks/useCommandPalette'

export const CatalogContainer: React.FC = () => {
  const vm = useCatalogViewModel()
  const { open: openCommandPalette } = useCommandPalette()

  return (
    <div className="flex min-h-screen flex-col">
      <CatalogHeroView
        initialSearch={vm.q}
        onSearchChange={vm.setQ}
        onOpenCommandPalette={openCommandPalette}
      />

      <div className="container mx-auto flex flex-1 flex-col px-4 py-6 sm:px-6">
        <CatalogControlBar
          genres={vm.genres}
          selectedGenre={vm.genre}
          onSelectGenre={vm.setGenre}
          sortBy={vm.sortBy}
          onSelectSortBy={vm.setSortBy}
          viewMode={vm.viewMode}
          onChangeViewMode={vm.setViewMode}
          totalCount={vm.total}
        />

        <div className="mt-6 flex-1">
          <MovieListView
            movies={vm.movies}
            viewMode={vm.viewMode}
            isLoading={vm.isLoading}
            isError={vm.isError}
            hasFilters={Boolean(vm.q || vm.genre)}
          />
        </div>

        <CatalogPaginationView
          currentPage={vm.page}
          totalPages={vm.totalPages}
          onPageChange={vm.setPage}
        />
      </div>
    </div>
  )
}
