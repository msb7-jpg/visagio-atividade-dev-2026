import { MutationCache, QueryClient } from '@tanstack/react-query'
import { navigateApp } from '@/lib/navigation'

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (data, _variables, _context, mutation) => {
      // 1. Invalidação automática declarativa de queries
      if (mutation.meta?.invalidates) {
        mutation.meta.invalidates.forEach((queryKey) => {
          void queryClient.invalidateQueries({ queryKey })
        })
      }

      // 2. Redirecionamento automático pós-sucesso
      if (mutation.meta?.redirectOnSuccess) {
        const destination = typeof mutation.meta.redirectOnSuccess === 'function'
          ? mutation.meta.redirectOnSuccess(data)
          : mutation.meta.redirectOnSuccess

        if (destination) {
          navigateApp(destination, { replace: mutation.meta.replace ?? true })
        }
      }
    }
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 15 * 60 * 1000, // 15 minutos
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})
