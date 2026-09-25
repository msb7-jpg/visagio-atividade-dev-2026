import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { MovieListView } from '../MovieListView'
import { MovieListStatus } from '../MovieListStatus'

const MOCK_MATRIX = [
  {
    sk_movie_id: '1',
    id_filme: 'matrix',
    titulo: 'The Matrix',
    ano_lancamento: 1999,
    duracao_minutos: 136,
    sinopse: 'Neo',
    url_poster: null,
    url_backdrop: null,
    generos: ['Ação'],
    diretores: ['Lana'],
    produtoras: ['Warner'],
    popularidade: 90,
    nota_media_usuarios: 9,
    qtd_avaliacoes_usuarios: 100,
    nota_tmdb: 8.5,
    nota_imdb: 8.7,
    receita_usd: 1000,
    receita_brl: 5000
  }
]

describe('MovieListView empty/loading states', () => {
  it('renderiza skeleton em estado de carregamento', () => {
    const { container } = render(
      <MovieListView
        movies={[]}
        viewMode="grid"
        isLoading={true}
        isError={false}
        hasFilters={false}
      />
    )
    expect(container.getElementsByClassName('animate-pulse').length).toBeGreaterThan(0)
  })

  it('renderiza erro com EmptyState', () => {
    render(
      <MovieListView
        movies={[]}
        viewMode="grid"
        isLoading={false}
        isError={true}
        hasFilters={false}
      />
    )
    expect(screen.getByText('Erro ao carregar catálogo')).toBeDefined()
  })

  it('renderiza vazio com filtros ativos', () => {
    render(
      <MovieListView
        movies={[]}
        viewMode="grid"
        isLoading={false}
        isError={false}
        hasFilters={true}
      />
    )
    expect(screen.getByText('Nenhum filme encontrado')).toBeDefined()
  })
})

describe('MovieListView populated states', () => {
  it('renderiza lista em grid e em list quando há filmes', () => {
    const { rerender } = render(
      <BrowserRouter>
        <MovieListView
          movies={MOCK_MATRIX}
          viewMode="grid"
          isLoading={false}
          isError={false}
          hasFilters={false}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('The Matrix')).toBeDefined()

    rerender(
      <BrowserRouter>
        <MovieListView
          movies={MOCK_MATRIX}
          viewMode="list"
          isLoading={false}
          isError={false}
          hasFilters={false}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('The Matrix')).toBeDefined()
  })

  it('MovieListStatus retorna null quando não há status ativo', () => {
    const { container } = render(
      <MovieListStatus
        isLoading={false}
        isError={false}
        isEmpty={false}
        hasFilters={false}
        isGrid={true}
      />
    )
    expect(container.firstChild).toBeNull()
  })
})
