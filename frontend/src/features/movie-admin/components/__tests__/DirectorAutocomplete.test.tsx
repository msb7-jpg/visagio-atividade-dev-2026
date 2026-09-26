import { movieAdminApi } from '@/features/movie-admin/api/movieAdminApi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { DirectorAutocomplete } from '../DirectorAutocomplete'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('DirectorAutocomplete', () => {
  it('renderiza o input com o valor inicial e placeholder de diretores', () => {
    render(
      <DirectorAutocomplete
        value="Christopher Nolan"
        onChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )

    const input = screen.getByPlaceholderText(/Christopher Nolan/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('Christopher Nolan')
  })

  it('chama onChange ao digitar e exibe opção de cadastrar novo diretor', async () => {
    vi.spyOn(movieAdminApi, 'searchDirectors').mockResolvedValueOnce([
      { sk_person_id: 'p1', nome_pessoa: 'Denis Villeneuve', tipo_pessoa: 'Diretor' }
    ])

    const handleChange = vi.fn()
    render(
      <DirectorAutocomplete
        value="Quentin"
        onChange={handleChange}
      />,
      { wrapper: createWrapper() }
    )

    const input = screen.getByPlaceholderText(/Christopher Nolan/i)
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Quentin Tarantino' } })

    expect(handleChange).toHaveBeenCalledWith('Quentin Tarantino')

    await waitFor(() => {
      expect(screen.getByText(/Cadastrar novo diretor/i)).toBeInTheDocument()
    })
  })
})
