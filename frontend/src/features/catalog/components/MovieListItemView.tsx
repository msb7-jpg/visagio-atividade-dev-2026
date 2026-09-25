import React from 'react'
import { Link } from 'react-router-dom'
import { Star, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { BlurImage } from '@/components/ui/blur-image'
import type { MovieListItem } from '@/features/catalog/api/catalogApi'

interface MovieListItemViewProps {
  movie: MovieListItem
}

export const MovieListItemView: React.FC<MovieListItemViewProps> = ({ movie }) => {
  return (
    <Link
      to={`/filmes/${movie.sk_movie_id}`}
      className="group flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-card p-3 transition-all hover:border-white/15 hover:bg-white/[0.03]"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {/* Mini Pôster */}
        <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/5">
          <BlurImage
            src={movie.url_poster}
            alt={movie.titulo}
            className="group-hover:scale-105"
          />
        </div>

        {/* Informações Centrais */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:text-base">
              {movie.titulo}
            </h3>
            {movie.ano_lancamento && (
              <span className="shrink-0 text-xs text-muted-foreground">
                ({movie.ano_lancamento})
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {movie.diretores.length > 0 && (
              <span>Dir: <span className="text-white/80">{movie.diretores[0]}</span></span>
            )}
            {movie.duracao_minutos && (
              <>
                <span>•</span>
                <span>{movie.duracao_minutos} min</span>
              </>
            )}
            {movie.generos.length > 0 && (
              <>
                <span>•</span>
                <span className="text-white/60">{movie.generos.slice(0, 3).join(', ')}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Indicadores de Notas & Ação */}
      <div className="flex shrink-0 items-center gap-4">
        {movie.nota_media_usuarios !== null ? (
          <Badge
            variant="star"
            size="md"
            className="gap-1.5"
          >
            <Star className="size-3.5 fill-primary text-primary" />
            <span>{movie.nota_media_usuarios.toFixed(1)}</span>
            <span className="hidden text-[10px] text-muted-foreground sm:inline">
              ({movie.qtd_avaliacoes_usuarios})
            </span>
          </Badge>
        ) : (
          <span className="hidden text-xs text-muted-foreground sm:inline">Sem notas</span>
        )}

        <div className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors group-hover:bg-white/10 group-hover:text-primary">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  )
}
