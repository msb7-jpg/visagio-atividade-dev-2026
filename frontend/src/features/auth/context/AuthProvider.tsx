import { authApi } from '@/features/auth/api/authApi'
import { AuthContext } from '@/features/auth/context/AuthContext'
import type { LoginFormData, TokenResponse } from '@/features/auth/schemas/auth.schema'
import { routes } from '@/routes/routes.types'
import {
  getStoredToken,
  isTokenExpired,
  removeStoredToken,
  setStoredToken
} from '@/features/auth/utils/token'
import { extractUserFromToken } from '@/features/auth/utils/user'
import { queryClient } from '@/lib/query-client'
import { useMutation } from '@tanstack/react-query'
import { useSyncExternalStore, type ReactNode } from 'react'

const authStoreListeners = new Set<() => void>()

function subscribeAuthStore(onStoreChange: () => void) {
  authStoreListeners.add(onStoreChange)
  return () => {
    authStoreListeners.delete(onStoreChange)
  }
}

function notifyAuthStore() {
  authStoreListeners.forEach((listener) => {
    listener()
  })
}

function getAuthSnapshot(): string | null {
  return getStoredToken()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useSyncExternalStore(subscribeAuthStore, getAuthSnapshot, () => null)

  const user = extractUserFromToken(token)
  const isAuthenticated = Boolean(token && !isTokenExpired(token) && user)

  const loginMutation = useMutation<TokenResponse, Error, LoginFormData>(
    {
      mutationFn: (credentials: LoginFormData) => authApi.login(credentials),
      onSuccess: (response) => {
        setStoredToken(response.access_token)
        notifyAuthStore()
      }
    },
    queryClient
  )

  const logoutMutation = useMutation<void, Error, void>(
    {
      mutationFn: async () => {
        removeStoredToken()
        notifyAuthStore()
        queryClient.clear()
      },
      meta: {
        redirectOnSuccess: routes.login()
      }
    },
    queryClient
  )
  const login = loginMutation.mutateAsync
  const logout = logoutMutation.mutate
  const isLoading = loginMutation.isPending || logoutMutation.isPending

  return (
    <AuthContext
      value={{
        token,
        user,
        isAuthenticated,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext>
  )
}
