import { useAuth } from '@/features/auth/hooks/useAuth'
import { CatalogControlBar } from '@/features/catalog/components/CatalogControlBar'
import { CatalogPaginationView } from '@/features/catalog/components/CatalogPaginationView'
import { MovieListView } from '@/features/catalog/components/MovieListView'
import { useCatalogParams } from '@/features/catalog/hooks/useCatalogParams'
import { useAvailableYearsQuery, useGenresQuery } from '@/features/catalog/hooks/useMoviesQuery'
import { PersonHeroHeaderView } from '@/features/people/components/PersonHeroHeaderView'
import {
  usePersonFilmographyQuery,
  usePersonProfileQuery
} from '@/features/people/hooks/usePersonQuery'
import { useUserLibrary } from '@/features/user-library/hooks/useUserLibrary'
import { ArrowLeft, Loader2 } from 'lucide-react'
import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

export const PersonDetailsContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const { isFavorite, inWatchlist } = useUserLibrary()

  const catalogParams = useCatalogParams()

  // Queries
  const {
    data: person,
    isLoading: isLoadingProfile,
    isError: isErrorProfile
  } = usePersonProfileQuery(id)

  const {
    data: filmographyData,
    isLoading: isLoadingMovies,
    isFetching: isFetchingMovies,
    isError: isErrorMovies
  } = usePersonFilmographyQuery(id, {
    page: catalogParams.page,
    page_size: 24,
    q: catalogParams.q,
    genre: catalogParams.genre,
    year: catalogParams.year,
    sort_by: catalogParams.sortBy,
    order: catalogParams.sortOrder
  })

  const { data: genresData } = useGenresQuery()
  const { data: availableYearsData } = useAvailableYearsQuery()

  const movies = useMemo(() => filmographyData?.items ?? [], [filmographyData])
  const total = filmographyData?.total ?? 0
  const totalPages = filmographyData?.total_pages ?? 1

  // Cálculo de filmes assistidos / na biblioteca da pessoa
  const watchedCount = useMemo(() => {
    if (!movies || movies.length === 0) return 0
    return movies.filter((m) => isFavorite(m.sk_movie_id) || inWatchlist(m.sk_movie_id)).length
  }, [movies, isFavorite, inWatchlist])

  const hasFilters = Boolean(
    catalogParams.q ||
      catalogParams.genre ||
      catalogParams.year ||
      catalogParams.sortBy !== 'popularidade'
  )

  const catalogRef = React.useRef<HTMLDivElement>(null)

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      catalogParams.setPage(newPage)
      if (catalogRef.current) {
        const navHeight = 70
        const elementPosition = catalogRef.current.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - navHeight

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        })
      }
    },
    [catalogParams]
  )

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando perfil e filmografia...</p>
      </div>
    )
  }

  if (isErrorProfile || !person) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-bold text-foreground">Pessoa não encontrada</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          O perfil solicitado não pôde ser localizado ou foi removido do catálogo.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10 hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Voltar ao Catálogo
        </Link>
      </div>
    )
  }

  return (
    <div
      ref={catalogRef}
      className="container mx-auto flex flex-1 flex-col px-4 py-6 sm:px-6 space-y-8"
    >
      {/* Botão de retorno sutil */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Voltar ao Catálogo
        </Link>
      </div>

      {/* Header em Evidência com Avatar e Progresso */}
      <PersonHeroHeaderView
        person={person}
        watchedCount={watchedCount}
        totalInCatalog={person.total_filmes}
        isAuthenticated={isAuthenticated}
      />

      {/* Barra de Controles e Filtros Reutilizada da Home */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Filmografia Relacionada
          </h2>
        </div>

        <CatalogControlBar
          genres={genresData ?? []}
          selectedGenre={catalogParams.genre}
          onSelectGenre={catalogParams.setGenre}
          availableYears={availableYearsData ?? []}
          selectedYear={catalogParams.year}
          onSelectYear={catalogParams.setYear}
          sortBy={catalogParams.sortBy}
          sortOrder={catalogParams.sortOrder}
          onSelectSortBy={catalogParams.setSortBy}
          onToggleSort={catalogParams.toggleSort}
          viewMode={catalogParams.viewMode}
          onChangeViewMode={catalogParams.setViewMode}
          totalCount={total}
        />
      </div>

      {/* Lista de Filmes (Grid ou Linhas) */}
      <div className="flex-1">
        <MovieListView
          movies={movies}
          viewMode={catalogParams.viewMode}
          isLoading={isLoadingMovies}
          isFetching={isFetchingMovies}
          isError={isErrorMovies}
          hasFilters={hasFilters}
        />
      </div>

      {/* Paginação */}
      <CatalogPaginationView
        currentPage={catalogParams.page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
