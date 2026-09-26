import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

const CatalogContainer = lazy(() =>
  import('@/features/catalog/components/CatalogContainer').then(module => ({
    default: module.CatalogContainer
  }))
)

const MovieDetailsContainer = lazy(() =>
  import('@/features/movie-details/components/MovieDetailsContainer').then(module => ({
    default: module.MovieDetailsContainer
  }))
)

const LoginContainer = lazy(() =>
  import('@/features/auth/components/LoginContainer').then(module => ({
    default: module.LoginContainer
  }))
)

const MovieCreateContainer = lazy(() =>
  import('@/features/movie-admin/components/MovieCreateContainer').then(module => ({
    default: module.MovieCreateContainer
  }))
)

const MovieEditContainer = lazy(() =>
  import('@/features/movie-admin/components/MovieEditContainer').then(module => ({
    default: module.MovieEditContainer
  }))
)

const UserLibraryContainer = lazy(() =>
  import('@/features/user-library/components/UserLibraryContainer').then(module => ({
    default: module.UserLibraryContainer
  }))
)

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<CatalogContainer />} />
        <Route path="/filmes/:id" element={<MovieDetailsContainer />} />

        {/* Rotas restritas ao Administrador e Usuários autenticados */}
        <Route element={<ProtectedRoute />}>
          <Route path="/minha-lista" element={<UserLibraryContainer />} />
          <Route path="/admin/filmes/novo" element={<MovieCreateContainer />} />
          <Route path="/admin/filmes/:id/editar" element={<MovieEditContainer />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginContainer />} />
    </Routes>
  )
}
