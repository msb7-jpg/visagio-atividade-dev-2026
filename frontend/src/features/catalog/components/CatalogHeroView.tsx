import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Sparkles, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface CatalogHeroViewProps {
  initialSearch: string
  onSearchChange: (value: string) => void
  onOpenCommandPalette: () => void
}

export const CatalogHeroView: React.FC<CatalogHeroViewProps> = ({
  initialSearch,
  onSearchChange,
  onOpenCommandPalette
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchTerm)
    }, 350)
    return () => clearTimeout(handler)
  }, [searchTerm, onSearchChange])

  const handleClear = () => {
    setSearchTerm('')
    onSearchChange('')
  }

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-radial from-primary/10 via-background to-background px-4 pt-12 pb-16 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Badge Cinematográfico */}
        <div className="mb-6 inline-flex animate-in items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-primary shadow-xs duration-500 fade-in slide-in-from-bottom-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Curadoria com mais de 95.000 títulos</span>
        </div>

        {/* Título de Impacto */}
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          Explore o Universo <span className="text-primary">Cinematográfico</span>
        </h1>

        <p className="mb-8 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Pesquise por títulos, diretores, elenco e navegue por dados analíticos completos
          de bilheteria, popularidade e avaliações do público.
        </p>

        {/* Barra de Pesquisa de Impacto com Debounce e Trigger ⌘K */}
        <div className="group relative flex w-full max-w-2xl items-center rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o título do filme, diretor ou ator..."
            className="w-full rounded-xl border-white/20 bg-black/60 py-6 pr-28 pl-12 text-base transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary"
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
