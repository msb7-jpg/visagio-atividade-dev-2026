import { useGenresQuery } from '@/features/catalog/hooks/useMoviesQuery'
import { MovieFormView } from '@/features/movie-admin/components/MovieFormView'
import { useCreateMovieMutation } from '@/features/movie-admin/hooks/useMovieAdminMutations'
import type { MovieFormSchemaValues } from '@/features/movie-admin/schemas/movie-form.schema'
import { clearMovieDraft, getMovieDraft } from '@/features/movie-admin/utils/movie-draft'
import { routes } from '@/routes/routes.types'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

export const MovieCreateContainer: React.FC = () => {
  const navigate = useNavigate()
  const { data: genresData } = useGenresQuery()
  const availableGenres = genresData || []

  const initialDraftValues = React.useMemo(() => getMovieDraft() || undefined, [])

  const [serverError, setServerError] = React.useState<string | null>(null)

  const createMutation = useCreateMovieMutation({
    onSuccess: () => {
      clearMovieDraft()
    },
    onError: (err) => {
      setServerError(err.message || 'Erro ao cadastrar o filme.')
    }
  })

  const handleSubmit = async (values: MovieFormSchemaValues) => {
    setServerError(null)
    await createMutation.mutateAsync({
      titulo: values.titulo,
      diretor: values.diretor || null,
      ano_lancamento: values.ano_lancamento,
      duracao_minutos: values.duracao_minutos,
      sinopse: values.sinopse || null,
      url_poster: values.url_poster || null,
      url_backdrop: values.url_backdrop || null,
      generos_ids: values.generos_ids
    })
    clearMovieDraft()
  }

  const handleCancel = () => {
    navigate(routes.home())
  }

  return (
    <MovieFormView
      mode="create"
      initialValues={initialDraftValues}
      availableGenres={availableGenres}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={createMutation.isPending}
      serverError={serverError}
    />
  )
}
