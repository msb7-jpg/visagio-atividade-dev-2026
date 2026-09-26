import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Flame } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { BlurImage } from '@/components/ui/blur-image'
import type { MovieListItem } from '@/features/catalog/api/catalogApi'

interface MovieGridItemViewProps {
  movie: MovieListItem
}

export const MovieGridItemView: React.FC<MovieGridItemViewProps> = ({ movie }) => {
  return (
    <Link
      to={`/filmes/${movie.sk_movie_id}`}
      className="group relative flex transform-[translateZ(0)] flex-col overflow-hidden rounded-xl border border-white/10 bg-card shadow-md transition-all duration-300 backface-hidden hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
    >
      {/* Container de Imagem Poster com Proporção 2:3 */}
      <div className="relative -mb-px aspect-2/3 w-full transform-[translateZ(0)] overflow-hidden bg-card backface-hidden">
        <BlurImage
          src={movie.url_poster}
          alt={movie.titulo}
          className="group-hover:scale-105"
        />

        {/* Gradiente sutil para legibilidade dos badges */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/60" />

        {/* Linha de vedação da costura para impedir qualquer sub-pixel bleed */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-card" />

        {/* Badge superior esquerdo: Nota dos usuários */}
        {movie.nota_media_usuarios !== null ? (
          <Badge
            variant="star"
            className="absolute top-2.5 left-2.5 gap-1"
          >
            <Star className="size-3 fill-primary text-primary" />
            <span>{movie.nota_media_usuarios.toFixed(1)}</span>
          </Badge>
        ) : null}

        {/* Badge superior direito: Popularidade */}
        {movie.popularidade > 0 && (
          <Badge
            variant="star"
            className="absolute top-2.5 right-2.5 gap-1"
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
              variant="glass"
              size="sm"
            >
              {genre}
            </Badge>
          ))}
        </div>
      </div>

      {/* Conteúdo Textual do Card */}
      <div className="relative z-10 flex flex-1 flex-col bg-card p-3.5">
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
