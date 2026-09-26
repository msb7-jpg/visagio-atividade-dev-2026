import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StarRatingInput } from '../StarRatingInput'

describe('StarRatingInput', () => {
  it('renders 5 stars and displays current score correctly', () => {
    render(<StarRatingInput value={7.0} />)

    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    expect(screen.getByText('3.5 ★')).toBeInTheDocument()
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
})
