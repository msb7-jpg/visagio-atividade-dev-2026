import type { FinancialMetricsDTO } from '@/features/movie-details/types/movie-details.types'
import { formatCompactCurrency } from '@/features/movie-details/utils/movie-formatters'
import { DollarSign, TrendingUp, Wallet } from 'lucide-react'

interface FinancialMetricsViewProps {
  metricas: FinancialMetricsDTO
}

function parseNum(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = typeof value === 'string' ? parseFloat(value) : value
  return isNaN(n) ? null : n
}

interface MetricBlockProps {
  label: string
  icon: React.ReactNode
  primaryText?: React.ReactNode
  secondaryText?: React.ReactNode
}

function MetricBlock({ label, icon, primaryText, secondaryText }: MetricBlockProps) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
        {icon}
        {label}
      </div>
      {primaryText && (
        <div className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
          {primaryText}
        </div>
      )}
      {secondaryText && (
        <div className="text-[11px] text-muted-foreground/75">
          {secondaryText}
        </div>
      )}
    </div>
  )
}

// fallow-ignore-next-line complexity
export function FinancialMetricsView({ metricas }: FinancialMetricsViewProps) {
  const orcamentoUsd = parseNum(metricas.orcamento_usd)
  const orcamentoBrl = parseNum(metricas.orcamento_brl)
  const hasOrcamento = (orcamentoUsd !== null && orcamentoUsd > 0) || (orcamentoBrl !== null && orcamentoBrl > 0)

  const receitaUsd = parseNum(metricas.receita_usd)
  const receitaBrl = parseNum(metricas.receita_brl)
  const hasReceita = (receitaUsd !== null && receitaUsd > 0) || (receitaBrl !== null && receitaBrl > 0)

  const lucroUsd = parseNum(metricas.lucro_usd)
  const lucroBrl = parseNum(metricas.lucro_brl)
  const roiVal = metricas.roi_percentual
  const hasLucroOrRoi =
    (lucroUsd !== null && lucroUsd !== 0) ||
    (lucroBrl !== null && lucroBrl !== 0) ||
    (roiVal !== null && roiVal !== undefined && !isNaN(roiVal))

  if (!hasOrcamento && !hasReceita && !hasLucroOrRoi) return null

  return (
    <div className="mt-3 border-t border-white/10 pt-3">
      <div className="flex flex-wrap items-start gap-6 sm:gap-8">
        {hasOrcamento && (
          <MetricBlock
            label="Orçamento"
            icon={<Wallet className="size-3 opacity-60" />}
            primaryText={orcamentoUsd !== null && orcamentoUsd > 0 ? formatCompactCurrency(orcamentoUsd, 'USD') : undefined}
            secondaryText={orcamentoBrl !== null && orcamentoBrl > 0 ? formatCompactCurrency(orcamentoBrl, 'BRL') : undefined}
          />
        )}

        {hasReceita && (
          <MetricBlock
            label="Bilheteria Global"
            icon={<DollarSign className="size-3 opacity-60" />}
            primaryText={receitaUsd !== null && receitaUsd > 0 ? formatCompactCurrency(receitaUsd, 'USD') : undefined}
            secondaryText={receitaBrl !== null && receitaBrl > 0 ? formatCompactCurrency(receitaBrl, 'BRL') : undefined}
          />
        )}

        {hasLucroOrRoi && (
          <MetricBlock
            label="Lucro"
            icon={<TrendingUp className="size-3 opacity-60" />}
            primaryText={
              <div className="flex items-center gap-2">
                {lucroUsd !== null && (
                  <span>{formatCompactCurrency(lucroUsd, 'USD')}</span>
                )}
                {/* {roiVal !== null && roiVal !== undefined && (
                  <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    ROI: {roi.formatted}
                  </span>
                  Não gostei mt da métrica do ROI e acho q tem mais valor pro usuário so ver se deu lucro ou preju
                )} */}
              </div>
            }
            secondaryText={lucroBrl !== null ? formatCompactCurrency(lucroBrl, 'BRL') : undefined}
          />
        )}
      </div>
    </div>
  )
}
