import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { UserLibraryContainer } from '../UserLibraryContainer'
import * as userLibraryApi from '@/features/user-library/api/userLibraryApi'

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 'test-user', nome: 'Admin' },
    logout: vi.fn()
  })
}))

function renderComponent(initialRoute = '/minha-lista') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <UserLibraryContainer />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('UserLibraryContainer', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(userLibraryApi, 'getUserLibraryIds').mockResolvedValue({
      favorites: ['fav-1'],
      watchlist: ['watch-1']
    })
  })

  it('renderiza título da biblioteca e botões de abas com contadores', async () => {
    vi.spyOn(userLibraryApi, 'getUserLibraryMovies').mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      page_size: 24,
      total_pages: 1
    })

    renderComponent()

    expect(screen.getByText('Minha Biblioteca')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ver filmes favoritos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ver filmes na watchlist/i })).toBeInTheDocument()
  })

  it('exibe estado vazio convidativo quando a aba de favoritos não possui filmes', async () => {
    vi.spyOn(userLibraryApi, 'getUserLibraryMovies').mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      page_size: 24,
      total_pages: 1
    })

    renderComponent('/minha-lista?tab=favorites')

    expect(await screen.findByText('Nenhum filme favoritado ainda')).toBeInTheDocument()
    expect(screen.getByText('Explorar Catálogo')).toBeInTheDocument()
  })

  it('exibe filmes favoritados quando a API retorna itens', async () => {
    vi.spyOn(userLibraryApi, 'getUserLibraryMovies').mockResolvedValue({
      items: [
        {
          sk_movie_id: 'fav-1',
          id_filme: 'fav-1',
          titulo: 'Interestelar Favorito',
          ano_lancamento: 2014,
          duracao_minutos: 169,
          url_poster: 'http://example.com/inter.jpg',
          url_backdrop: null,
          nota_media_usuarios: 9.0,
          qtd_avaliacoes_usuarios: 150,
          generos: ['Ficção Científica'],
          diretores: ['Christopher Nolan'],
          is_favorite: true,
          in_watchlist: false,
          updated_at: '2026-09-26T18:00:00Z'
        }
      ],
      total: 1,
      page: 1,
      page_size: 24,
      total_pages: 1
    })

    renderComponent('/minha-lista?tab=favorites')

    expect(await screen.findByText('Interestelar Favorito')).toBeInTheDocument()
    expect(screen.getByText('2014')).toBeInTheDocument()
  })

  it('alterna para a aba de watchlist ao clicar no botão correspondente', async () => {
    const listSpy = vi.spyOn(userLibraryApi, 'getUserLibraryMovies').mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      page_size: 24,
      total_pages: 1
    })

    renderComponent('/minha-lista?tab=favorites')

    const watchlistTabButton = screen.getByRole('button', { name: /ver filmes na watchlist/i })
    fireEvent.click(watchlistTabButton)

    await waitFor(() => {
      expect(listSpy).toHaveBeenCalledWith('watchlist', 1, 24)
    })
  })
})
