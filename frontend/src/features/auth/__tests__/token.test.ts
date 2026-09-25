import { describe, it, expect, beforeEach } from 'vitest'
import {
  decodeToken,
  isTokenExpired,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  AUTH_TOKEN_KEY
} from '@/features/auth/utils/token'

// Helper para gerar token JWT mock simples sem assinatura criptográfica completa para testes
function createMockJwt(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  const signature = 'mock-signature'
  return `${header}.${body}.${signature}`
}

describe('Auth Token Utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('decodeToken retorna null para string vazia ou inválida', () => {
    expect(decodeToken('')).toBeNull()
    expect(decodeToken('invalido')).toBeNull()
  })

  it('decodeToken decodifica claims corretamente', () => {
    const mockPayload = {
      sub: 'admin-123',
      email: 'admin@rocketfilms.com',
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 3600
    }
    const token = createMockJwt(mockPayload)
    const decoded = decodeToken(token)

    expect(decoded).not.toBeNull()
    expect(decoded?.sub).toBe('admin-123')
    expect(decoded?.email).toBe('admin@rocketfilms.com')
    expect(decoded?.role).toBe('admin')
  })

  it('isTokenExpired identifica token expirado', () => {
    // Expirou há 1 hora
    const expiredToken = createMockJwt({
      sub: 'admin-1',
      exp: Math.floor(Date.now() / 1000) - 3600
    })
    expect(isTokenExpired(expiredToken)).toBe(true)

    // Expira em 1 hora
    const validToken = createMockJwt({
      sub: 'admin-1',
      exp: Math.floor(Date.now() / 1000) + 3600
    })
    expect(isTokenExpired(validToken)).toBe(false)
  })

  it('getStoredToken recupera token válido e descarta token expirado do localStorage', () => {
    const validToken = createMockJwt({
      sub: 'admin-1',
      email: 'admin@rocketfilms.com',
      exp: Math.floor(Date.now() / 1000) + 3600
    })
    setStoredToken(validToken)
    expect(getStoredToken()).toBe(validToken)

    const expiredToken = createMockJwt({
      sub: 'admin-1',
      email: 'admin@rocketfilms.com',
      exp: Math.floor(Date.now() / 1000) - 100
    })
    setStoredToken(expiredToken)
    expect(getStoredToken()).toBeNull()
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()

    removeStoredToken()
    expect(getStoredToken()).toBeNull()
  })
})
