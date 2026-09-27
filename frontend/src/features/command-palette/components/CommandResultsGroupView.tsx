import { Badge } from '@/components/ui/badge'
import { BlurImage } from '@/components/ui/blur-image'
import {
  CommandGroup,
  CommandItem,
  CommandSeparator
} from '@/components/ui/command'
import {
  type CommandMovieItem,
  type CommandPaletteAction,
  type CommandPersonItem
} from '@/features/command-palette/types/command-palette.types'
import { routes } from '@/routes/routes.types'
import { ArrowRight, Bookmark, Compass, Film, Heart, LogIn, LogOut, Plus, User } from 'lucide-react'
import React from 'react'

interface CommandResultsGroupViewProps {
  movies: CommandMovieItem[]
  people?: CommandPersonItem[]
  query?: string
  onSelectMovie: (movie: CommandMovieItem) => void
  onSelectPerson?: (person: CommandPersonItem) => void
  onSelectAction: (action: CommandPaletteAction) => void
  isAuthenticated?: boolean
}

export const CommandResultsGroupView: React.FC<CommandResultsGroupViewProps> = ({
  movies,
  people = [],
  query: _query,
  onSelectMovie,
  onSelectPerson,
  onSelectAction,
  isAuthenticated = false
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

      {people.length > 0 && (
        <>
          {movies.length > 0 && <CommandSeparator variant="cinema" />}
          <CommandGroup heading="Pessoas Encontradas">
            {people.map((person) => (
              <CommandItem
                key={person.sk_person_id}
                value={`person-${person.nome_pessoa}-${person.tipo_pessoa}`}
                onSelect={() => onSelectPerson?.(person)}
                variant="cinema"
                className="cursor-pointer"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary">
                  <User className="size-4" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                      {person.nome_pessoa}
                    </span>
                    {person.papeis && person.papeis.length > 0 ? (
                      person.papeis.map((papel) => (
                        <Badge
                          key={papel}
                          variant="glass"
                          size="sm"
                        >
                          {papel}
                        </Badge>
                      ))
                    ) : (
                      <Badge
                        variant="glass"
                        size="sm"
                      >
                        {person.tipo_pessoa}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Film className="size-3 opacity-70" />
                    <span>{person.total_filmes} {person.total_filmes === 1 ? 'obra' : 'obras'} no catálogo</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-white/30 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </CommandItem>
            ))}
          </CommandGroup>
        </>
      )}

      {(movies.length > 0 || people.length > 0) && <CommandSeparator variant="cinema" />}

      <CommandGroup heading="Navegação & Ações Rápidas">
        <CommandItem
          value="action-home"
          onSelect={() => onSelectAction(routes.home())}
          variant="cinema"
          className="cursor-pointer"
        >
          <Compass className="h-4 w-4" />
          <span>Explorar Catálogo Completo</span>
        </CommandItem>
        {isAuthenticated ? (
          <>
            <CommandItem
              value="action-my-favorites"
              onSelect={() => onSelectAction(routes.userLibrary('favorites'))}
              variant="cinema"
              className="cursor-pointer"
            >
              <Heart className="h-4 w-4" />
              <span>Minha Biblioteca: Favoritos</span>
            </CommandItem>
            <CommandItem
              value="action-my-watchlist"
              onSelect={() => onSelectAction(routes.userLibrary('watchlist'))}
              variant="cinema"
              className="cursor-pointer"
            >
              <Bookmark className="h-4 w-4" />
              <span>Minha Biblioteca: Watchlist</span>
            </CommandItem>
            <CommandItem
              value="action-create-movie"
              onSelect={() => onSelectAction(routes.adminMovieCreate())}
              variant="cinema"
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Cadastrar Filme</span>
            </CommandItem>
            <CommandItem
              value="action-logout"
              onSelect={() => onSelectAction('logout')}
              variant="cinema"
              className="cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </CommandItem>
          </>
        ) : (
          <CommandItem
            value="action-login"
            onSelect={() => onSelectAction(routes.login())}
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
