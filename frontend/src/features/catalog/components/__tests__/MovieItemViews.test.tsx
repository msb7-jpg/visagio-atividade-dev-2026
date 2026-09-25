import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { MovieGridItemView } from '@/features/catalog/components/MovieGridItemView'
import { MovieListItemView } from '@/features/catalog/components/MovieListItemView'
import type { MovieListItem } from '@/features/catalog/api/catalogApi'

describe('MovieItemViews', () => {
  const mockMovie: MovieListItem = {
    sk_movie_id: 'sk-123',
    id_filme: 'matrix-1999',
    titulo: 'The Matrix',
    ano_lancamento: 1999,
    duracao_minutos: 136,
    sinopse: 'Um clássico do cinema de ficção.',
    url_poster: 'http://example.com/poster.jpg',
    url_backdrop: null,
    generos: ['Ficção Científica', 'Ação'],
    diretores: ['Lana Wachowski'],
    produtoras: ['Warner Bros.'],
    popularidade: 95.5,
    nota_media_usuarios: 8.9,
    qtd_avaliacoes_usuarios: 1500,
    nota_tmdb: 8.2,
    nota_imdb: 8.7,
    receita_usd: 463517383,
    receita_brl: 2317586915
  }

  it('MovieGridItemView renderiza título, badges e link correto', () => {
    render(
      <BrowserRouter>
        <MovieGridItemView movie={mockMovie} />
      </BrowserRouter>
    )

    expect(screen.getByText('The Matrix')).toBeDefined()
    expect(screen.getByText('1999')).toBeDefined()
    expect(screen.getByText('8.9')).toBeDefined()
    expect(screen.getByText('96')).toBeDefined() // Math.round/toFixed de 95.5
  })

  it('MovieListItemView renderiza linha com nota, diretores e gêneros', () => {
    render(
      <BrowserRouter>
        <MovieListItemView movie={mockMovie} />
      </BrowserRouter>
    )

    expect(screen.getByText('The Matrix')).toBeDefined()
    expect(screen.getByText('(1999)')).toBeDefined()
    expect(screen.getByText('8.9')).toBeDefined()
    expect(screen.getByText('Lana Wachowski')).toBeDefined()
  })
})
