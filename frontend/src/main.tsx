import { AuthProvider } from '@/features/auth/hooks/useAuth'
import '@/index.css'
import { AppNavigationSync } from '@/lib/navigation'
import { queryClient } from '@/lib/query-client'
import { AppRoutes } from '@/routes/AppRoutes'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

const rootElement = document.getElementById('root')!
createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <AuthProvider>
        <BrowserRouter>
          <AppNavigationSync />
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
