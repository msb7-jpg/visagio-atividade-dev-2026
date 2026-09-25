import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchVisibility } from '@/context/useSearchVisibility'
import { cn } from '@/lib/utils'
import { Loader2, Search, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface CatalogHeroViewProps {
  initialSearch: string
  onSearchChange: (value: string) => void
  onOpenCommandPalette: () => void
  isFetching?: boolean
}

export const CatalogHeroView: React.FC<CatalogHeroViewProps> = ({
  initialSearch,
  onSearchChange,
  onOpenCommandPalette,
  isFetching = false
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [prevInitial, setPrevInitial] = useState(initialSearch)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const {
    setIsHeroSearchVisible,
    setSearchQuery,
    setIsFetching: setContextFetching,
    setOnClearSearch
  } = useSearchVisibility()

  // Sincroniza estado se initialSearch mudar externamente (ex: url params)
  if (initialSearch !== prevInitial) {
    setPrevInitial(initialSearch)
    setSearchTerm(initialSearch)
    setSearchQuery(initialSearch)
  }

  // Sincroniza isFetching do TanStack Query com o contexto compartilhado
  useEffect(() => {
    setContextFetching(isFetching)
  }, [isFetching, setContextFetching])

  useEffect(() => {
    if (searchTerm === initialSearch) return
    const handler = setTimeout(() => {
      onSearchChange(searchTerm)
    }, 350)
    return () => clearTimeout(handler)
  }, [searchTerm, initialSearch, onSearchChange])

  // Observa a visibilidade da barra de busca do Hero para alternar com a da Navbar
  useEffect(() => {
    const el = searchContainerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroSearchVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '-64px 0px 0px 0px'
      }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      setIsHeroSearchVisible(false)
    }
  }, [setIsHeroSearchVisible])

  const handleClear = React.useCallback(() => {
    setSearchTerm('')
    setSearchQuery('')
    onSearchChange('')
  }, [onSearchChange, setSearchQuery])

  useEffect(() => {
    setOnClearSearch(handleClear)
    return () => setOnClearSearch(undefined)
  }, [handleClear, setOnClearSearch])

  // O loading visual só inicia quando o TanStack indicar que iniciou a consulta (isFetching)
  const isSearching = Boolean(isFetching)

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-radial from-primary/10 via-background to-background px-4 pt-12 pb-16 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Título de Impacto */}
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          Explore o Universo <span className="text-primary">Cinematográfico</span>
        </h1>

        <p className="mb-8 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Pesquise por títulos, diretores, elenco e navegue por dados analíticos completos
          de bilheteria, popularidade e avaliações do público.
        </p>

        {/* Barra de Pesquisa de Impacto com Debounce, Indicador Vivo e Trigger ⌘K */}
        <div
          ref={searchContainerRef}
          className={cn(
            'group relative flex w-full max-w-2xl items-center rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300',
            isSearching
              ? 'shadow-[0_0_30px_rgba(234,179,8,0.2)] ring-2 ring-primary/40'
              : 'hover:border-white/30'
          )}
        >
          {isSearching ? (
            <Loader2 className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 animate-spin text-primary transition-colors" />
          ) : (
            <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          )}

          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setSearchQuery(e.target.value)
            }}
            placeholder="Digite o título do filme, diretor ou ator..."
            className="w-full rounded-xl border-white/20 bg-black/60 py-6 pr-24 pl-12 text-base transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary"
          />

          <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-8 w-8 text-muted-foreground hover:text-white"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenCommandPalette}
              className="hidden h-8 items-center gap-1 border-white/10 bg-white/5 px-2 font-mono text-xs text-white/80 hover:bg-white/10 sm:flex"
            >
              <span>⌘K</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
