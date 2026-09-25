import { describe, it, expect } from 'vitest'
import { extractUserFromToken } from '@/features/auth/utils/user'

function createMockJwt(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.mock-signature`
}

describe('extractUserFromToken', () => {
  it('retorna null para token nulo ou vazio', () => {
    expect(extractUserFromToken(null)).toBeNull()
    expect(extractUserFromToken('')).toBeNull()
  })

  it('retorna null para token expirado', () => {
    const expiredToken = createMockJwt({
      sub: 'admin-1',
      email: 'admin@test.com',
      exp: Math.floor(Date.now() / 1000) - 3600
    })
    expect(extractUserFromToken(expiredToken)).toBeNull()
  })

  it('retorna null se faltar sub ou email no payload', () => {
    const missingSub = createMockJwt({
      email: 'admin@test.com',
      exp: Math.floor(Date.now() / 1000) + 3600
    })
    expect(extractUserFromToken(missingSub)).toBeNull()

    const missingEmail = createMockJwt({
      sub: 'admin-1',
      exp: Math.floor(Date.now() / 1000) + 3600
    })
    expect(extractUserFromToken(missingEmail)).toBeNull()
  })

  it('retorna AdminUser com valores corretos para token válido', () => {
    const validToken = createMockJwt({
      sub: 'user-42',
      email: 'gestor@rocketfilms.com',
      nome: 'Gestor Cinema',
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 3600
    })
    const user = extractUserFromToken(validToken)
    expect(user).toEqual({
      id: 'user-42',
      email: 'gestor@rocketfilms.com',
      nome: 'Gestor Cinema',
      role: 'admin'
    })
  })
})
