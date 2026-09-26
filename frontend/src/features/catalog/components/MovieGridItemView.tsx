import { Badge } from '@/components/ui/badge'
import { BlurImage } from '@/components/ui/blur-image'
import type { MovieListItem } from '@/features/catalog/api/catalogApi'
import { MovieQuickActionsMenu } from '@/features/catalog/components/MovieQuickActionsMenu'
import { Star } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

interface MovieGridItemViewProps {
  movie: MovieListItem
}

export const MovieGridItemView: React.FC<MovieGridItemViewProps> = ({ movie }) => {
  return (
    <MovieQuickActionsMenu movie={movie}>
      {({ trigger }) => (
        <div className="group relative flex h-full transform-[translateZ(0)] flex-col overflow-hidden rounded-xl border border-white/10 bg-card shadow-md transition-all duration-300 backface-hidden hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
          {/* Container de Imagem Poster com Proporção 2:3 */}
          <div className="relative -mb-px block aspect-2/3 w-full transform-[translateZ(0)] overflow-hidden bg-card backface-hidden">
            <Link
              to={`/filmes/${movie.sk_movie_id}`}
              className="block size-full"
              aria-label={`Ver detalhes de ${movie.titulo}`}
            >
              <BlurImage
                src={movie.url_poster}
                alt={movie.titulo}
                className="group-hover:scale-105"
              />

              {/* Gradiente sutil para legibilidade dos badges de base */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30" />

              {/* Linha de vedação da costura */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-card" />

              {/* Gêneros na base do pôster */}
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
            </Link>

            {/* Botão de 3 pontinhos na posição original (bottom-right do pôster) */}
            {trigger}
          </div>

          {/* Conteúdo Textual do Card */}
          <Link
            to={`/filmes/${movie.sk_movie_id}`}
            className="relative z-10 flex flex-1 flex-col bg-card p-3.5"
          >
            <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
              {movie.titulo}
            </h3>

            {/* Rodapé com Ano, Duração e Nota dos Usuários Limpa */}
            <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                {
                  movie.ano_lancamento !== null && movie.ano_lancamento !== undefined &&
                    <span>{movie.ano_lancamento}</span>
                }
                {movie.duracao_minutos !== null && movie.duracao_minutos > 0 && (
                  <>
                    <span>·</span>
                    <span>{movie.duracao_minutos} min</span>
                  </>
                )}
              </div>

              {movie.nota_media_usuarios !== null ? (
                <div className="flex items-center gap-1 font-semibold text-primary">
                  <Star className="size-3 fill-primary text-primary" />
                  <span>{movie.nota_media_usuarios.toFixed(1)}</span>
                </div>
              ) : (
                <span className="text-[11px] text-muted-foreground/60">Sem nota</span>
              )}
            </div>

            {movie.diretores.length > 0 && (
              <p className="mt-1.5 truncate text-[11px] text-muted-foreground">
                Dir: <span className="text-white/70">{movie.diretores.join(', ')}</span>
              </p>
            )}
          </Link>
        </div>
      )}
    </MovieQuickActionsMenu>
  )
}
