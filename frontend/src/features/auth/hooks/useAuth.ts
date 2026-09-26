import { use } from 'react'
import { AuthContext, type AuthContextValue } from '@/features/auth/context/AuthContext'

const fallbackAuthContext: AuthContextValue = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: (async () => {
    throw new Error('useAuth deve ser utilizado dentro de um <AuthProvider>')
  }) as AuthContextValue['login'],
  logout: () => {}
}

export function useAuth(): AuthContextValue {
  const context = use(AuthContext)
  return context ?? fallbackAuthContext
}

export { AuthProvider } from '@/features/auth/context/AuthProvider'
