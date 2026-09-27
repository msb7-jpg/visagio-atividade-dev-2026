import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ReviewsSectionContainer } from '../ReviewsSectionContainer'
import { AuthProvider } from '@/features/auth/context/AuthProvider'
import * as reviewsApi from '@/features/reviews/api/reviewsApi'
import type { MovieReviewDTO } from '@/features/reviews/types/reviews.types'

const mockReviews: MovieReviewDTO[] = [
  {
    sk_movie_review_id: 'rev-1',
    sk_movie_id: 'movie-123',
    nome: 'Carolina Maria',
    nota: 9.5,
    comentario: 'Uma verdadeira aula de cinema. Fotografia e trilha sonora impecáveis.',
    created_at: '2026-09-20T12:00:00Z'
  },
  {
    sk_movie_review_id: 'rev-2',
    sk_movie_id: 'movie-123',
    nome: 'Bernardo Silva',
    nota: 8.0,
    comentario: 'Gostei muito do ritmo e desenvolvimento dos personagens centrais.',
    created_at: '2026-09-18T10:30:00Z'
  }
]

function renderReviewsSection(movieId = 'movie-123', title = 'Interestelar') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ReviewsSectionContainer
          movieId={movieId}
          movieTitle={title}
          notaMediaUsuarios={8.8}
          qtdAvaliacoesUsuarios={2}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('ReviewsSectionContainer and ReviewSubmission', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('renderiza o cabeçalho de avaliações, contador e os cards de resenha', async () => {
    vi.spyOn(reviewsApi, 'fetchMovieReviews').mockResolvedValue(mockReviews)

    renderReviewsSection()

    expect(screen.getByText('Avaliações da Comunidade')).toBeInTheDocument()
    expect(screen.getByText('8.8')).toBeInTheDocument()
    expect(screen.getByText('2 resenhas')).toBeInTheDocument()

    // Aguarda carregar os cards
    expect(await screen.findByText('Carolina Maria')).toBeInTheDocument()
    expect(screen.getByText('Bernardo Silva')).toBeInTheDocument()
    expect(screen.getByText(/Fotografia e trilha sonora impecáveis/i)).toBeInTheDocument()
  })

  it('abre o modal e exibe confirmação ao submeter sem selecionar nota (nota 0)', async () => {
    vi.spyOn(reviewsApi, 'fetchMovieReviews').mockResolvedValue([])
    const submitSpy = vi.spyOn(reviewsApi, 'submitMovieReview').mockResolvedValue({
      sk_movie_review_id: 'rev-zero',
      sk_movie_id: 'movie-123',
      nome: 'Cinéfilo',
      nota: 0,
      comentario: '',
      created_at: '2026-09-26T10:00:00Z'
    })

    renderReviewsSection()

    const openButton = screen.getByRole('button', { name: /escrever avaliação/i })
    fireEvent.click(openButton)

    // Modal aberto
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/registre sua avaliação e compartilhe suas impressões/i)).toBeInTheDocument()

    // Tenta submeter sem selecionar nota
    const submitButton = screen.getByRole('button', { name: /publicar avaliação/i })
    fireEvent.click(submitButton)

    // Abre diálogo de confirmação de nota 0
    expect(await screen.findByText(/publicar com nota 0\?/i)).toBeInTheDocument()
    expect(screen.getByText(/você não selecionou nenhuma estrela para este filme/i)).toBeInTheDocument()

    // Confirma nota 0
    const confirmButton = screen.getByRole('button', { name: /confirmar nota 0/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith('movie-123', {
        nome: 'Cinéfilo',
        nota: 0,
        comentario: null
      })
    })
  })

  it('preenche o formulário e envia com sucesso a avaliação', async () => {
    vi.spyOn(reviewsApi, 'fetchMovieReviews').mockResolvedValue([])
    const submitSpy = vi.spyOn(reviewsApi, 'submitMovieReview').mockResolvedValue({
      sk_movie_review_id: 'rev-3',
      sk_movie_id: 'movie-123',
      nome: 'Cinéfilo',
      nota: 10,
      comentario: 'Filme fantástico, recomendo para qualquer apreciador de boa arte.',
      created_at: '2026-09-26T10:00:00Z'
    })

    renderReviewsSection()

    fireEvent.click(screen.getByRole('button', { name: /escrever avaliação/i }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    // Seleciona 5 estrelas completas (nota 10)
    const rating5Stars = screen.getByLabelText('5 estrelas')
    fireEvent.click(rating5Stars)

    // Preenche Comentário
    const commentInput = screen.getByPlaceholderText(/o que achou da direção, fotografia/i)
    fireEvent.change(commentInput, {
      target: { value: 'Filme fantástico, recomendo para qualquer apreciador de boa arte.' }
    })

    // Submete
    const submitButton = screen.getByRole('button', { name: /publicar avaliação/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith('movie-123', {
        nome: 'Cinéfilo',
        nota: 10,
        comentario: 'Filme fantástico, recomendo para qualquer apreciador de boa arte.'
      })
    })
  })
})
