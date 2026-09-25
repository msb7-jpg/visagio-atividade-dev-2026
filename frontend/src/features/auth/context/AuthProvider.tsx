import {
  useState,
  useCallback,
  useSyncExternalStore,
  type ReactNode
} from 'react'
import { authApi } from '@/features/auth/api/authApi'
import type { LoginFormData } from '@/features/auth/schemas/auth.schema'
import {
  getStoredToken,
  isTokenExpired,
  removeStoredToken,
  setStoredToken
} from '@/features/auth/utils/token'
import { AuthContext } from '@/features/auth/context/AuthContext'
import { extractUserFromToken } from '@/features/auth/utils/user'

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
  const [isLoading, setIsLoading] = useState(false)

  const user = extractUserFromToken(token)
  const isAuthenticated = Boolean(token && !isTokenExpired(token) && user)

  const login = useCallback(async (credentials: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(credentials)
      setStoredToken(response.access_token)
      notifyAuthStore()
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    removeStoredToken()
    notifyAuthStore()
  }, [])

  return (
    <AuthContext value={{
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
