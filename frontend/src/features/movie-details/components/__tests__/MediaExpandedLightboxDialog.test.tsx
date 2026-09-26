import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MediaExpandedLightboxDialog } from '../MediaExpandedLightboxDialog'

describe('MediaExpandedLightboxDialog', () => {
  it('renderiza o título, galeria de artes e imagem do pôster quando aberto', () => {
    render(
      <MediaExpandedLightboxDialog
        open={true}
        onOpenChange={vi.fn()}
        titulo="Interestelar"
        urlPoster="https://image.tmdb.org/poster.jpg"
        urlBackdrop="https://image.tmdb.org/backdrop.jpg"
      />
    )

    expect(screen.getByText('Interestelar')).toBeInTheDocument()
    expect(screen.getByText(/Galeria de Artes/i)).toBeInTheDocument()
    expect(screen.getByText('1 de 2')).toBeInTheDocument()
    expect(screen.getByAltText('Pôster expandido de Interestelar')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Backdrop/i })).toBeInTheDocument()
  })

  it('permite alternar entre pôster e backdrop através dos botões de miniatura', () => {
    render(
      <MediaExpandedLightboxDialog
        open={true}
        onOpenChange={vi.fn()}
        titulo="Interestelar"
        urlPoster="https://image.tmdb.org/poster.jpg"
        urlBackdrop="https://image.tmdb.org/backdrop.jpg"
      />
    )

    const backdropBtn = screen.getByRole('button', { name: /Ver backdrop/i })
    fireEvent.click(backdropBtn)

    expect(screen.getByAltText('Backdrop expandido de Interestelar')).toBeInTheDocument()
    expect(screen.getByText('2 de 2')).toBeInTheDocument()

    const posterBtn = screen.getByRole('button', { name: /Ver pôster/i })
    fireEvent.click(posterBtn)

    expect(screen.getByAltText('Pôster expandido de Interestelar')).toBeInTheDocument()
    expect(screen.getByText('1 de 2')).toBeInTheDocument()
  })

  it('permite alternar entre imagens através dos botões laterais de seta', () => {
    render(
      <MediaExpandedLightboxDialog
        open={true}
        onOpenChange={vi.fn()}
        titulo="Interestelar"
        urlPoster="https://image.tmdb.org/poster.jpg"
        urlBackdrop="https://image.tmdb.org/backdrop.jpg"
      />
    )

    const nextBtn = screen.getByRole('button', { name: /Próxima imagem/i })
    fireEvent.click(nextBtn)

    expect(screen.getByAltText('Backdrop expandido de Interestelar')).toBeInTheDocument()

    const prevBtn = screen.getByRole('button', { name: /Imagem anterior/i })
    fireEvent.click(prevBtn)

    expect(screen.getByAltText('Pôster expandido de Interestelar')).toBeInTheDocument()
  })

  it('permite alternar imagens via teclas de seta do teclado', () => {
    render(
      <MediaExpandedLightboxDialog
        open={true}
        onOpenChange={vi.fn()}
        titulo="Interestelar"
        urlPoster="https://image.tmdb.org/poster.jpg"
        urlBackdrop="https://image.tmdb.org/backdrop.jpg"
      />
    )

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByAltText('Backdrop expandido de Interestelar')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByAltText('Pôster expandido de Interestelar')).toBeInTheDocument()
  })
})
