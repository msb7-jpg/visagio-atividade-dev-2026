import { useEffect } from 'react'
import { useNavigate, type NavigateOptions } from 'react-router-dom'

type NavigateFn = (to: string, options?: NavigateOptions) => void

let appNavigator: NavigateFn | null = null

/**
 * Registra a função de navegação ativa do React Router.
 */
export function setAppNavigator(navigator: NavigateFn | null): void {
  appNavigator = navigator
}

/**
 * Realiza navegação desacoplada para uso em MutationCache e utilitários globais.
 */
export function navigateApp(to: string, options?: NavigateOptions): void {
  if (appNavigator) {
    appNavigator(to, options)
  } else if (typeof window !== 'undefined') {
    if (options?.replace) {
      window.location.replace(to)
    } else {
      window.location.assign(to)
    }
  }
}

/**
 * Componente que sincroniza a instância do useNavigate do React Router com o navegador global.
 */
export function AppNavigationSync(): null {
  const navigate = useNavigate()

  useEffect(() => {
    setAppNavigator(navigate)
    return () => {
      setAppNavigator(null)
    }
  }, [navigate])

  return null
}
