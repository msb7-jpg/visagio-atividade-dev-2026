import { Badge } from '@/components/ui/badge'
import { BlurImage } from '@/components/ui/blur-image'
import {
  CommandGroup,
  CommandItem,
  CommandSeparator
} from '@/components/ui/command'
import {
  type CommandGenreItem,
  type CommandMovieItem,
  type CommandPaletteAction
} from '@/features/command-palette/types/command-palette.types'
import { ArrowRight, Compass, LogIn, LogOut, Sparkles } from 'lucide-react'
import React from 'react'

interface CommandResultsGroupViewProps {
  movies: CommandMovieItem[]
  query?: string
  onSelectMovie: (movie: CommandMovieItem) => void
  onSelectAction: (action: CommandPaletteAction) => void
  onSelectGenre: (genre: CommandGenreItem) => void
  genres?: CommandGenreItem[]
  isAuthenticated?: boolean
}

const DEFAULT_POPULAR_GENRES = [
  'Action',
  'Comedy',
  'Drama',
  'Science Fiction',
  'Horror',
  'Animation',
  'Adventure',
  'Thriller'
]

export const CommandResultsGroupView: React.FC<CommandResultsGroupViewProps> = ({
  movies,
  query: _query,
  onSelectMovie,
  onSelectAction,
  onSelectGenre,
  genres,
  isAuthenticated = false
}) => {
  const displayedGenres = genres && genres.length > 0 ? genres.slice(0, 8) : DEFAULT_POPULAR_GENRES
  return (
    <>
      {movies.length > 0 && (
        <CommandGroup heading="Filmes Encontrados">
          {movies.map((movie) => (
            <CommandItem
              key={movie.sk_movie_id}
              value={`movie-${movie.titulo}-${movie.ano_lancamento}`}
              onSelect={() => onSelectMovie(movie)}
              variant="cinema"
              className="cursor-pointer"
            >
              <div className="h-12 w-8 shrink-0 overflow-hidden rounded border border-white/10 bg-white/5">
                <BlurImage
                  src={movie.url_poster}
                  alt={movie.titulo}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {movie.titulo}
                  </span>
                  {movie.ano_lancamento && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      ({movie.ano_lancamento})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {movie.nota_media_usuarios !== null && (
                    <span className="font-semibold text-primary">
                      ★ {movie.nota_media_usuarios.toFixed(1)}
                    </span>
                  )}
                  {movie.generos.slice(0, 2).map((g) => (
                    <Badge
                      key={g}
                      variant="tag"
                      size="sm"
                    >
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-white/30 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </CommandItem>
          ))}
        </CommandGroup>
      )}

      {movies.length > 0 && <CommandSeparator variant="cinema" />}

      <CommandGroup heading="Gêneros & Categorias">
        <div className="grid grid-cols-2 gap-2 px-1 py-1.5 sm:grid-cols-4">
          {displayedGenres.map((genre) => (
            <CommandItem
              key={genre}
              value={`genre-${genre}`}
              onSelect={() => onSelectGenre(genre)}
              variant="category"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary/70 transition-transform group-hover:scale-110" />
              <span className="truncate">{genre}</span>
            </CommandItem>
          ))}
        </div>
      </CommandGroup>

      <CommandSeparator variant="cinema" />

      <CommandGroup heading="Navegação & Ações Rápidas">
        <CommandItem
          value="action-home"
          onSelect={() => onSelectAction('/')}
          variant="cinema"
          className="cursor-pointer"
        >
          <Compass className="h-4 w-4" />
          <span>Explorar Catálogo Completo</span>
        </CommandItem>
        {isAuthenticated ? (
          <CommandItem
            value="action-logout"
            onSelect={() => onSelectAction('logout')}
            variant="cinema"
            className="cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </CommandItem>
        ) : (
          <CommandItem
            value="action-login"
            onSelect={() => onSelectAction('/login')}
            variant="cinema"
            className="cursor-pointer"
          >
            <LogIn className="h-4 w-4 text-primary" />
            <span>Área Administrativa (Login)</span>
          </CommandItem>
        )}
      </CommandGroup>
    </>
  )
}
