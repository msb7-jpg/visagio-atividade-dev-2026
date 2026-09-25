import type { AdminUser, LoginFormData, TokenResponse } from '@/features/auth/schemas/auth.schema'
import type { UseMutateAsyncFunction } from '@tanstack/react-query'
import { createContext } from 'react'

export interface AuthContextValue {
  token: string | null
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: UseMutateAsyncFunction<TokenResponse, Error, LoginFormData, unknown>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
