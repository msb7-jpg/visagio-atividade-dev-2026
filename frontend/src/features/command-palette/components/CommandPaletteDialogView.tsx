import React, { useState } from 'react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty
} from '@/components/ui/command'
import { CommandResultsGroupView } from './CommandResultsGroupView'
import { useSpotlightSearch } from '@/features/command-palette/hooks/useSpotlightSearch'
import type { QuickSearchMovieItem } from '@/features/command-palette/api/spotlightApi'
import { Kbd } from '@/components/ui/kbd'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'

interface CommandPaletteDialogViewProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSelectMovie: (movie: QuickSearchMovieItem) => void
  onSelectAction: (path: string) => void
  onSelectGenre: (genre: string) => void
}

export const CommandPaletteDialogView: React.FC<CommandPaletteDialogViewProps> = ({
  isOpen,
  onOpenChange,
  onSelectMovie,
  onSelectAction,
  onSelectGenre
}) => {
  const [query, setQuery] = useState('')
  const { results, isLoading, isDebouncing } = useSpotlightSearch(query)

  const handleSelectMovie = (movie: QuickSearchMovieItem) => {
    onOpenChange(false)
    onSelectMovie(movie)
  }

  const handleSelectAction = (path: string) => {
    onOpenChange(false)
    onSelectAction(path)
  }

  const handleSelectGenre = (genre: string) => {
    onOpenChange(false)
    onSelectGenre(genre)
  }

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      className="max-w-2xl overflow-hidden border border-white/15 bg-black/90 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
    >
      <div className="relative">
        <CommandInput
          placeholder="Busque por filme, gênero ou ação... (⌘K / Ctrl+K)"
          value={query}
          onValueChange={setQuery}
          className="h-14 text-base"
        />
        {(isLoading || isDebouncing) && (
          <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Buscando...</span>
          </div>
        )}
      </div>

      <CommandList className="max-h-96 scrollbar-thin scrollbar-thumb-white/20 overflow-y-auto p-2">
        <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
          {query.trim().length < 2
            ? 'Digite pelo menos 2 caracteres para pesquisar filmes...'
            : 'Nenhum filme ou atalho encontrado.'}
        </CommandEmpty>

        <CommandResultsGroupView
          movies={results}
          query={query}
          onSelectMovie={handleSelectMovie}
          onSelectAction={handleSelectAction}
          onSelectGenre={handleSelectGenre}
        />
      </CommandList>

      <Separator className="border-white/10" />

      <div className="flex items-center justify-between bg-white/[0.02] px-4 py-2.5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Kbd className="bg-white/10 font-mono text-[10px] text-white">
              ↑↓
            </Kbd>
            <span>Navegar</span>
          </span>
          <span className="flex items-center gap-1">
            <Kbd className="bg-white/10 font-mono text-[10px] text-white">
              ↵
            </Kbd>
            <span>Selecionar</span>
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Kbd className="bg-white/10 font-mono text-[10px] text-white">
            ESC
          </Kbd>
          <span>Fechar</span>
        </span>
      </div>
    </CommandDialog>
  )
}
