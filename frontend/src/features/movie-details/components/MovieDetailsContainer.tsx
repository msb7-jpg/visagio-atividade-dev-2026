import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { DeleteMovieConfirmDialog } from '@/features/movie-admin/components/DeleteMovieConfirmDialog'
import { useDeleteMovieMutation } from '@/features/movie-admin/hooks/useMovieAdminMutations'
import { CastAndCrewSectionView } from '@/features/movie-details/components/CastAndCrewSectionView'
import { FinancialMetricsView } from '@/features/movie-details/components/FinancialMetricsView'
import { MediaExpandedLightboxDialog } from '@/features/movie-details/components/MediaExpandedLightboxDialog'
import { MovieBackdropHeroView } from '@/features/movie-details/components/MovieBackdropHeroView'
import { MovieDetailsErrorState } from '@/features/movie-details/components/MovieDetailsErrorState'
import { MovieDetailsSkeleton } from '@/features/movie-details/components/MovieDetailsSkeleton'
import { MovieHeaderInfoView } from '@/features/movie-details/components/MovieHeaderInfoView'
import { MovieSynopsisView } from '@/features/movie-details/components/MovieSynopsisView'
import { ScoreComparisonView } from '@/features/movie-details/components/ScoreComparisonView'
import { useMovieDetailsViewModel } from '@/features/movie-details/hooks/useMovieDetailsViewModel'
import { ReviewsSectionContainer } from '@/features/reviews/components/ReviewsSectionContainer'
import { routes } from '@/routes/routes.types'
import { PencilLine, Trash2 } from 'lucide-react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

export function MovieDetailsContainer() {
  const vm = useMovieDetailsViewModel()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [lightboxMedia, setLightboxMedia] = React.useState<'poster' | 'backdrop' | null>(null)

  const deleteMutation = useDeleteMovieMutation({
    onSuccess: () => {
      setIsDeleteDialogOpen(false)
    }
  })

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
          onExpandPoster={() => setLightboxMedia('poster')}
          adminActions={
            isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(routes.adminMovieEdit(movie.sk_movie_id))}
                  aria-label="Editar este filme"
                >
                  <PencilLine className="size-3.5 text-white/40" />
                  <span>Editar Filme</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  aria-label="Excluir este filme"
                >
                  <Trash2 className="size-3.5" />
                  <span>Excluir</span>
                </Button>
              </div>
            ) : null
          }
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

        <ReviewsSectionContainer
          movieId={movie.sk_movie_id}
          movieTitle={movie.titulo}
          notaMediaUsuarios={movie.nota_media_usuarios}
          qtdAvaliacoesUsuarios={movie.qtd_avaliacoes_usuarios}
        />
      </div>

      <DeleteMovieConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        movieTitle={movie.titulo}
        onConfirmDelete={() => {
          deleteMutation.mutate(movie.sk_movie_id)
        }}
        isDeleting={deleteMutation.isPending}
      />

      <MediaExpandedLightboxDialog
        open={Boolean(lightboxMedia)}
        onOpenChange={(open) => {
          if (!open) {
            setLightboxMedia(null)
          }
        }}
        titulo={movie.titulo}
        urlPoster={movie.url_poster}
        urlBackdrop={movie.url_backdrop}
        defaultMedia={lightboxMedia || 'poster'}
      />
    </article>
  )
}
