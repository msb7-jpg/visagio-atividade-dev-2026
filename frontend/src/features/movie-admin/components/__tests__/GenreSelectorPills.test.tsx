import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GenreSelectorPills } from '../GenreSelectorPills'

describe('GenreSelectorPills', () => {
  const genres = [
    { sk_genre_id: '1', nome_genero: 'Ação' },
    { sk_genre_id: '2', nome_genero: 'Drama' },
    { sk_genre_id: '3', nome_genero: 'Ficção Científica' }
  ]

  it('renderiza os botões de gêneros e indica seleção com aria-pressed e ícone de check', () => {
    const handleToggle = vi.fn()
    render(
      <GenreSelectorPills
        availableGenres={genres}
        selectedGenreIds={['1']}
        onToggleGenre={handleToggle}
      />
    )

    const acaoBtn = screen.getByRole('button', { name: /Ação/i })
    const dramaBtn = screen.getByRole('button', { name: /Drama/i })

    expect(acaoBtn).toHaveAttribute('aria-pressed', 'true')
    expect(dramaBtn).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(dramaBtn)
    expect(handleToggle).toHaveBeenCalledWith('2')
  })

  it('exibe mensagem de erro quando fornecida', () => {
    render(
      <GenreSelectorPills
        availableGenres={genres}
        selectedGenreIds={[]}
        onToggleGenre={vi.fn()}
        error="Selecione ao menos um gênero"
      />
    )

    expect(screen.getByText('Selecione ao menos um gênero')).toBeInTheDocument()
  })
})
