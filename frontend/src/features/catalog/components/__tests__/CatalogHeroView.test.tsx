import { SearchVisibilityProvider } from '@/context/useSearchVisibility'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CatalogHeroView } from '../CatalogHeroView'

describe('CatalogHeroView', () => {
  it('permite digitar termo de busca e disparar onSearchChange com debounce', () => {
    vi.useFakeTimers()
    const handleSearchChange = vi.fn()
    const handleOpenCommandPalette = vi.fn()

    render(
      <SearchVisibilityProvider>
        <CatalogHeroView
          initialSearch=""
          onSearchChange={handleSearchChange}
          onOpenCommandPalette={handleOpenCommandPalette}
        />
      </SearchVisibilityProvider>
    )

    const input = screen.getByPlaceholderText(/Digite o título do filme/)
    fireEvent.change(input, { target: { value: 'Inception' } })

    expect(handleSearchChange).not.toHaveBeenCalledWith('Inception')

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(handleSearchChange).toHaveBeenCalledWith('Inception')
    vi.useRealTimers()
  })

  it('exibe indicador visual de busca ativa quando isFetching for true', () => {
    const { container } = render(
      <SearchVisibilityProvider>
        <CatalogHeroView
          initialSearch="Matrix"
          onSearchChange={vi.fn()}
          onOpenCommandPalette={vi.fn()}
          isFetching={true}
        />
      </SearchVisibilityProvider>
    )

    expect(container.querySelector('.animate-spin')).not.toBeNull()
  })

  it('limpa o campo e chama onSearchChange com string vazia ao clicar no botão X', () => {
    const handleSearchChange = vi.fn()

    render(
      <SearchVisibilityProvider>
        <CatalogHeroView
          initialSearch="Interestelar"
          onSearchChange={handleSearchChange}
          onOpenCommandPalette={vi.fn()}
        />
      </SearchVisibilityProvider>
    )

    const clearBtn = screen.getByLabelText('Limpar busca')
    fireEvent.click(clearBtn)

    expect(handleSearchChange).toHaveBeenCalledWith('')
  })

  it('dispara onOpenCommandPalette ao clicar no botão ⌘K', () => {
    const handleOpenCommandPalette = vi.fn()

    render(
      <SearchVisibilityProvider>
        <CatalogHeroView
          initialSearch=""
          onSearchChange={vi.fn()}
          onOpenCommandPalette={handleOpenCommandPalette}
        />
      </SearchVisibilityProvider>
    )

    const cmdkBtn = screen.getByRole('button', { name: /⌘k/i })
    fireEvent.click(cmdkBtn)

    expect(handleOpenCommandPalette).toHaveBeenCalledTimes(1)
  })
})
