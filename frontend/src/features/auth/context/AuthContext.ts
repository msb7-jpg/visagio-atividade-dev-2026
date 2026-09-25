import { createContext } from 'react'
import type { AdminUser, LoginFormData } from '@/features/auth/schemas/auth.schema'

export interface AuthContextValue {
  token: string | null
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginFormData) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
