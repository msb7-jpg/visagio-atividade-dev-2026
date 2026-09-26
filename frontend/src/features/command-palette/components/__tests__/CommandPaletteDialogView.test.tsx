import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommandPaletteDialogView } from '../CommandPaletteDialogView'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  })

describe('CommandPaletteDialogView', () => {
  it('abre sem erro de cmdk subscribe e renderiza o input de busca', () => {
    const queryClient = createTestQueryClient()
    const handleOpenChange = vi.fn()
    const handleSelectMovie = vi.fn()
    const handleSelectAction = vi.fn()

    render(
      <QueryClientProvider client={queryClient}>
        <CommandPaletteDialogView
          isOpen={true}
          onOpenChange={handleOpenChange}
          onSelectMovie={handleSelectMovie}
          onSelectAction={handleSelectAction}
        />
      </QueryClientProvider>
    )

    const input = screen.getByPlaceholderText(/Busque filmes pelo título ou navegue por atalhos/)
    expect(input).toBeDefined()
    expect(screen.getByText('Navegar')).toBeDefined()
    expect(screen.getByText('Selecionar')).toBeDefined()
  })
})
