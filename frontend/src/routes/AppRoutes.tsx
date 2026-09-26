import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'

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

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<CatalogContainer />} />
        <Route path="/filmes/:id" element={<MovieDetailsContainer />} />
      </Route>
      <Route path="/login" element={<LoginContainer />} />
    </Routes>
  )
}
