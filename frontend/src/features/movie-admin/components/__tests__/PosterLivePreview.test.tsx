import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PosterLivePreview } from '../PosterLivePreview'

describe('PosterLivePreview', () => {
  it('exibe placeholder cinematográfico quando nenhuma URL é fornecida', () => {
    render(<PosterLivePreview title="Filme Teste" releaseYear={2024} />)

    expect(screen.getByText('Prévia em Tempo Real')).toBeInTheDocument()
    expect(screen.getByText('Insira uma URL de pôster ao lado')).toBeInTheDocument()
    expect(screen.getByText('Filme Teste')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
  })

  it('renderiza a tag img quando uma URL válida de pôster é informada', () => {
    render(
      <PosterLivePreview
        urlPoster="https://image.tmdb.org/t/p/w500/sample.jpg"
        title="Oppenheimer"
        releaseYear={2023}
      />
    )

    const img = screen.getByRole('img', { name: 'Pôster de Oppenheimer' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/sample.jpg')
  })

  it('exibe feedback de erro gracioso quando o pôster falha ao carregar', () => {
    render(
      <PosterLivePreview
        urlPoster="https://broken-image-link.com/404.jpg"
        title="Filme Quebrado"
      />
    )

    const img = screen.getByRole('img', { name: 'Pôster de Filme Quebrado' })
    fireEvent.error(img)

    expect(screen.getByText('URL de pôster inacessível')).toBeInTheDocument()
    expect(screen.getByText('Verifique o link digitado')).toBeInTheDocument()
  })
})
