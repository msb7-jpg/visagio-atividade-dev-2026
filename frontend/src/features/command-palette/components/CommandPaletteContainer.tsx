import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  COMMAND_ACTIONS,
  type CommandMovieItem,
  type CommandPaletteAction
} from '@/features/command-palette/types/command-palette.types'
import { routes } from '@/routes/routes.types'
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
  const { isAuthenticated, logout } = useAuth()

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

  return (
    <CommandPaletteDialogView
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSelectMovie={handleSelectMovie}
      onSelectAction={handleSelectAction}
      isAuthenticated={isAuthenticated}
    />
  )
}
