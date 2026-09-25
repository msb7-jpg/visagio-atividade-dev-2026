import type { AdminUser } from '@/features/auth/schemas/auth.schema'
import { decodeToken, isTokenExpired } from '@/features/auth/utils/token'

export function extractUserFromToken(currentToken: string | null): AdminUser | null {
  if (!currentToken || isTokenExpired(currentToken)) {
    return null
  }

  const payload = decodeToken(currentToken)
  if (!payload?.sub || !payload?.email) {
    return null
  }

  return {
    id: payload.sub,
    email: payload.email,
    nome: payload.nome || 'Administrador',
    role: payload.role || 'admin'
  }
}
