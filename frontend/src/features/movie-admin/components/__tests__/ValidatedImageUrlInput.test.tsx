import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ValidatedImageUrlInput } from '../ValidatedImageUrlInput'

describe('ValidatedImageUrlInput', () => {
  it('renderiza o input com valor e placeholder', () => {
    render(
      <ValidatedImageUrlInput
        value="https://image.tmdb.org/poster.jpg"
        onChange={vi.fn()}
        placeholder="URL do pôster"
      />
    )

    const input = screen.getByPlaceholderText('URL do pôster')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('https://image.tmdb.org/poster.jpg')
  })

  it('chama onChange ao digitar novo link', () => {
    const handleChange = vi.fn()
    render(
      <ValidatedImageUrlInput
        value=""
        onChange={handleChange}
        placeholder="URL do pôster"
      />
    )

    const input = screen.getByPlaceholderText('URL do pôster')
    fireEvent.change(input, { target: { value: 'https://cdn.image.org/sample.png' } })

    expect(handleChange).toHaveBeenCalledWith('https://cdn.image.org/sample.png')
  })

  it('exibe mensagem de erro quando repassada via prop error', () => {
    render(
      <ValidatedImageUrlInput
        value="link-invalido"
        onChange={vi.fn()}
        error="URL inválida"
      />
    )

    expect(screen.getByText('URL inválida')).toBeInTheDocument()
  })
})
