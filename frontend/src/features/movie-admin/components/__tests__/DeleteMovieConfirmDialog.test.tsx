import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DeleteMovieConfirmDialog } from '../DeleteMovieConfirmDialog'

describe('DeleteMovieConfirmDialog', () => {
  it('renderiza os textos de alerta com o título do filme destacado quando aberto', () => {
    render(
      <DeleteMovieConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        movieTitle="Interestelar"
        onConfirmDelete={vi.fn()}
      />
    )

    expect(screen.getByText('Excluir Filme do Catálogo?')).toBeInTheDocument()
    expect(screen.getAllByText(/"Interestelar"/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Excluir Definitivamente' })).toBeDisabled()
  })

  it('habilita o botão e chama onConfirmDelete quando o título exato é digitado', () => {
    const handleConfirm = vi.fn()
    render(
      <DeleteMovieConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        movieTitle="Interestelar"
        onConfirmDelete={handleConfirm}
      />
    )

    const confirmButton = screen.getByRole('button', { name: 'Excluir Definitivamente' })
    expect(confirmButton).toBeDisabled()

    const input = screen.getByPlaceholderText('Digite "Interestelar"')
    fireEvent.change(input, { target: { value: 'Interestelar' } })

    expect(confirmButton).toBeEnabled()
    fireEvent.click(confirmButton)

    expect(handleConfirm).toHaveBeenCalledTimes(1)
  })

  it('desabilita botões e exibe estado de loading durante a exclusão', () => {
    render(
      <DeleteMovieConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        movieTitle="Interestelar"
        onConfirmDelete={vi.fn()}
        isDeleting={true}
      />
    )

    expect(screen.getByText('Excluindo...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
  })
})
