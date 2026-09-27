import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { PersonDetail } from '@/features/people/types/people.types'
import { Award, CheckCircle2, Clapperboard, Film, PenTool, Star, User } from 'lucide-react'
import React from 'react'

interface PersonHeroHeaderViewProps {
  person: PersonDetail
  watchedCount: number
  totalInCatalog: number
  isAuthenticated: boolean
}

const getRoleIcon = (role: string) => {
  const normalized = role.toLowerCase()
  if (normalized.includes('direto')) return <Clapperboard className="size-3 shrink-0" />
  if (normalized.includes('roteir')) return <PenTool className="size-3 shrink-0" />
  return <User className="size-3 shrink-0" />
}

export const PersonHeroHeaderView: React.FC<PersonHeroHeaderViewProps> = ({
  person,
  watchedCount,
  totalInCatalog,
  isAuthenticated
}) => {
  const percentage =
    totalInCatalog > 0 ? Math.min(100, Math.round((watchedCount / totalInCatalog) * 100)) : 0

  return (
    <div className="flex flex-col gap-5 py-2 sm:flex-row sm:items-center sm:gap-6">
      {/* Informações da Pessoa */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {person.nome_pessoa}
          </h1>
        </div>

        {/* Badges de Atuação com ícones e visual claro */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {person.papeis.map((papel) => (
            <Badge
              key={papel}
              variant="outline"
              size="md"
              className="gap-1.5"
            >
              {getRoleIcon(papel)}
              <span>{papel}</span>
            </Badge>
          ))}
          {person.primeiro_ano && person.ultimo_ano && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({person.primeiro_ano} – {person.ultimo_ano})
            </span>
          )}
        </div>

        <Separator
          variant="cinema"
          className="my-3.5"
        />

        {/* Métricas e Progresso de Visualização */}
        <div className="flex flex-wrap items-center gap-4 text-xs sm:gap-6 sm:text-sm">
          {/* Total de Filmes */}
          <div className="flex items-center gap-1.5">
            <Film className="size-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{totalInCatalog}</span>
            <span className="text-muted-foreground">
              {totalInCatalog === 1 ? 'filme no catálogo' : 'filmes no catálogo'}
            </span>
          </div>

          {/* Média dos Filmes */}
          {person.nota_media_filmes !== null && (
            <div className="flex items-center gap-1.5">
              <Star className="size-4 fill-primary text-primary" />
              <span className="font-semibold text-foreground">
                {person.nota_media_filmes.toFixed(1)}
              </span>
              <span className="text-muted-foreground">média das notas</span>
            </div>
          )}

          {/* Estatística Letterboxd-like sóbria sem caixa neon */}
          {isAuthenticated ? (
            <div
              className="flex items-center gap-2 text-muted-foreground"
              data-testid="person-watched-progress"
            >
              <CheckCircle2 className="size-4 text-primary" />
              <span>
                Você assistiu <strong className="text-foreground">{watchedCount}</strong> de{' '}
                <strong className="text-foreground">{totalInCatalog}</strong> /{' '}
                <span className="font-semibold text-primary">{percentage}%</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Award className="size-4 text-muted-foreground/60" />
              <span>Filmografia completa catalogada</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
