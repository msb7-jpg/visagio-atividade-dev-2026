import type { GenreItem } from '@/features/catalog/api/catalogApi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { MovieFormView } from '../MovieFormView'

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}

const mockGenres: GenreItem[] = [
  { sk_genre_id: 'g-1', nome_genero: 'Ação' },
  { sk_genre_id: 'g-2', nome_genero: 'Ficção Científica' },
  { sk_genre_id: 'g-3', nome_genero: 'Drama' }
]

describe('MovieFormView', () => {
  it('renderiza os campos principais e título em modo criação', () => {
    renderWithProviders(
      <MovieFormView
        mode="create"
        availableGenres={mockGenres}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    )

    expect(screen.getByRole('heading', { name: 'Cadastrar Filme' })).toBeInTheDocument()
    expect(screen.getByLabelText(/Título do Filme/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Diretor Principal/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Ano de Lançamento/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Duração/)).toBeInTheDocument()
    expect(screen.getByText('Ação')).toBeInTheDocument()
    expect(screen.getByText('Ficção Científica')).toBeInTheDocument()
  })

  it('renderiza dados pré-preenchidos em modo edição', () => {
    renderWithProviders(
      <MovieFormView
        mode="edit"
        initialValues={{
          titulo: 'Interestelar',
          diretor: 'Christopher Nolan',
          ano_lancamento: 2014,
          duracao_minutos: 169,
          sinopse: 'Uma viagem pelo buraco de minhoca.',
          generos_ids: ['g-2']
        }}
        availableGenres={mockGenres}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    )

    expect(screen.getByText('Editar Filme')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Interestelar')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Christopher Nolan')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2014')).toBeInTheDocument()
    expect(screen.getByDisplayValue('169')).toBeInTheDocument()
  })

  it('exibe erro de validação ao tentar submeter formulário sem título', async () => {
    const handleSubmit = vi.fn()
    renderWithProviders(
      <MovieFormView
        mode="create"
        availableGenres={mockGenres}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    )

    const submitBtn = screen.getByRole('button', { name: /Cadastrar Filme/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText('Título é obrigatório')).toBeInTheDocument()
    })
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('submete dados válidos chamando onSubmit', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined)
    renderWithProviders(
      <MovieFormView
        mode="create"
        availableGenres={mockGenres}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    )

    const titleInput = screen.getByLabelText(/Título do Filme/)
    fireEvent.change(titleInput, { target: { value: 'Duna: Parte 2' } })

    const directorInput = screen.getByLabelText(/Diretor Principal/)
    fireEvent.change(directorInput, { target: { value: 'Denis Villeneuve' } })

    // Seleciona um gênero
    const sciFiPill = screen.getByText('Ficção Científica')
    fireEvent.click(sciFiPill)

    const submitBtn = screen.getByRole('button', { name: /Cadastrar Filme/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        titulo: 'Duna: Parte 2',
        diretor: 'Denis Villeneuve',
        generos_ids: ['g-2']
      })
    )
  })

  it('chama onCancel quando o botão Cancelar é acionado', () => {
    const handleCancel = vi.fn()
    renderWithProviders(
      <MovieFormView
        mode="create"
        availableGenres={mockGenres}
        onSubmit={vi.fn()}
        onCancel={handleCancel}
      />
    )

    const cancelBtn = screen.getByRole('button', { name: 'Cancelar' })
    fireEvent.click(cancelBtn)

    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  it('exibe erro no formulário ao inserir URL de pôster inválida (como data URI ou formato sem http)', async () => {
    renderWithProviders(
      <MovieFormView
        mode="create"
        availableGenres={mockGenres}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    )

    const posterInput = screen.getByPlaceholderText('https://image.tmdb.org/t/p/w500/...')
    fireEvent.change(posterInput, {
      target: { value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }
    })

    await waitFor(() => {
      expect(
        screen.getByText('A URL do pôster deve começar com http:// ou https://')
      ).toBeInTheDocument()
    })
  })

  it('limpa o rascunho do localStorage após submissão bem-sucedida e não o recria ao desmontar', async () => {
    localStorage.setItem(
      'rocketfilms_movie_create_draft',
      JSON.stringify({ titulo: 'Filme Temporário' })
    )

    const handleSubmit = vi.fn().mockResolvedValue(undefined)
    const { unmount } = renderWithProviders(
      <MovieFormView
        mode="create"
        availableGenres={mockGenres}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    )

    const titleInput = screen.getByLabelText(/Título do Filme/)
    fireEvent.change(titleInput, { target: { value: 'Filme Submetido' } })

    const submitBtn = screen.getByRole('button', { name: /Cadastrar Filme/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })

    // Ao submeter com sucesso, o rascunho deve ter sido removido
    expect(localStorage.getItem('rocketfilms_movie_create_draft')).toBeNull()

    // Ao desmontar o formulário após a submissão, NÃO deve ressalvar no localStorage
    unmount()
    expect(localStorage.getItem('rocketfilms_movie_create_draft')).toBeNull()
  })

  it('não restaura o rascunho no unmount caso tenha ocorrido logout/limpeza externa de rascunho', async () => {
    localStorage.setItem(
      'rocketfilms_movie_create_draft',
      JSON.stringify({ titulo: 'Filme Digitado' })
    )

    const { unmount } = renderWithProviders(
      <MovieFormView
        mode="create"
        availableGenres={mockGenres}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    )

    // Simula logout chamando remoção externa e evento de draft-change
    act(() => {
      localStorage.removeItem('rocketfilms_movie_create_draft')
      window.dispatchEvent(new Event('rocketfilms:draft-change'))
    })

    // Desmonta componente (ex: transição de rota após logout)
    unmount()

    // O rascunho deve permanecer nulo
    expect(localStorage.getItem('rocketfilms_movie_create_draft')).toBeNull()
  })
})
