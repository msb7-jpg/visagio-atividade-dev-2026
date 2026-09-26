import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tooltip } from '@/components/ui/tooltip-card'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { MovieListItem } from '@/features/catalog/api/catalogApi'
import { DeleteMovieConfirmDialog } from '@/features/movie-admin/components/DeleteMovieConfirmDialog'
import { useDeleteMovieMutation } from '@/features/movie-admin/hooks/useMovieAdminMutations'
import { NewReviewModalView } from '@/features/reviews/components/NewReviewModalView'
import { StarRatingInput } from '@/features/reviews/components/StarRatingInput'
import {
  useSubmitMovieReviewMutation,
  useUpdateMovieReviewMutation
} from '@/features/reviews/hooks/useMovieReviews'
import { useUserMovieReview } from '@/features/reviews/hooks/useUserMovieReview'
import type { ReviewFormValues } from '@/features/reviews/schemas/review.schema'
import { cn } from '@/lib/utils'
import { routes } from '@/routes/routes.types'
import {
  Check,
  Edit3,
  Eye,
  Film,
  Heart,
  MoreHorizontal,
  MouseRight,
  PencilLine,
  PlusCircle,
  Trash2
} from 'lucide-react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

interface MovieQuickActionsMenuProps {
  movie: MovieListItem
  children: React.ReactNode | ((props: { trigger: React.ReactNode }) => React.ReactNode)
  triggerClassName?: string
  className?: string
}

