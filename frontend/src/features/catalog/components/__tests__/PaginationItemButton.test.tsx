import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PaginationItemButton } from '../PaginationItemButton'

describe('PaginationItemButton', () => {
  it('renderiza reticências corretamente', () => {
    render(
      <PaginationItemButton
        page="..."
        isEllipsisStart={true}
        currentPage={1}
        onPageChange={vi.fn()}
      />
    )
    expect(screen.getByText('...')).toBeDefined()
  })

  it('renderiza botão numérico ativo e dispara evento de clique', () => {
    const handlePageChange = vi.fn()
    render(
      <PaginationItemButton
        page={3}
        isEllipsisStart={false}
        currentPage={3}
        onPageChange={handlePageChange}
      />
    )

    const btn = screen.getByText('3')
    expect(btn).toBeDefined()
    fireEvent.click(btn)
    expect(handlePageChange).toHaveBeenCalledWith(3)
  })
})
