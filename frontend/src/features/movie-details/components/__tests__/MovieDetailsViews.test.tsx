import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MovieBackdropHeroView } from '../MovieBackdropHeroView'
import { MovieHeaderInfoView } from '../MovieHeaderInfoView'
import { MovieSynopsisView } from '../MovieSynopsisView'
import { ScoreComparisonView } from '../ScoreComparisonView'
import { FinancialMetricsView } from '../FinancialMetricsView'
import { CastAndCrewSectionView } from '../CastAndCrewSectionView'

describe('Movie Details Pure Views', () => {
  it('MovieBackdropHeroView exibe imagem de fundo quando fornecida', () => {
    render(
      <MovieBackdropHeroView
        urlBackdrop="https://image.tmdb.org/t/p/w1280/backdrop.jpg"
        titulo="Inception"
      />
    )
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w1280/backdrop.jpg')
  })

  it('MovieBackdropHeroView exibe fallback quando urlBackdrop for nulo', () => {
    render(<MovieBackdropHeroView urlBackdrop={null} titulo="Inception" />)
    expect(screen.getByTestId('backdrop-fallback')).toBeInTheDocument()
  })

  it('MovieHeaderInfoView renderiza título, duração e badges de gêneros', () => {
    render(
      <MovieHeaderInfoView
        titulo="Interestelar"
        anoLancamento={2014}
        duracaoMinutos={169}
        statusFilme="Released"
        urlPoster="https://image.tmdb.org/t/p/w500/poster.jpg"
        generos={[
          { sk_genre_id: '1', nome_genero: 'Ficção Científica' },
          { sk_genre_id: '2', nome_genero: 'Drama' }
        ]}
      />
    )

    expect(screen.getByText('Interestelar')).toBeInTheDocument()
    expect(screen.getByText('2h 49m')).toBeInTheDocument()
    expect(screen.getByText('2014')).toBeInTheDocument()
    expect(screen.getByText('Ficção Científica')).toBeInTheDocument()
    expect(screen.getByText('Drama')).toBeInTheDocument()
  })

  it('ScoreComparisonView exibe scores de RocketFilms, TMDb, IMDb e popularidade', () => {
    render(
      <ScoreComparisonView
        notaMediaUsuarios={9.2}
        qtdAvaliacoesUsuarios={42}
        notaTmdb={8.6}
        qtdTmdb={32000}
        notaImdb={8.7}
        qtdImdb={1900000}
        popularidade={185.5}
      />
    )

    expect(screen.getByText('9.2')).toBeInTheDocument()
    expect(screen.getByText('42 avaliações')).toBeInTheDocument()
    expect(screen.getByText('8.6')).toBeInTheDocument()
    expect(screen.getByText('8.7')).toBeInTheDocument()
    expect(screen.getByText('185.5')).toBeInTheDocument()
  })

  it('FinancialMetricsView calcula ROI e exibe valores formatados', () => {
    render(
      <FinancialMetricsView
        metricas={{
          orcamento_usd: 165000000,
          receita_usd: 701729206,
          lucro_usd: 536729206,
          orcamento_brl: 825000000,
          receita_brl: 3508646030,
          lucro_brl: 2683646030,
          roi_percentual: 325.29,
          popularidade: 185.5,
          nota_tmdb: 8.6,
          qtd_tmdb: 32000,
          nota_imdb: 8.7,
          qtd_imdb: 1900000
        }}
      />
    )

    expect(screen.getByText(/ROI: \+325.3%/)).toBeInTheDocument()
    expect(screen.getByText('$165M')).toBeInTheDocument()
    expect(screen.getByText('$701.7M')).toBeInTheDocument()
  })

  it('CastAndCrewSectionView exibe diretores, roteiristas e atores', () => {
    render(
      <CastAndCrewSectionView
        diretores={[{ sk_person_id: '1', nome_pessoa: 'Christopher Nolan', tipo_pessoa: 'Diretor' }]}
        roteiristas={[{ sk_person_id: '2', nome_pessoa: 'Jonathan Nolan', tipo_pessoa: 'Roteirista' }]}
        atores={[{ sk_person_id: '3', nome_pessoa: 'Matthew McConaughey', tipo_pessoa: 'Ator' }]}
        produtoras={[{ sk_company_id: '1', nome_produtora: 'Syncopy' }]}
      />
    )

    expect(screen.getByText('Christopher Nolan')).toBeInTheDocument()
    expect(screen.getByText('Jonathan Nolan')).toBeInTheDocument()
    expect(screen.getByText('Matthew McConaughey')).toBeInTheDocument()
    expect(screen.getByText('Syncopy')).toBeInTheDocument()
  })

  it('MovieSynopsisView não renderiza se a sinopse for nula', () => {
    const { container } = render(<MovieSynopsisView sinopse={null} />)
    expect(container.firstChild).toBeNull()
  })
})
