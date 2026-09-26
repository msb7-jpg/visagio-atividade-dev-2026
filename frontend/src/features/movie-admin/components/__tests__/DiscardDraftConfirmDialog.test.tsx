import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DiscardDraftConfirmDialog } from '../DiscardDraftConfirmDialog'

describe('DiscardDraftConfirmDialog', () => {
  it('renderiza título, aviso de perda de dados e botões de ação', () => {
    render(
      <DiscardDraftConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirmDiscard={vi.fn()}
      />
    )

    expect(screen.getByText('Descartar Rascunho?')).toBeInTheDocument()
    expect(screen.getByText('Alterações não salvas serão perdidas')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Continuar Editando/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Descartar Rascunho/i })).toBeInTheDocument()
  })

  it('chama onConfirmDiscard ao clicar no botão de descartar', () => {
    const handleConfirm = vi.fn()
    const handleOpenChange = vi.fn()

    render(
      <DiscardDraftConfirmDialog
        open={true}
        onOpenChange={handleOpenChange}
        onConfirmDiscard={handleConfirm}
      />
    )

    const discardBtn = screen.getByRole('button', { name: /Descartar Rascunho/i })
    fireEvent.click(discardBtn)

    expect(handleConfirm).toHaveBeenCalledTimes(1)
    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })

  it('chama onOpenChange(false) ao clicar em continuar editando', () => {
    const handleOpenChange = vi.fn()

    render(
      <DiscardDraftConfirmDialog
        open={true}
        onOpenChange={handleOpenChange}
        onConfirmDiscard={vi.fn()}
      />
    )

    const keepBtn = screen.getByRole('button', { name: /Continuar Editando/i })
    fireEvent.click(keepBtn)

    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })
})