export function MovieQuickActionsMenu({
  movie,
  children,
  triggerClassName,
  className
}: MovieQuickActionsMenuProps) {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const authorName = user?.nome || 'Cinéfilo'

  const { userReview, hasReviewed, recordReview } = useUserMovieReview(movie.sk_movie_id)

  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [modalMode, setModalMode] = React.useState<'create' | 'edit'>('create')
  const [initialModalValues, setInitialModalValues] = React.useState<{
    nota?: number
    comentario?: string | null
    nome?: string
  }>({})

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [quickRatingSuccess, setQuickRatingSuccess] = React.useState<number | null>(null)

  const submitMutation = useSubmitMovieReviewMutation({
    movieId: movie.sk_movie_id,
    onSuccess: (data) => {
      recordReview({
        reviewId: data.sk_movie_review_id,
        nota: data.nota,
        comentario: data.comentario,
        nome: data.nome
      })
      setQuickRatingSuccess(data.nota)
      setTimeout(() => {
        setQuickRatingSuccess(null)
        setIsDropdownOpen(false)
      }, 1200)
    }
  })

  const updateMutation = useUpdateMovieReviewMutation({
    movieId: movie.sk_movie_id,
    onSuccess: (data) => {
      recordReview({
        reviewId: data.sk_movie_review_id,
        nota: data.nota,
        comentario: data.comentario,
        nome: data.nome
      })
      setQuickRatingSuccess(data.nota)
      setTimeout(() => {
        setQuickRatingSuccess(null)
        setIsDropdownOpen(false)
      }, 1200)
    }
  })

  const deleteMutation = useDeleteMovieMutation({
    onSuccess: () => {
      setIsDeleteDialogOpen(false)
      setIsDropdownOpen(false)
    }
  })

  const isPending = submitMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  // Valor exibido nas estrelas: última nota do usuário ou sucesso temporário
  const currentScore = quickRatingSuccess ?? (userReview ? userReview.nota : 0)

  const handleQuickRate = (score: number) => {
    if (hasReviewed && userReview?.reviewId) {
      updateMutation.mutate({
        reviewId: userReview.reviewId,
        payload: {
          nome: userReview.nome,
          nota: score,
          comentario: userReview.comentario
        }
      })
    } else {
      submitMutation.mutate({
        nome: authorName,
        nota: score,
        comentario: null
      })
    }
  }

  const handleOpenEditReview = () => {
    setModalMode('edit')
    setInitialModalValues({
      nota: userReview?.nota ?? 0,
      comentario: userReview?.comentario ?? '',
      nome: userReview?.nome ?? authorName
    })
    setIsDropdownOpen(false)
    setIsReviewModalOpen(true)
  }

  const handleOpenNewReview = () => {
    setModalMode('create')
    // Pega as estrelas da última review conforme solicitado
    setInitialModalValues({
      nota: userReview?.nota ?? quickRatingSuccess ?? 0,
      comentario: '',
      nome: authorName
    })
    setIsDropdownOpen(false)
    setIsReviewModalOpen(true)
  }

  const handleSubmitModalReview = async (values: ReviewFormValues) => {
    if (modalMode === 'edit' && userReview?.reviewId) {
      await updateMutation.mutateAsync({
        reviewId: userReview.reviewId,
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
    setIsReviewModalOpen(false)
  }

  // Conteúdo compartilhado entre DropdownMenu e ContextMenu
  const renderMenuInner = (isContextMenu = false) => {
    const LabelComponent = isContextMenu ? ContextMenuLabel : DropdownMenuLabel
    const SeparatorComponent = isContextMenu ? ContextMenuSeparator : DropdownMenuSeparator
    const ItemComponent = isContextMenu ? ContextMenuItem : DropdownMenuItem

    return (
      <div className="w-56 p-1 text-xs">
        <LabelComponent className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
          <span>
            {quickRatingSuccess !== null ? (
              <span className="flex items-center gap-1.5 text-profit">
                <Check className="size-3.5" />
                <span>Nota {(quickRatingSuccess / 2).toFixed(1)} salva!</span>
              </span>
            ) : hasReviewed ? (
              <span className="text-primary">
                Sua avaliação ({((userReview?.nota ?? 0) / 2).toFixed(1)} ★)
              </span>
            ) : (
              'Assistiu? Deixe sua nota'
            )}
          </span>

          {/* Ícone de botão direito exclusivo do menu de contexto com tooltip explicativo */}
          <Tooltip content="Clique com botão direito no card para abrir o menu">
            <div className="flex items-center">
              <span className="flex cursor-help items-center text-white/40 transition-colors hover:text-white/70">
                <MouseRight className="size-3.5" />
              </span>
            </div>
          </Tooltip>
        </LabelComponent>

        <div className="px-1 py-1.5">
          <StarRatingInput
            value={currentScore}
            onChange={handleQuickRate}
            size="sm"
            disabled={isPending}
            showScoreLabel={true}
          />
        </div>

        <SeparatorComponent />

        {/* Opção para Editar se já possui review prévia */}
        {hasReviewed ? (
          <>
            <ItemComponent
              onSelect={(e) => {
                e.preventDefault()
                handleOpenEditReview()
              }}
            >
              <PencilLine className="size-3.5 text-muted-foreground" />
              <span>Editar minha resenha...</span>
            </ItemComponent>

            <ItemComponent
              onSelect={(e) => {
                e.preventDefault()
                handleOpenNewReview()
              }}
            >
              <PlusCircle className="size-3.5 text-muted-foreground" />
              <span>Adicionar nova resenha...</span>
            </ItemComponent>
          </>
        ) : (
          <ItemComponent
            onSelect={(e) => {
              e.preventDefault()
              handleOpenNewReview()
            }}
          >
            <Film className="size-3.5 text-primary" />
            <span>Escrever resenha completa...</span>
          </ItemComponent>
        )}

        {/* Slots futuros reservados (Watchlist e Curtir) conforme Letterboxd */}
        <ItemComponent disabled>
          <Eye className="size-3.5" />
          <span>Marcar como visto (em breve)</span>
        </ItemComponent>

        <ItemComponent disabled>
          <Heart className="size-3.5" />
          <span>Favoritar (em breve)</span>
        </ItemComponent>

        {/* Ações de Administração (quando autenticado) */}
        {isAuthenticated && (
          <>
            <SeparatorComponent />
            <ItemComponent
              onSelect={(e) => {
                e.preventDefault()
                setIsDropdownOpen(false)
                navigate(routes.adminMovieEdit(movie.sk_movie_id))
              }}
            >
              <Edit3 className="size-3.5 text-muted-foreground" />
              <span>Editar filme...</span>
            </ItemComponent>

            <ItemComponent
              className="text-destructive focus:text-destructive"
              onSelect={(e) => {
                e.preventDefault()
                setIsDropdownOpen(false)
                setIsDeleteDialogOpen(true)
              }}
            >
              <Trash2 className="size-3.5 text-destructive" />
              <span>Excluir filme...</span>
            </ItemComponent>
          </>
        )}
      </div>
    )
  }

  // Botão original de 3 pontinhos com hover
  const trigger = (
    <div
      className={cn(
        'z-20 transition-opacity duration-200',
        triggerClassName ??
          'pointer-events-none absolute right-2.5 bottom-2.5 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100'
      )}
    >
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            aria-label={`Ações rápidas para ${movie.titulo}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          {renderMenuInner(false)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  const isFunctionChildren = typeof children === 'function'

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className={cn('group/quick relative', className ?? 'h-full')}>
            {isFunctionChildren ? children({ trigger }) : children}
            {!isFunctionChildren && trigger}
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          {renderMenuInner(true)}
        </ContextMenuContent>
      </ContextMenu>

      {/* Modal de Avaliação Completo (Criação ou Edição) */}
      <NewReviewModalView
        open={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        movieTitle={movie.titulo}
        onSubmitReview={handleSubmitModalReview}
        isSubmitting={isPending}
        mode={modalMode}
        initialValues={initialModalValues}
      />

      {/* Diálogo de Confirmação de Exclusão (Admin) */}
      <DeleteMovieConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        movieTitle={movie.titulo}
        onConfirmDelete={() => {
          deleteMutation.mutate(movie.sk_movie_id)
        }}
        isDeleting={deleteMutation.isPending}
      />
    </>
  )
}
