import { Badge } from '@/components/ui/badge'
import { Clapperboard, PenTool, Users, Building2 } from 'lucide-react'
import type { CompanyDTO, PersonSummaryDTO } from '@/features/movie-details/types/movie-details.types'
import { Link } from 'react-router-dom'
import { routes } from '@/routes/routes.types'

interface CastAndCrewSectionViewProps {
  diretores: PersonSummaryDTO[]
  roteiristas: PersonSummaryDTO[]
  atores: PersonSummaryDTO[]
  produtoras: CompanyDTO[]
}

export function CastAndCrewSectionView({
  diretores,
  roteiristas,
  atores,
  produtoras
}: CastAndCrewSectionViewProps) {
  const hasContent =
    diretores.length > 0 ||
    roteiristas.length > 0 ||
    atores.length > 0 ||
    produtoras.length > 0

  if (!hasContent) return null

  return (
    <div className="space-y-4 border-t border-white/10 pt-6">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        Equipe Técnica & Produção
      </h3>

      <div className="space-y-3.5 text-sm">
        {/* Direção */}
        {diretores.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <span className="flex shrink-0 items-center gap-1.5 pt-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:w-36">
              <Clapperboard className="size-3.5 opacity-70" />
              Direção
            </span>
            <div className="flex flex-wrap gap-1.5">
              {diretores.map((d) => (
                <Link
                  key={d.sk_person_id}
                  to={routes.personDetail(d.sk_person_id)}
                  className="inline-block transition-transform hover:scale-105"
                  title={`Ver filmografia de ${d.nome_pessoa}`}
                >
                  <Badge
                    variant="glass"
                    size="md"
                    className="cursor-pointer"
                  >
                    <span className="underline decoration-white/30 decoration-1 underline-offset-2 transition-colors hover:decoration-primary hover:text-primary">
                      {d.nome_pessoa}
                    </span>
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Roteiro */}
        {roteiristas.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <span className="flex shrink-0 items-center gap-1.5 pt-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:w-36">
              <PenTool className="size-3.5 opacity-70" />
              Roteiro
            </span>
            <div className="flex flex-wrap gap-1.5">
              {roteiristas.map((r) => (
                <Link
                  key={r.sk_person_id}
                  to={routes.personDetail(r.sk_person_id)}
                  className="inline-block transition-transform hover:scale-105"
                  title={`Ver filmografia de ${r.nome_pessoa}`}
                >
                  <Badge
                    variant="glass"
                    size="md"
                    className="cursor-pointer"
                  >
                    <span className="underline decoration-white/30 decoration-1 underline-offset-2 transition-colors hover:decoration-primary hover:text-primary">
                      {r.nome_pessoa}
                    </span>
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Produtoras */}
        {produtoras.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <span className="flex shrink-0 items-center gap-1.5 pt-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:w-36">
              <Building2 className="size-3.5 opacity-70" />
              Estúdios
            </span>
            <div className="flex flex-wrap gap-1.5">
              {produtoras.map((c) => (
                <Badge
                  key={c.sk_company_id}
                  variant="glass"
                  size="md"
                >
                  {c.nome_produtora}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Elenco Principal */}
        {atores.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <span className="flex shrink-0 items-center gap-1.5 pt-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:w-36">
              <Users className="size-3.5 opacity-70" />
              Elenco Principal
            </span>
            <div className="flex flex-wrap gap-1.5">
              {atores.map((a) => (
                <Link
                  key={a.sk_person_id}
                  to={routes.personDetail(a.sk_person_id)}
                  className="inline-block transition-transform hover:scale-105"
                  title={`Ver filmografia de ${a.nome_pessoa}`}
                >
                  <Badge
                    variant="glass"
                    size="md"
                    className="cursor-pointer"
                  >
                    <span className="underline decoration-white/30 decoration-1 underline-offset-2 transition-colors hover:decoration-primary hover:text-primary">
                      {a.nome_pessoa}
                    </span>
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
