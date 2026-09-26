export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return 'Duração não informada'
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) return `${remainingMinutes}min`
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}

// fallow-ignore-next-line complexity
export function formatCompactCurrency(
  value: number | string | null | undefined,
  currency: 'USD' | 'BRL' = 'USD'
): string {
  if (value === null || value === undefined || value === '') return 'Não informado'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return 'Não informado'

  const symbol = currency === 'BRL' ? 'R$' : '$'
  const abs = Math.abs(num)
  const sign = num < 0 ? '-' : ''

  const formatWithUnit = (val: number, unit: string) => {
    // Round to 1 decimal place if has decimals, otherwise no trailing zero
    const rounded = Number((val).toFixed(1))
    return `${sign}${symbol}${rounded}${unit}`
  }

  if (abs >= 1_000_000_000)
    return formatWithUnit(abs / 1_000_000_000, 'B')

  if (abs >= 1_000_000)
    return formatWithUnit(abs / 1_000_000, 'M')

  if (abs >= 1_000)
    return formatWithUnit(abs / 1_000, 'k')

  return `${sign}${symbol}${abs.toLocaleString(currency === 'BRL' ? 'pt-BR' : 'en-US')}`
}

export function formatCurrency(
  value: number | string | null | undefined,
  currency: 'USD' | 'BRL' = 'USD'
): string {
  if (value === null || value === undefined || value === '') return 'Não informado'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return 'Não informado'

  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(num)
}

export function formatRoi(roi: number | null | undefined): {
  formatted: string
  isPositive: boolean
} {
  if (roi === null || roi === undefined || isNaN(roi)) {
    return { formatted: 'N/A', isPositive: false }
  }
  const isPositive = roi >= 0
  const sign = isPositive ? '+' : ''
  return {
    formatted: `${sign}${roi.toFixed(1)}%`,
    isPositive
  }
}
