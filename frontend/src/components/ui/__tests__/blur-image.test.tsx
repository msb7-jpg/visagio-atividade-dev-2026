import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BlurImage } from '../blur-image'

describe('BlurImage component', () => {
  it('renderiza a imagem com classe blur inicial e transiciona ao carregar', () => {
    render(<BlurImage src="https://example.com/poster.jpg" alt="Pôster Teste" />)

    const img = screen.getByRole('img', { name: 'Pôster Teste' })
    expect(img).toBeDefined()
    expect(img.className).toContain('blur-md')

    // Dispara evento onLoad da imagem
    fireEvent.load(img)

    expect(img.className).toContain('blur-0')
    expect(img.className).toContain('opacity-100')
  })

  it('exibe fallback quando a url for nula ou falhar ao carregar', () => {
    const { rerender } = render(<BlurImage src={null} alt="Sem Imagem" />)

    expect(screen.getByText('Sem imagem')).toBeDefined()

    // Testa quando dispara erro de carregamento
    rerender(<BlurImage src="https://example.com/error.jpg" alt="Imagem com Erro" />)
    const img = screen.getByRole('img', { name: 'Imagem com Erro' })
    fireEvent.error(img)

    expect(screen.getByText('Sem imagem')).toBeDefined()
  })
})
