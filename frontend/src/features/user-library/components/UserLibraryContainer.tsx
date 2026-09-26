import { Button } from '@/components/ui/button'
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton'
import type { MovieListItem } from '@/features/catalog/api/catalogApi'
import { MovieGridItemView } from '@/features/catalog/components/MovieGridItemView'
import {
  useUserLibrary,
  useUserLibraryMoviesQuery
} from '@/features/user-library/hooks/useUserLibrary'
import type { UserLibraryMovieItemDTO } from '@/features/user-library/types/user-library.types'
import { AnimatePresence, motion } from 'framer-motion'
import { Bookmark, Film, Heart } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

function toMovieListItem(item: UserLibraryMovieItemDTO): MovieListItem {
  return {
    sk_movie_id: item.sk_movie_id,
    id_filme: item.id_filme,
    titulo: item.titulo,
    ano_lancamento: item.ano_lancamento,
    duracao_minutos: item.duracao_minutos,
    sinopse: null,
    url_poster: item.url_poster,
    url_backdrop: item.url_backdrop,
    generos: item.generos,
    diretores: item.diretores,
    produtoras: [],
    popularidade: 0,
    nota_media_usuarios: item.nota_media_usuarios,
    qtd_avaliacoes_usuarios: item.qtd_avaliacoes_usuarios,
    nota_tmdb: null,
    nota_imdb: null,
    receita_usd: null,
    receita_brl: null
  }
}

const SKELETON_PLACEHOLDERS = Array.from({ length: 12 }, (_, i) => `sk-library-${i}`)

export function UserLibraryContainer() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = (searchParams.get('tab') as 'favorites' | 'watchlist') || 'favorites'
  const currentPage = Number(searchParams.get('page')) || 1

  const { totalFavorites, totalWatchlist } = useUserLibrary()
  const { data, isLoading, isPlaceholderData } = useUserLibraryMoviesQuery(
    currentTab,
    currentPage,
    24
  )

  const handleTabChange = (newTab: 'favorites' | 'watchlist') => {
    setSearchParams({ tab: newTab, page: '1' })
  }

  const handlePageChange = (newPage: number) => {
    setSearchParams({ tab: currentTab, page: String(newPage) })
  }

  const movies = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = data?.total_pages ?? 1

  return (
    <div className="mx-auto min-h-[calc(100vh-140px)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Cabeçalho Editorial com Contenção de Contraste e Layout Fixo */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Minha Biblioteca
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie seus filmes favoritos e lista para assistir em um ambiente cinematográfico.
          </p>
        </div>

        {/* Alternador de Abas Estilo Pílula com Largura e Posicionamento Estável */}
        <div className="flex shrink-0 items-center gap-1.5 self-start rounded-full border border-white/10 bg-white/5 p-1 sm:self-auto">
          <Button
            type="button"
            variant={currentTab === 'favorites' ? 'pill-active' : 'pill'}
            size="pill"
            onClick={() => handleTabChange('favorites')}
            aria-label="Ver filmes favoritos"
            className="min-w-32.5 justify-center"
          >
            <Heart className="size-3.5" />
            <span>Favoritos</span>
            <span className="tabular-nums opacity-70">({totalFavorites})</span>
          </Button>

          <Button
            type="button"
            variant={currentTab === 'watchlist' ? 'pill-active' : 'pill'}
            size="pill"
            onClick={() => handleTabChange('watchlist')}
            aria-label="Ver filmes na watchlist"
            className="min-w-32.5 justify-center"
          >
            <Bookmark className="size-3.5" />
            <span>Watchlist</span>
            <span className="tabular-nums opacity-70">({totalWatchlist})</span>
          </Button>
        </div>
      </header>

      {/* Conteúdo com Transição Suave via AnimatePresence */}
      <div className="min-h-105">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading-skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            >
              {SKELETON_PLACEHOLDERS.map((key) => (
                <div key={key} className="flex flex-col gap-2">
                  <LoadingSkeleton className="aspect-2/3 w-full rounded-xl" />
                  <LoadingSkeleton className="h-4 w-3/4 rounded" />
                  <LoadingSkeleton className="h-3 w-1/2 rounded" />
                </div>
              ))}
            </motion.div>
          ) : movies.length > 0 ? (
            <motion.div
              key={`tab-content-${currentTab}-${currentPage}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {movies.map((item) => (
                  <MovieGridItemView key={item.sk_movie_id} movie={toMovieListItem(item)} />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <footer className="mt-12 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs text-muted-foreground">
                    Página {currentPage} de {totalPages} ({total} filmes)
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1 || isPlaceholderData}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Anterior
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages || isPlaceholderData}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Próxima
                    </Button>
                  </div>
                </footer>
              )}
            </motion.div>
          ) : (
            /* Empty State Cinematográfico Convidativo com transição suave */
            <motion.div
              key={`empty-${currentTab}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/2 px-6 py-20 text-center"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-white/5 text-muted-foreground">
                {currentTab === 'favorites' ? (
                  <Heart className="size-6 text-primary" />
                ) : (
                  <Bookmark className="size-6 text-primary" />
                )}
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {currentTab === 'favorites'
                  ? 'Nenhum filme favoritado ainda'
                  : 'Sua watchlist está vazia'}
              </h2>
              <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                {currentTab === 'favorites'
                  ? 'Explore o catálogo e clique no coração nos cards ou ficha técnica para guardar seus filmes preferidos.'
                  : 'Navegue pelo catálogo e adicione filmes para assistir futuramente com um clique no marcador de watchlist.'}
              </p>
              <Button asChild variant="default" size="sm" className="mt-6">
                <Link to="/">
                  <Film className="size-4" />
                  <span>Explorar Catálogo</span>
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
