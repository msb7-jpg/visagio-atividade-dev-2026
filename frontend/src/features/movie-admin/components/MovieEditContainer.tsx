import { Button } from '@/components/ui/button'
import { useGenresQuery } from '@/features/catalog/hooks/useMoviesQuery'
import { MovieFormView } from '@/features/movie-admin/components/MovieFormView'
import { useUpdateMovieMutation } from '@/features/movie-admin/hooks/useMovieAdminMutations'
import type { MovieFormSchemaValues } from '@/features/movie-admin/schemas/movie-form.schema'
import type { MovieAdminFormValues } from '@/features/movie-admin/types/movie-admin.types'
import { useMovieDetailsQuery } from '@/features/movie-details/hooks/useMovieDetailsQuery'
import { routes } from '@/routes/routes.types'
import { Loader2 } from 'lucide-react'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const MovieEditContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: movie, isLoading, isError } = useMovieDetailsQuery(id)
  const { data: genresData } = useGenresQuery()
  const availableGenres = genresData || []

  const [serverError, setServerError] = React.useState<string | null>(null)

  const updateMutation = useUpdateMovieMutation({
    onError: (err) => {
      setServerError(err.message || 'Erro ao atualizar o filme.')
    }
  })

  const initialValues: Partial<MovieAdminFormValues> | undefined = React.useMemo(() => {
    if (!movie) return undefined

    const director = movie.diretores?.[0]?.nome_pessoa || ''
    const genreIds = movie.generos?.map((g) => g.sk_genre_id) || []

    return {
      titulo: movie.titulo,
      diretor: director,
      ano_lancamento: movie.ano_lancamento || new Date().getFullYear(),
      duracao_minutos: movie.duracao_minutos,
      sinopse: movie.sinopse || '',
      url_poster: movie.url_poster || '',
      url_backdrop: movie.url_backdrop || '',
      generos_ids: genreIds
    }
  }, [movie])

  const handleSubmit = async (values: MovieFormSchemaValues) => {
    if (!id) return
    setServerError(null)
    await updateMutation.mutateAsync({
      movieId: id,
      payload: {
        titulo: values.titulo,
        diretor: values.diretor || null,
        ano_lancamento: values.ano_lancamento,
        duracao_minutos: values.duracao_minutos,
        sinopse: values.sinopse || null,
        url_poster: values.url_poster || null,
        url_backdrop: values.url_backdrop || null,
        generos_ids: values.generos_ids
      }
    })
  }

  const handleCancel = () => {
    if (id) {
      navigate(routes.movieDetail(id), { replace: true })
    } else {
      navigate(routes.home(), { replace: true })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground">Carregando dados do filme...</span>
      </div>
    )
  }

  if (isError || !movie) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h2 className="text-xl font-bold text-white">Filme não encontrado</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O filme solicitado não pôde ser recuperado para edição.
        </p>
        <Button
          size="sm"
          onClick={handleCancel}
          className="mt-4"
        >
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <MovieFormView
      mode="edit"
      initialValues={initialValues}
      availableGenres={availableGenres}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={updateMutation.isPending}
      serverError={serverError}
    />
  )
}
