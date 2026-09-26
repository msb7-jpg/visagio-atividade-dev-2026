import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Film } from 'lucide-react'
import type { GenreDTO } from '@/features/movie-details/types/movie-details.types'
import { formatDuration } from '@/features/movie-details/utils/movie-formatters'

interface MovieHeaderInfoViewProps {
  titulo: string
  anoLancamento: number | null | undefined
  duracaoMinutos: number | null | undefined
  statusFilme: string | null | undefined
  urlPoster: string | null | undefined
  generos: GenreDTO[]
  onBack?: () => void
  children?: React.ReactNode
}

export function MovieHeaderInfoView({
  titulo,
  anoLancamento,
  duracaoMinutos,
  statusFilme,
  urlPoster,
  generos,
  onBack,
  children
}: MovieHeaderInfoViewProps) {
  return (
    <div className="flex flex-col items-start gap-6 md:flex-row md:gap-8">
      {/* Pôster ampliado com cantos arredondados e sombra volumétrica */}
      <div className="relative aspect-2/3 w-48 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl sm:w-56 md:w-64 lg:w-72">
        {urlPoster ? (
          <img
            src={urlPoster}
            alt={`Pôster de ${titulo}`}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center bg-secondary/30 text-muted-foreground">
            <Film className="mb-2 size-12 stroke-1 opacity-50" />
            <span className="text-xs">Sem pôster</span>
          </div>
        )}
      </div>

      {/* Coluna descritiva e dados integrados */}
      <div className="flex flex-1 flex-col justify-start">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-2 -ml-2 w-fit"
          >
            ← Voltar ao catálogo
          </Button>
        )}

        <div className="mb-2 flex flex-wrap items-center gap-2">
          {statusFilme && (
            <Badge variant="outline">
              {statusFilme}
            </Badge>
          )}
          {anoLancamento && (
            <span className="inline-flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 size-3.5 opacity-70" />
              {anoLancamento}
            </span>
          )}
          {duracaoMinutos && (
            <span className="inline-flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 size-3.5 opacity-70" />
              {formatDuration(duracaoMinutos)}
            </span>
          )}
        </div>

        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {titulo}
        </h1>

        {/* Badges de gêneros estilo glass capsule discreto */}
        {generos.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {generos.map((g) => (
              <Badge
                key={g.sk_genre_id}
                variant="glass"
                size="md"
              >
                {g.nome_genero}
              </Badge>
            ))}
          </div>
        )}

        {/* Ratings e Métricas integrados ao Hero */}
        {children}
      </div>
    </div>
  )
}
