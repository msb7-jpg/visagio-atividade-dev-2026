import { useAuth } from '@/features/auth/hooks/useAuth'
import { useGenresQuery } from '@/features/catalog/hooks/useMoviesQuery'
import {
  COMMAND_ACTIONS,
  type CommandGenreItem,
  type CommandMovieItem,
  type CommandPaletteAction
} from '@/features/command-palette/types/command-palette.types'
import { routes } from '@/routes/routes.types'
import React, { useMemo } from 'react'
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
  const { isAuthenticated, logout } = useAuth()
  const { data: genresData } = useGenresQuery()

  const availableGenres = useMemo(() => {
    if (genresData && genresData.length > 0)
      return genresData.map(genre => genre.nome_genero)

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

  const handleSelectMovie = (movie: CommandMovieItem) => {
    onOpenChange(false)
    navigate(routes.movieDetail(movie.sk_movie_id))
  }

  const handleSelectAction = (action: CommandPaletteAction) => {
    onOpenChange(false)
    if (action === COMMAND_ACTIONS.LOGOUT) {
      logout()
    } else {
      navigate(action)
    }
  }

  const handleSelectGenre = (genre: CommandGenreItem) => {
    onOpenChange(false)
    navigate(routes.catalogGenre(genre))
  }

  return (
    <CommandPaletteDialogView
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSelectMovie={handleSelectMovie}
      onSelectAction={handleSelectAction}
      onSelectGenre={handleSelectGenre}
      genres={availableGenres}
      isAuthenticated={isAuthenticated}
    />
  )
}
