import {
  CommandGroup,
  CommandItem,
  CommandSeparator
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import type { QuickSearchMovieItem } from '@/features/command-palette/api/spotlightApi'
import { ArrowRight, Compass, Film, LogIn, Sparkles } from 'lucide-react'
import React from 'react'

interface CommandResultsGroupViewProps {
  movies: QuickSearchMovieItem[]
  query?: string
  onSelectMovie: (movie: QuickSearchMovieItem) => void
  onSelectAction: (path: string) => void
  onSelectGenre: (genre: string) => void
}

const POPULAR_GENRES = [
  'Ação',
  'Comédia',
  'Drama',
  'Ficção Científica',
  'Terror',
  'Animação'
]

export const CommandResultsGroupView: React.FC<CommandResultsGroupViewProps> = ({
  movies,
  query: _query,
  onSelectMovie,
  onSelectAction,
  onSelectGenre
}) => {
  return (
    <>
      {movies.length > 0 && (
        <CommandGroup heading="Filmes Encontrados">
          {movies.map((movie) => (
            <CommandItem
              key={movie.sk_movie_id}
              value={`movie-${movie.titulo}-${movie.ano_lancamento}`}
              onSelect={() => onSelectMovie(movie)}
              className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/10"
            >
              <div className="flex h-12 w-8 shrink-0 items-center justify-center overflow-hidden rounded border border-white/10 bg-white/5">
                {movie.url_poster ? (
                  <img
                    src={movie.url_poster}
                    alt={movie.titulo}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Film className="h-4 w-4 text-white/40" />
                )}
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
                      variant="secondary"
                      className="border-0 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/70"
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

      {movies.length > 0 && <CommandSeparator className="my-1 border-white/10" />}

      <CommandGroup heading="Gêneros & Categorias">
        <div className="grid grid-cols-2 gap-1 px-1 py-1">
          {POPULAR_GENRES.map((genre) => (
            <CommandItem
              key={genre}
              value={`genre-${genre}`}
              onSelect={() => onSelectGenre(genre)}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/10"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary/80" />
              <span>{genre}</span>
            </CommandItem>
          ))}
        </div>
      </CommandGroup>

      <CommandSeparator className="my-1 border-white/10" />

      <CommandGroup heading="Navegação & Ações Rápidas">
        <CommandItem
          value="action-home"
          onSelect={() => onSelectAction('/')}
          className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/10"
        >
          <Compass className="h-4 w-4 text-primary" />
          <span>Explorar Catálogo Completo</span>
        </CommandItem>
        <CommandItem
          value="action-login"
          onSelect={() => onSelectAction('/login')}
          className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/10"
        >
          <LogIn className="h-4 w-4 text-primary" />
          <span>Área Administrativa (Login)</span>
        </CommandItem>
      </CommandGroup>
    </>
  )
}
