import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthProvider'
import { useUserLibrary } from '../useUserLibrary'
import * as userLibraryApi from '@/features/user-library/api/userLibraryApi'

const mockAuthUser = {
  id: 'user-test-123',
  email: 'tester@rocketfilms.com',
  nome: 'Cinéfilo de Teste',
  role: 'admin'
}

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: mockAuthUser,
    logout: vi.fn()
  })
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  })

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }
}

describe('useUserLibrary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('retorna status de favorito e watchlist baseado nos IDs carregados', async () => {
    vi.spyOn(userLibraryApi, 'getUserLibraryIds').mockResolvedValue({
      favorites: ['movie-matrix', 'movie-interstellar'],
      watchlist: ['movie-inception']
    })

    const { result } = renderHook(() => useUserLibrary(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isFavorite('movie-matrix')).toBe(true)
      expect(result.current.isFavorite('movie-other')).toBe(false)
      expect(result.current.inWatchlist('movie-inception')).toBe(true)
      expect(result.current.inWatchlist('movie-matrix')).toBe(false)
      expect(result.current.totalFavorites).toBe(2)
      expect(result.current.totalWatchlist).toBe(1)
    })
  })

  it('executa mutação otimista de toggleFavorite', async () => {
    let currentFavorites = ['movie-matrix']
    vi.spyOn(userLibraryApi, 'getUserLibraryIds').mockImplementation(async () => ({
      favorites: currentFavorites,
      watchlist: []
    }))

    const toggleFavSpy = vi.spyOn(userLibraryApi, 'toggleFavoriteMovie').mockImplementation(async (id) => {
      currentFavorites = currentFavorites.filter((f) => f !== id)
      return {
        sk_movie_id: id,
        is_favorite: false,
        in_watchlist: false,
        updated_at: '2026-09-26T18:00:00Z'
      }
    })

    const { result } = renderHook(() => useUserLibrary(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isFavorite('movie-matrix')).toBe(true)
    })

    act(() => {
      result.current.toggleFavorite('movie-matrix')
    })

    await waitFor(() => {
      expect(result.current.isFavorite('movie-matrix')).toBe(false)
    })

    expect(toggleFavSpy).toHaveBeenCalledWith('movie-matrix')
  })

  it('executa mutação otimista de toggleWatchlist', async () => {
    let currentWatchlist: string[] = []
    vi.spyOn(userLibraryApi, 'getUserLibraryIds').mockImplementation(async () => ({
      favorites: [],
      watchlist: currentWatchlist
    }))

    const toggleWatchSpy = vi.spyOn(userLibraryApi, 'toggleWatchlistMovie').mockImplementation(async (id) => {
      currentWatchlist = [...currentWatchlist, id]
      return {
        sk_movie_id: id,
        is_favorite: false,
        in_watchlist: true,
        updated_at: '2026-09-26T18:00:00Z'
      }
    })

    const { result } = renderHook(() => useUserLibrary(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.inWatchlist('movie-matrix')).toBe(false)
    })

    act(() => {
      result.current.toggleWatchlist('movie-matrix')
    })

    await waitFor(() => {
      expect(result.current.inWatchlist('movie-matrix')).toBe(true)
    })

    expect(toggleWatchSpy).toHaveBeenCalledWith('movie-matrix')
  })
})
