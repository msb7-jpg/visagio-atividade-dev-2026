import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StarRatingInput } from '../StarRatingInput'

describe('StarRatingInput', () => {
  it('renders 5 stars and displays current score correctly on 0 to 10 scale', () => {
    render(<StarRatingInput value={7.0} />)

    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    expect(screen.getByText('7.0')).toBeInTheDocument()
    expect(screen.getByText('/ 10')).toBeInTheDocument()
  })

  it('triggers onChange with 0 when clicking on the currently selected score', () => {
    const handleChange = vi.fn()
    render(<StarRatingInput value={1} onChange={handleChange} />)

    const halfStarButton = screen.getByLabelText('0.5 estrelas')
    fireEvent.click(halfStarButton)

    expect(handleChange).toHaveBeenCalledWith(0)
  })

  it('triggers onChange with half star value (1.0 for 0.5 stars)', () => {
    const handleChange = vi.fn()
    render(<StarRatingInput value={0} onChange={handleChange} />)

    const halfStarButton = screen.getByLabelText('0.5 estrelas')
    fireEvent.click(halfStarButton)

    expect(handleChange).toHaveBeenCalledWith(1)
  })

  it('triggers onChange with full star value (2.0 for 1.0 stars)', () => {
    const handleChange = vi.fn()
    render(<StarRatingInput value={0} onChange={handleChange} />)

    const fullStarButton = screen.getByLabelText('1 estrelas')
    fireEvent.click(fullStarButton)

    expect(handleChange).toHaveBeenCalledWith(2)
  })

  it('triggers onChange with 4.5 stars (9.0)', () => {
    const handleChange = vi.fn()
    render(<StarRatingInput value={0} onChange={handleChange} />)

    const fourAndHalfStarButton = screen.getByLabelText('4.5 estrelas')
    fireEvent.click(fourAndHalfStarButton)

    expect(handleChange).toHaveBeenCalledWith(9)
  })

  it('does not allow clicks when disabled', () => {
    const handleChange = vi.fn()
    render(<StarRatingInput value={4} onChange={handleChange} disabled />)

    expect(screen.queryByLabelText('0.5 estrelas')).not.toBeInTheDocument()
  })

  it('displays error message when provided', () => {
    render(<StarRatingInput value={0} error="Selecione uma nota válida" />)

    expect(screen.getByText('Selecione uma nota válida')).toBeInTheDocument()
  })

  it('renders help tooltip button and shows instructions on hover', async () => {
    render(<StarRatingInput value={5} />)

    const helpButton = screen.getByRole('button', { name: /como funciona a avaliação/i })
    expect(helpButton).toBeInTheDocument()

    // Hover sobre o botão de ajuda
    fireEvent.mouseEnter(helpButton)

    expect(await screen.findByText(/como classificar:/i)).toBeInTheDocument()
    expect(screen.getByText(/deslize sobre as estrelas para ajustar a nota de 0 a 10/i)).toBeInTheDocument()
    expect(screen.getByText(/clique no lado esquerdo ou direito de cada estrela/i)).toBeInTheDocument()
    expect(screen.getByText(/arraste para fora à esquerda ou clique na mesma nota/i)).toBeInTheDocument()
  })

  it('hides help tooltip button when readOnly or disabled or showTooltip=false', () => {
    const { rerender } = render(<StarRatingInput value={5} readOnly />)
    expect(screen.queryByRole('button', { name: /como funciona a avaliação/i })).not.toBeInTheDocument()

    rerender(<StarRatingInput value={5} disabled />)
    expect(screen.queryByRole('button', { name: /como funciona a avaliação/i })).not.toBeInTheDocument()

    rerender(<StarRatingInput value={5} showTooltip={false} />)
    expect(screen.queryByRole('button', { name: /como funciona a avaliação/i })).not.toBeInTheDocument()
  })
})
