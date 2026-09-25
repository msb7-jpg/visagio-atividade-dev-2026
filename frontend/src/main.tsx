import { AppLayout } from '@/components/layout/AppLayout'
import { LoginContainer } from '@/features/auth/components/LoginContainer'
import { AuthProvider } from '@/features/auth/hooks/useAuth'
import { CatalogContainer } from '@/features/catalog/components/CatalogContainer'
import '@/index.css'
import { AppNavigationSync } from '@/lib/navigation'
import { queryClient } from '@/lib/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const rootElement = document.getElementById('root')!
createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <AuthProvider>
        <BrowserRouter>
          <AppNavigationSync />
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<CatalogContainer />} />
            </Route>
            <Route path="/login" element={<LoginContainer />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
