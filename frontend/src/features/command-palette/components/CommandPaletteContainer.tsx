import type { QuickSearchMovieItem } from '@/features/command-palette/api/spotlightApi'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CommandPaletteDialogView } from './CommandPaletteDialogView'
import { useGenresQuery } from '@/features/catalog/hooks/useMoviesQuery'

interface CommandPaletteContainerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const CommandPaletteContainer: React.FC<CommandPaletteContainerProps> = ({
  isOpen,
  onOpenChange
}) => {
  const navigate = useNavigate()
  const { data: genresData } = useGenresQuery()

  const availableGenres = useMemo(() => {
    if (genresData && genresData.length > 0) {
      return genresData.map((g) => g.nome_genero)
    }
    return [
      'Action',
      'Comedy',
      'Drama',
      'Science Fiction',
      'Horror',
      'Animation',
      'Adventure',
      'Thriller'
    ]
  }, [genresData])

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
      genres={availableGenres}
    />
  )
}
