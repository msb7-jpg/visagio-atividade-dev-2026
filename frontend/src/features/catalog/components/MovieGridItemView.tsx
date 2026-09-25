import React from 'react'
import { Link } from 'react-router-dom'
import { Film, Star, Flame } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { MovieListItem } from '@/features/catalog/api/catalogApi'

interface MovieGridItemViewProps {
  movie: MovieListItem
}

export const MovieGridItemView: React.FC<MovieGridItemViewProps> = ({ movie }) => {
  return (
    <Link
      to={`/filmes/${movie.sk_movie_id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-card shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
    >
      {/* Container de Imagem Poster com Proporção 2:3 */}
      <div className="relative aspect-2/3 w-full overflow-hidden bg-white/5">
        {movie.url_poster ? (
          <img
            src={movie.url_poster}
            alt={movie.titulo}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-muted-foreground">
            <Film className="mb-2 h-10 w-10 opacity-30" />
            <span className="text-center text-xs font-medium">Sem pôster</span>
          </div>
        )}

        {/* Gradiente sutil para legibilidade dos badges */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/60" />

        {/* Badge superior esquerdo: Nota dos usuários */}
        {movie.nota_media_usuarios !== null ? (
          <Badge
            variant="outline"
            className="absolute top-2.5 left-2.5 gap-1 border-white/10 bg-black/60 px-2 py-0.5 text-xs font-semibold text-primary shadow-xs backdrop-blur-md"
          >
            <Star className="size-3 fill-primary text-primary" />
            <span>{movie.nota_media_usuarios.toFixed(1)}</span>
          </Badge>
        ) : null}

        {/* Badge superior direito: Popularidade */}
        {movie.popularidade > 0 && (
          <Badge
            variant="outline"
            className="absolute top-2.5 right-2.5 gap-1 border-white/10 bg-black/60 px-2 py-0.5 text-xs font-semibold text-primary shadow-xs backdrop-blur-md"
          >
            <Flame className="size-3 text-primary" />
            <span>{movie.popularidade.toFixed(0)}</span>
          </Badge>
        )}

        {/* Informações na base do pôster */}
        <div className="absolute right-2.5 bottom-2.5 left-2.5 flex flex-wrap gap-1">
          {movie.generos.slice(0, 2).map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="border border-white/10 bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-md"
            >
              {genre}
            </Badge>
          ))}
        </div>
      </div>

      {/* Conteúdo Textual do Card */}
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {movie.titulo}
        </h3>

        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{movie.ano_lancamento || 'Ano N/D'}</span>
          {movie.duracao_minutos && <span>{movie.duracao_minutos} min</span>}
        </div>

        {movie.diretores.length > 0 && (
          <p className="mt-1.5 truncate text-[11px] text-muted-foreground">
            Dir: <span className="text-white/70">{movie.diretores.join(', ')}</span>
          </p>
        )}
      </div>
    </Link>
  )
}
