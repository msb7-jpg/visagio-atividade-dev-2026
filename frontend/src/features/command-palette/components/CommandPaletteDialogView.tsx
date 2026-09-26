import React, { useState } from 'react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty
} from '@/components/ui/command'
import { CommandResultsGroupView } from './CommandResultsGroupView'
import { useSpotlightSearch } from '@/features/command-palette/hooks/useSpotlightSearch'
import type {
  CommandMovieItem,
  CommandPaletteAction
} from '@/features/command-palette/types/command-palette.types'
import { Kbd } from '@/components/ui/kbd'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'

interface CommandPaletteDialogViewProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSelectMovie: (movie: CommandMovieItem) => void
  onSelectAction: (action: CommandPaletteAction) => void
  isAuthenticated?: boolean
}

export const CommandPaletteDialogView: React.FC<CommandPaletteDialogViewProps> = ({
  isOpen,
  onOpenChange,
  onSelectMovie,
  onSelectAction,
  isAuthenticated = false
}) => {
  const [query, setQuery] = useState('')
  const { results, isLoading, isDebouncing } = useSpotlightSearch(query)

  const handleSelectMovie = (movie: CommandMovieItem) => {
    onOpenChange(false)
    onSelectMovie(movie)
  }

  const handleSelectAction = (action: CommandPaletteAction) => {
    onOpenChange(false)
    onSelectAction(action)
  }

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      className="w-[95vw] sm:max-w-2xl"
    >
      <div className="relative">
        <CommandInput
          placeholder="Busque filmes pelo título ou navegue por atalhos..."
          value={query}
          onValueChange={setQuery}
        />
        {(isLoading || isDebouncing) && (
          <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
      </div>

      <CommandList>
        <CommandEmpty>
          {query.trim().length < 2
            ? 'Digite pelo menos 2 caracteres para pesquisar filmes...'
            : 'Nenhum filme ou atalho encontrado.'}
        </CommandEmpty>

        <CommandResultsGroupView
          movies={results}
          query={query}
          isAuthenticated={isAuthenticated}
          onSelectMovie={handleSelectMovie}
          onSelectAction={handleSelectAction}
        />
      </CommandList>

      <Separator variant="cinema" />

      <div className="flex items-center justify-between bg-white/2 px-4 py-2.5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Kbd variant="cinema">
              ↑↓
            </Kbd>
            <span>Navegar</span>
          </span>
          <span className="flex items-center gap-1">
            <Kbd variant="cinema">
              ↵
            </Kbd>
            <span>Selecionar</span>
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Kbd variant="cinema">
            ESC
          </Kbd>
          <span>Fechar</span>
        </span>
      </div>
    </CommandDialog>
  )
}
