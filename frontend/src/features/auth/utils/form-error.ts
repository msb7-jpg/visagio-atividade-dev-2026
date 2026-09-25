/**
 * Extrai a primeira mensagem de erro de uma lista de erros retornada pelo TanStack Form.
 */
export function extractFirstErrorMessage(errors: unknown): string | undefined {
  if (!Array.isArray(errors) || errors.length === 0) {
    return undefined
  }
  const first = errors[0]
  if (typeof first === 'string') {
    return first
  }
  if (first && typeof first === 'object' && 'message' in first && typeof first.message === 'string') {
    return first.message
  }
  return undefined
}
