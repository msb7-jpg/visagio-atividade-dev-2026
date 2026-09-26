import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth/context/AuthProvider'
import { MovieGridItemView } from '@/features/catalog/components/MovieGridItemView'
import { MovieListItemView } from '@/features/catalog/components/MovieListItemView'
import type { MovieListItem } from '@/features/catalog/api/catalogApi'

describe('MovieItemViews', () => {
  const mockMovie: MovieListItem = {
    sk_movie_id: 'sk-123',
    id_filme: 'matrix-1999',
    titulo: 'The Matrix',
    ano_lancamento: 1999,
    duracao_minutos: 136,
    sinopse: 'Um clássico do cinema de ficção.',
    url_poster: 'http://example.com/poster.jpg',
    url_backdrop: null,
    generos: ['Ficção Científica', 'Ação'],
    diretores: ['Lana Wachowski'],
    produtoras: ['Warner Bros.'],
    popularidade: 95.5,
    nota_media_usuarios: 8.9,
    qtd_avaliacoes_usuarios: 1500,
    nota_tmdb: 8.2,
    nota_imdb: 8.7,
    receita_usd: 463517383,
    receita_brl: 2317586915
  }

  function renderWithProviders(ui: React.ReactElement) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
    })
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>{ui}</BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    )
  }

  it('MovieGridItemView renderiza título, ano, nota no rodapé e gatilho de ações rápidas', () => {
    renderWithProviders(<MovieGridItemView movie={mockMovie} />)

    expect(screen.getByText('The Matrix')).toBeDefined()
    expect(screen.getByText('1999')).toBeDefined()
    expect(screen.getByText('8.9')).toBeDefined()
    expect(screen.getByText('136 min')).toBeDefined()
    expect(screen.getByLabelText('Ações rápidas para The Matrix')).toBeDefined()
  })

  it('MovieGridItemView abre context menu ao clicar com botão direito no texto do card', async () => {
    const { fireEvent } = await import('@testing-library/react')
    renderWithProviders(<MovieGridItemView movie={mockMovie} />)

    // Clica com botão direito no título (fora do pôster, na parte textual inferior)
    const titleElement = screen.getByText('The Matrix')
    fireEvent.contextMenu(titleElement)

    expect(await screen.findByText('Avaliação Rápida (1 clique)')).toBeInTheDocument()
    expect(screen.getByTitle('Clique com botão direito no card para abrir o menu')).toBeInTheDocument()
  })

  it('MovieListItemView renderiza linha com nota, diretores e gêneros', () => {
    renderWithProviders(<MovieListItemView movie={mockMovie} />)

    expect(screen.getByText('The Matrix')).toBeDefined()
    expect(screen.getByText('(1999)')).toBeDefined()
    expect(screen.getByText('8.9')).toBeDefined()
    expect(screen.getByText('Lana Wachowski')).toBeDefined()
  })
})
