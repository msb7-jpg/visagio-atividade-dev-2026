/**
 * Extrai as iniciais do primeiro e do último nome de uma pessoa.
 * Exemplo: "Miguel Batista" =&gt; "MB"
 * Exemplo: "Miguel" =&gt; "M"
 * Exemplo: "Miguel Silva Batista" =&gt; "MB"
 * Exemplo: "" =&gt; "U"
 */
export function getInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') return 'U'

  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'

  const firstInitial = parts[0][0] ?? ''
  if (parts.length === 1) {
    return firstInitial.toUpperCase()
  }

  const lastInitial = parts[parts.length - 1][0] ?? ''
  return `${firstInitial}${lastInitial}`.toUpperCase()
}
