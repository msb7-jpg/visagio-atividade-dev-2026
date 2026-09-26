import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth/context/AuthProvider'
import { MovieQuickActionsMenu } from '../MovieQuickActionsMenu'
import * as reviewsApi from '@/features/reviews/api/reviewsApi'
import type { MovieListItem } from '@/features/catalog/api/catalogApi'

const mockMovie: MovieListItem = {
  sk_movie_id: 'movie-matrix',
  id_filme: 'matrix-1999',
  titulo: 'The Matrix',
  ano_lancamento: 1999,
  duracao_minutos: 136,
  sinopse: 'Ficção científica icônica.',
  url_poster: 'http://example.com/matrix.jpg',
  url_backdrop: null,
  generos: ['Ficção Científica'],
  diretores: ['Lana Wachowski'],
  produtoras: ['Warner Bros.'],
  popularidade: 90,
  nota_media_usuarios: 8.5,
  qtd_avaliacoes_usuarios: 500,
  nota_tmdb: 8.2,
  nota_imdb: 8.7,
  receita_usd: 400000000,
  receita_brl: 2000000000
}

import { MemoryRouter } from 'react-router-dom'

function renderComponent() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>
          <MovieQuickActionsMenu movie={mockMovie}>
            <div data-testid="poster-mock">Poster The Matrix</div>
          </MovieQuickActionsMenu>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('MovieQuickActionsMenu', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('renderiza o poster filho e o botão flutuante de ações rápidas', () => {
    renderComponent()

    expect(screen.getByTestId('poster-mock')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /ações rápidas para the matrix/i })
    ).toBeInTheDocument()
  })

  it('abre o menu ao clicar no botão de 3 pontinhos e submete quick rating', async () => {
    const submitSpy = vi.spyOn(reviewsApi, 'submitMovieReview').mockResolvedValue({
      sk_movie_review_id: 'rev-quick',
      sk_movie_id: 'movie-matrix',
      nome: 'Cinéfilo',
      nota: 8.0,
      comentario: null,
      created_at: '2026-09-26T12:00:00Z'
    })

    renderComponent()

    const triggerButton = screen.getByRole('button', {
      name: /ações rápidas para the matrix/i
    })
    fireEvent.pointerDown(triggerButton)

    // Menu exibido
    expect(await screen.findByText('Avaliação Rápida (1 clique)')).toBeInTheDocument()
    expect(screen.getByText('Escrever resenha completa...')).toBeInTheDocument()

    // Clica na 4ª estrela (nota 8.0)
    const fourStarsButton = screen.getByLabelText('4 estrelas')
    fireEvent.click(fourStarsButton)

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith('movie-matrix', {
        nome: 'Cinéfilo',
        nota: 8,
        comentario: null
      })
    })
  })

  it('abre o menu ao clicar com botão direito (contextMenu) sobre o poster', async () => {
    renderComponent()

    const poster = screen.getByTestId('poster-mock')
    fireEvent.contextMenu(poster)

    expect(await screen.findByText('Avaliação Rápida (1 clique)')).toBeInTheDocument()
    expect(screen.getByText('Escrever resenha completa...')).toBeInTheDocument()
  })

  it('exibe opções de editar e adicionar nova resenha caso o usuário já tenha avaliado', async () => {
    // Simula review prévia armazenada
    localStorage.setItem(
      'rocketfilms_anon_review_movie-matrix',
      JSON.stringify({
        reviewId: 'rev-prev',
        nota: 8.0,
        comentario: 'Resenha anterior fantástica.',
        nome: 'Cinéfilo'
      })
    )

    const updateSpy = vi.spyOn(reviewsApi, 'updateMovieReview').mockResolvedValue({
      sk_movie_review_id: 'rev-prev',
      sk_movie_id: 'movie-matrix',
      nome: 'Cinéfilo',
      nota: 10.0,
      comentario: 'Resenha anterior fantástica.',
      created_at: '2026-09-26T12:00:00Z'
    })

    renderComponent()

    const triggerButton = screen.getByRole('button', {
      name: /ações rápidas para the matrix/i
    })
    fireEvent.pointerDown(triggerButton)

    // Verifica que reconhece a avaliação prévia
    expect(await screen.findByText(/sua avaliação/i)).toBeInTheDocument()
    expect(screen.getByText('Editar minha resenha...')).toBeInTheDocument()
    expect(screen.getByText('Adicionar nova resenha...')).toBeInTheDocument()

    // Clicar na 5ª estrela (10.0) dispara atualização (updateMovieReview) em vez de criar nova
    const fiveStarsButton = screen.getByLabelText('5 estrelas')
    fireEvent.click(fiveStarsButton)

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith('movie-matrix', 'rev-prev', {
        nome: 'Cinéfilo',
        nota: 10,
        comentario: 'Resenha anterior fantástica.'
      })
    })
  })
})
