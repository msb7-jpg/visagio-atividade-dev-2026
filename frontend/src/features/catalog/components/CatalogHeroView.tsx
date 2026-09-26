import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WavyBackground } from '@/components/ui/wavy-background'
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

export const CatalogHeroView: React.FC<CatalogHeroViewProps> = React.memo(({
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
    setOnClearSearch,
    setOnSearchChange
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

  useEffect(() => {
    setOnSearchChange(onSearchChange)
    return () => setOnSearchChange(undefined)
  }, [onSearchChange, setOnSearchChange])

  // O loading visual só inicia quando o TanStack indicar que iniciou a consulta (isFetching)
  const isSearching = Boolean(isFetching)

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-background/30 px-4 py-12 pb-16 backdrop-blur-xs sm:px-6">
      {/* Efeito Aceternity WavyBackground com as cores Dark Cinema (Âmbar e Violeta) */}
      <WavyBackground
        className="mx-auto flex max-w-4xl flex-col items-center text-center"
        waveOpacity={0.4}
        speed="slow"
        waveWidth={45}
        blur={14}
        backgroundFill="transparent"
      >
        <div className="pointer-events-none absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Título de Impacto */}
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-5xl md:text-6xl">
            Explore o Universo <span className="text-primary drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]">Cinematográfico</span>
          </h1>

          <p className="mb-8 max-w-2xl text-sm text-white/80 drop-shadow-sm sm:text-base">
            Pesquise por títulos, diretores, elenco e navegue por dados analíticos completos
            de bilheteria, popularidade e avaliações do público.
          </p>

          {/* Barra de Pesquisa de Impacto com Debounce, Indicador Vivo e Trigger ⌘K */}
          <div
            ref={searchContainerRef}
            className={cn(
              'group relative flex w-full max-w-2xl items-center rounded-xl bg-black/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300',
              isSearching
                ? 'shadow-[0_0_30px_rgba(234,179,8,0.25)] ring-2 ring-primary/40'
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
              variant="hero"
              size="lg"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setSearchQuery(e.target.value)
              }}
              placeholder="Digite o título do filme, diretor ou ator..."
              className="w-full"
            />

            <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  aria-label="Limpar busca"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              <Button
                type="button"
                variant="cmdk"
                size="default"
                onClick={onOpenCommandPalette}
                aria-label="Abrir busca rápida (⌘K)"
                title="Abrir busca rápida (⌘K)"
              >
                <span>⌘K</span>
              </Button>
            </div>
          </div>
        </div>
      </WavyBackground>
    </section>
  )
})
