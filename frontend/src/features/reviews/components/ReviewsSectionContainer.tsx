import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { NewReviewModalView } from '@/features/reviews/components/NewReviewModalView'
import { ReviewExpandableCardView } from '@/features/reviews/components/ReviewExpandableCardView'
import {
  useMovieReviewsQuery,
  useSubmitMovieReviewMutation,
  useUpdateMovieReviewMutation
} from '@/features/reviews/hooks/useMovieReviews'
import { useUserMovieReview } from '@/features/reviews/hooks/useUserMovieReview'
import type { ReviewFormValues } from '@/features/reviews/schemas/review.schema'
import type { MovieReviewDTO } from '@/features/reviews/types/reviews.types'
import { MessageSquarePlus, PencilLine, Star } from 'lucide-react'
import { useState } from 'react'

interface ReviewsSectionContainerProps {
  movieId: string
  movieTitle: string
  notaMediaUsuarios?: number | null
  qtdAvaliacoesUsuarios?: number
}

export function ReviewsSectionContainer({
  movieId,
  movieTitle,
  notaMediaUsuarios,
  qtdAvaliacoesUsuarios = 0
}: ReviewsSectionContainerProps) {
  const { user } = useAuth()
  const authorName = user?.nome || 'Cinéfilo'

  const { userReview, hasReviewed, recordReview } = useUserMovieReview(movieId)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [activeReviewId, setActiveReviewId] = useState<string | undefined>(undefined)
  const [initialModalValues, setInitialModalValues] = useState<{
    nota?: number
    comentario?: string | null
    nome?: string
  }>({})

  const { data: reviews = [], isLoading } = useMovieReviewsQuery(movieId)

  const submitMutation = useSubmitMovieReviewMutation({
    movieId,
    onSuccess: (data) => {
      recordReview({
        reviewId: data.sk_movie_review_id,
        nota: data.nota,
        comentario: data.comentario,
        nome: data.nome
      })
      setIsModalOpen(false)
    }
  })

  const updateMutation = useUpdateMovieReviewMutation({
    movieId,
    onSuccess: (data) => {
      recordReview({
        reviewId: data.sk_movie_review_id,
        nota: data.nota,
        comentario: data.comentario,
        nome: data.nome
      })
      setIsModalOpen(false)
    }
  })

  const isPending = submitMutation.isPending || updateMutation.isPending

  const handleOpenCreateModal = () => {
    setModalMode('create')
    setActiveReviewId(undefined)
    // Herda a nota de estrelas da última review se já possuir
    setInitialModalValues({
      nota: userReview?.nota ?? 0,
      comentario: '',
      nome: authorName
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (reviewToEdit?: MovieReviewDTO) => {
    setModalMode('edit')
    const target = reviewToEdit ?? (userReview ? {
      sk_movie_review_id: userReview.reviewId ?? '',
      nota: userReview.nota,
      comentario: userReview.comentario,
      nome: userReview.nome
    } : null)

    if (target) {
      setActiveReviewId(target.sk_movie_review_id)
      setInitialModalValues({
        nota: target.nota,
        comentario: target.comentario,
        nome: target.nome
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmitReview = async (values: ReviewFormValues) => {
    const targetReviewId = activeReviewId || userReview?.reviewId

    if (modalMode === 'edit' && targetReviewId) {
      await updateMutation.mutateAsync({
        reviewId: targetReviewId,
        payload: {
          nome: values.nome,
          nota: values.nota,
          comentario: values.comentario || null
        }
      })
    } else {
      await submitMutation.mutateAsync({
        nome: values.nome,
        nota: values.nota,
        comentario: values.comentario || null
      })
    }
  }

  return (
    <section className="mt-12 space-y-6 border-t border-white/10 pt-8" aria-label="Avaliações do filme">
      {/* Header Editorial da Seção com Botão de Ação */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Avaliações da Comunidade
            </h2>
            <div className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Star className="size-3 fill-current text-primary" />
              <span>
                {notaMediaUsuarios !== null && notaMediaUsuarios !== undefined
                  ? notaMediaUsuarios.toFixed(1)
                  : '—'}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {qtdAvaliacoesUsuarios} {qtdAvaliacoesUsuarios === 1 ? 'resenha' : 'resenhas'}
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Opiniões e pontuações registradas por membros da comunidade RocketFilms.
          </p>
        </div>

        {/* Botões de Ação: Editar minha avaliação ou Nova Avaliação */}
        <div className="flex items-center gap-2">
          {hasReviewed && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenEditModal()}
              className="shrink-0"
            >
              <PencilLine className="size-3.5 text-muted-foreground" />
              <span>Editar Última Avaliação</span>
            </Button>
          )}

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleOpenCreateModal}
            className="shrink-0"
          >
            <MessageSquarePlus className="size-3.5" />
            <span>{hasReviewed ? 'Nova Avaliação' : 'Escrever Avaliação'}</span>
          </Button>
        </div>
      </div>

      {/* Grid de Reviews ou Estados de Loading/Empty */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-xl border border-white/5 bg-secondary/30 p-4"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-secondary/15 py-12 text-center">
          <Star className="mb-2 size-8 text-primary/40" />
          <h3 className="text-sm font-semibold text-foreground">Nenhuma avaliação ainda</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Seja o primeiro a avaliar e compartilhar sua opinião sobre este filme com a comunidade!
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenCreateModal}
            className="mt-4"
          >
            <MessageSquarePlus className="size-3.5" />
            <span>Avaliar agora</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => {
            const isOwnReview =
              (userReview?.reviewId && userReview.reviewId === review.sk_movie_review_id) ||
              Boolean(user?.nome && review.nome.trim().toLowerCase() === user.nome.trim().toLowerCase())

            return (
              <ReviewExpandableCardView
                key={review.sk_movie_review_id}
                review={review}
                isOwnReview={isOwnReview}
                onEdit={() => handleOpenEditModal(review)}
              />
            )
          })}
        </div>
      )}

      {/* Modal de Avaliação (Criação ou Edição) */}
      <NewReviewModalView
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        movieTitle={movieTitle}
        onSubmitReview={handleSubmitReview}
        isSubmitting={isPending}
        mode={modalMode}
        initialValues={initialModalValues}
      />
    </section>
  )
}
