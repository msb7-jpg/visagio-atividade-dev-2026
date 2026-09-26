import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MovieDetailsContainer } from '../MovieDetailsContainer'
import * as vmModule from '@/features/movie-details/hooks/useMovieDetailsViewModel'
import type { MovieDetailDTO } from '@/features/movie-details/types/movie-details.types'

const mockMovie: MovieDetailDTO = {
  sk_movie_id: 'test-sk-1',
  id_filme: 'test-1',
  titulo: 'Interstellar Odyssey',
  data_lancamento: '2014-11-07',
  ano_lancamento: 2014,
  duracao_minutos: 169,
  status_filme: 'Released',
  sinopse: 'Uma jornada através das estrelas para salvar a humanidade.',
  url_poster: 'https://image.tmdb.org/t/p/w500/poster.jpg',
  url_backdrop: 'https://image.tmdb.org/t/p/w1280/backdrop.jpg',
  generos: [{ sk_genre_id: '1', nome_genero: 'Ficção Científica' }],
  produtoras: [{ sk_company_id: '1', nome_produtora: 'Syncopy' }],
  diretores: [{ sk_person_id: '1', nome_pessoa: 'Christopher Nolan', tipo_pessoa: 'Diretor' }],
  roteiristas: [{ sk_person_id: '2', nome_pessoa: 'Jonathan Nolan', tipo_pessoa: 'Roteirista' }],
  atores: [{ sk_person_id: '3', nome_pessoa: 'Matthew McConaughey', tipo_pessoa: 'Ator' }],
  metricas: {
    orcamento_usd: 165000000,
    receita_usd: 701729206,
    lucro_usd: 536729206,
    orcamento_brl: 825000000,
    receita_brl: 3508646030,
    lucro_brl: 2683646030,
    roi_percentual: 325.3,
    popularidade: 185.5,
    nota_tmdb: 8.6,
    qtd_tmdb: 32000,
    nota_imdb: 8.7,
    qtd_imdb: 1900000
  },
  nota_media_usuarios: 9.3,
  qtd_avaliacoes_usuarios: 42
}

describe('MovieDetailsContainer', () => {
  it('exibe o skeleton enquanto estiver carregando', () => {
    vi.spyOn(vmModule, 'useMovieDetailsViewModel').mockReturnValue({
      movie: undefined,
      isLoading: true,
      isError: false,
      errorMessage: undefined,
      handleBack: vi.fn(),
      handleGoHome: vi.fn()
    })

    render(<MovieDetailsContainer />)
    expect(screen.getByTestId('movie-details-skeleton')).toBeInTheDocument()
  })

  it('exibe o estado de erro quando houver falha na busca', () => {
    vi.spyOn(vmModule, 'useMovieDetailsViewModel').mockReturnValue({
      movie: undefined,
      isLoading: false,
      isError: true,
      errorMessage: 'Não foi possível encontrar o filme especificado',
      handleBack: vi.fn(),
      handleGoHome: vi.fn()
    })

    render(<MovieDetailsContainer />)
    expect(screen.getByText('Filme não encontrado')).toBeInTheDocument()
    expect(
      screen.getByText('Não foi possível encontrar o filme especificado')
    ).toBeInTheDocument()
    expect(screen.getByText('Voltar ao Catálogo de Filmes')).toBeInTheDocument()
  })

  it('renderiza os dados completos do filme com sucesso', () => {
    vi.spyOn(vmModule, 'useMovieDetailsViewModel').mockReturnValue({
      movie: mockMovie,
      isLoading: false,
      isError: false,
      errorMessage: undefined,
      handleBack: vi.fn(),
      handleGoHome: vi.fn()
    })

    render(<MovieDetailsContainer />)
    expect(screen.getByText('Interstellar Odyssey')).toBeInTheDocument()
    expect(screen.getByText('Ficção Científica')).toBeInTheDocument()
    expect(screen.getByText('Christopher Nolan')).toBeInTheDocument()
    expect(screen.getByText('Matthew McConaughey')).toBeInTheDocument()
    expect(screen.getByText('Syncopy')).toBeInTheDocument()
    expect(screen.getByText('9.3')).toBeInTheDocument()
  })
})
