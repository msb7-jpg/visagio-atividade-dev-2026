import { CastAndCrewSectionView } from '@/features/movie-details/components/CastAndCrewSectionView'
import { FinancialMetricsView } from '@/features/movie-details/components/FinancialMetricsView'
import { MovieBackdropHeroView } from '@/features/movie-details/components/MovieBackdropHeroView'
import { MovieDetailsErrorState } from '@/features/movie-details/components/MovieDetailsErrorState'
import { MovieDetailsSkeleton } from '@/features/movie-details/components/MovieDetailsSkeleton'
import { MovieHeaderInfoView } from '@/features/movie-details/components/MovieHeaderInfoView'
import { MovieSynopsisView } from '@/features/movie-details/components/MovieSynopsisView'
import { ScoreComparisonView } from '@/features/movie-details/components/ScoreComparisonView'
import { useMovieDetailsViewModel } from '@/features/movie-details/hooks/useMovieDetailsViewModel'

export function MovieDetailsContainer() {
  const vm = useMovieDetailsViewModel()

  if (vm.isLoading) {
    return <MovieDetailsSkeleton />
  }

  if (vm.isError || !vm.movie) {
    return (
      <MovieDetailsErrorState
        errorMessage={vm.errorMessage}
        onGoHome={vm.handleGoHome}
      />
    )
  }

  const { movie } = vm

  return (
    <article className="min-h-screen pb-16">
      <MovieBackdropHeroView
        urlBackdrop={movie.url_backdrop}
        titulo={movie.titulo}
      />

      <div className="relative z-10 mx-auto -mt-24 max-w-6xl space-y-6 px-4 sm:-mt-32 sm:px-6 md:-mt-40 lg:px-8">
        <MovieHeaderInfoView
          titulo={movie.titulo}
          anoLancamento={movie.ano_lancamento}
          duracaoMinutos={movie.duracao_minutos}
          statusFilme={movie.status_filme}
          urlPoster={movie.url_poster}
          generos={movie.generos}
          onBack={vm.handleBack}
        >
          <ScoreComparisonView
            notaMediaUsuarios={movie.nota_media_usuarios}
            qtdAvaliacoesUsuarios={movie.qtd_avaliacoes_usuarios}
            notaTmdb={movie.metricas.nota_tmdb}
            qtdTmdb={movie.metricas.qtd_tmdb}
            notaImdb={movie.metricas.nota_imdb}
            qtdImdb={movie.metricas.qtd_imdb}
            popularidade={movie.metricas.popularidade}
          />

          <FinancialMetricsView metricas={movie.metricas} />
        </MovieHeaderInfoView>

        <MovieSynopsisView sinopse={movie.sinopse} />

        <CastAndCrewSectionView
          diretores={movie.diretores}
          roteiristas={movie.roteiristas}
          atores={movie.atores}
          produtoras={movie.produtoras}
        />
      </div>
    </article>
  )
}
