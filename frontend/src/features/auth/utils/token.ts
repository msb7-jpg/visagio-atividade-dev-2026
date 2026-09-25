import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from '@/features/auth/schemas/auth.schema'

export const AUTH_TOKEN_KEY = 'rocketfilms_access_token'

/**
 * Decodifica o token JWT de forma síncrona e segura.
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    if (!token || typeof token !== 'string') return null
    return jwtDecode<JwtPayload>(token)
  } catch {
    return null
  }
}

/**
 * Verifica se um token JWT expirou ou está prestes a expirar (margem de segurança de 30s).
 */
export function isTokenExpired(token: string, safetyMarginSeconds = 30): boolean {
  const payload = decodeToken(token)
  if (!payload || !payload.exp) return true

  const currentTimeInSeconds = Math.floor(Date.now() / 1000)
  return payload.exp <= currentTimeInSeconds + safetyMarginSeconds
}

/**
 * Recupera o token de acesso armazenado em localStorage com validação de expiração.
 */
export function getStoredToken(): string | null {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) return null

    if (isTokenExpired(token)) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      return null
    }

    return token
  } catch {
    return null
  }
}

/**
 * Salva o token de acesso no localStorage.
 */
export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  } catch (error) {
    console.error('Falha ao persistir token em localStorage', error)
  }
}

/**
 * Remove o token do localStorage.
 */
export function removeStoredToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  } catch (error) {
    console.error('Falha ao remover token de localStorage', error)
  }
}
