import { use } from 'react'
import { AuthContext, type AuthContextValue } from '@/features/auth/context/AuthContext'

export function useAuth(): AuthContextValue {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um <AuthProvider>')
  }
  return context
}

export { AuthProvider } from '@/features/auth/context/AuthProvider'
