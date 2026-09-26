import { Badge } from '@/components/ui/badge'
import { Tooltip } from '@/components/ui/tooltip-card'
import { Flame, Star } from 'lucide-react'

interface ScoreComparisonViewProps {
  notaMediaUsuarios: number | null | undefined
  qtdAvaliacoesUsuarios?: number
  notaTmdb: number | null | undefined
  qtdTmdb: number | null | undefined
  notaImdb: number | null | undefined
  qtdImdb: number | null | undefined
  popularidade?: number | null | undefined
}

interface RatingBadgeTooltipProps {
  title: string
  description: string
  children: React.ReactNode
}

function RatingBadgeTooltip({ title, description, children }: RatingBadgeTooltipProps) {
  return (
    <Tooltip
      content={
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      }
    >
      <Badge variant="glass" size="md" className="cursor-help gap-1.5">
        {children}
      </Badge>
    </Tooltip>
  )
}

// fallow-ignore-next-line complexity
export function ScoreComparisonView({
  notaMediaUsuarios,
  qtdAvaliacoesUsuarios = 0,
  notaTmdb,
  qtdTmdb,
  notaImdb,
  qtdImdb,
  popularidade
}: ScoreComparisonViewProps) {
  const hasPopularidade = popularidade !== null && popularidade !== undefined && popularidade > 0

  return (
    <div className="flex flex-wrap items-center gap-2 py-1">
      {/* TMDb Score */}
      <RatingBadgeTooltip
        title="The Movie Database (TMDb)"
        description="Pontuação média baseada nos votos da comunidade global aberta do TMDb."
      >
        <span className="font-semibold tracking-wide text-tmdb">TMDb</span>
        <span className="font-bold text-foreground">
          {notaTmdb !== null && notaTmdb !== undefined ? notaTmdb.toFixed(1) : '—'}
        </span>
        <span className="text-[11px] text-muted-foreground/75">
          {qtdTmdb ? `(${qtdTmdb.toLocaleString('pt-BR')} votos)` : '(sem votos)'}
        </span>
      </RatingBadgeTooltip>

      {/* IMDb Rating */}
      <RatingBadgeTooltip
        title="Internet Movie Database (IMDb)"
        description="Nota ponderada calculada a partir de milhões de avaliações de usuários no IMDb."
      >
        <span className="font-semibold tracking-wide text-primary">IMDb</span>
        <span className="font-bold text-foreground">
          {notaImdb !== null && notaImdb !== undefined ? notaImdb.toFixed(1) : '—'}
        </span>
        <span className="text-[11px] text-muted-foreground/75">
          {qtdImdb ? `(${qtdImdb.toLocaleString('pt-BR')} votos)` : '(sem votos)'}
        </span>
      </RatingBadgeTooltip>

      {/* RocketFilms (Comunidade) */}
      <RatingBadgeTooltip
        title="RocketFilms (Comunidade)"
        description="Média das avaliações feitas pelos próprios usuários e membros da comunidade RocketFilms."
      >
        <Star className="size-3.5 fill-primary text-primary" />
        <span className="font-bold text-foreground">
          {notaMediaUsuarios !== null && notaMediaUsuarios !== undefined
            ? notaMediaUsuarios.toFixed(1)
            : '—'}
        </span>
        <span className="text-[11px] text-muted-foreground/85">
          {qtdAvaliacoesUsuarios} {qtdAvaliacoesUsuarios === 1 ? 'avaliação' : 'avaliações'}
        </span>
      </RatingBadgeTooltip>

      {/* Popularidade */}
      {hasPopularidade && (
        <RatingBadgeTooltip
          title="Índice de Popularidade"
          description="Métrica do engajamento e relevância atual do filme baseada em visualizações e votos."
        >
          <Flame className="size-3.5 fill-trending/20 text-trending" />
          <span className="font-bold text-foreground">
            {popularidade!.toFixed(1)}
          </span>
          <span className="text-[11px] text-muted-foreground/75">
            (popularidade)
          </span>
        </RatingBadgeTooltip>
      )}
    </div>
  )
}
