import type { QuickSearchMovieItem } from '@/features/command-palette/api/spotlightApi'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CommandPaletteDialogView } from './CommandPaletteDialogView'

interface CommandPaletteContainerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const CommandPaletteContainer: React.FC<CommandPaletteContainerProps> = ({
  isOpen,
  onOpenChange
}) => {
  const navigate = useNavigate()

  const handleSelectMovie = (movie: QuickSearchMovieItem) => {
    navigate(`/filmes/${movie.sk_movie_id}`)
  }

  const handleSelectAction = (path: string) => {
    navigate(path)
  }

  const handleSelectGenre = (genre: string) => {
    navigate(`/?genre=${encodeURIComponent(genre)}`)
  }

  return (
    <CommandPaletteDialogView
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSelectMovie={handleSelectMovie}
      onSelectAction={handleSelectAction}
      onSelectGenre={handleSelectGenre}
    />
  )
}
