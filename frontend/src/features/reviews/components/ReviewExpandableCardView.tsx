import { Button } from '@/components/ui/button'
import type { MovieReviewDTO } from '@/features/reviews/types/reviews.types'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, ChevronDown, PencilLine, Star, User, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from 'cn'

interface ReviewExpandableCardViewProps {
  review: MovieReviewDTO
  isOwnReview?: boolean
  onEdit?: () => void
}

function formatDate(isoString: string): string {
  if (!isoString) return ''
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return isoString
  }
}

export function ReviewExpandableCardView({
  review,
  isOwnReview = false,
  onEdit
}: ReviewExpandableCardViewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLongText = Boolean(review.comentario && review.comentario.length > 200)

  return (
    <>
      {/* Card Normal da Lista */}
      <motion.div
        layoutId={`review-card-${review.sk_movie_review_id}`}
        onClick={() => isLongText && setIsExpanded(true)}
        className={cn(
          'group relative flex flex-col justify-between rounded-xl border border-white/10 bg-card/60 p-4 transition-all duration-300',
          isLongText && 'cursor-pointer hover:border-white/20 hover:bg-card/90'
        )}
      >
        <div className="space-y-3">
          {/* Header do Card: Autor + Nota + Botão de Edição se for do autor */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                <User className="size-3.5" />
              </div>
              <motion.span
                layoutId={`review-author-${review.sk_movie_review_id}`}
                className="font-medium text-foreground"
              >
                {review.nome}
                {isOwnReview && (
                  <span className="ml-1.5 text-[10px] font-normal text-primary">
                    (Você)
                  </span>
                )}
              </motion.span>
            </div>

            <div className="flex items-center gap-1.5">
              <motion.div
                layoutId={`review-badge-${review.sk_movie_review_id}`}
                className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary"
              >
                <Star className="size-3 fill-current text-primary" />
                <span>{review.nota.toFixed(1)}</span>
              </motion.div>

              {isOwnReview && onEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                  }}
                  aria-label="Editar minha resenha..."
                  title="Editar minha resenha..."
                  className="size-6"
                >
                  <PencilLine className="size-3.5 text-muted-foreground transition-colors hover:text-primary" />
                </Button>
              )}
            </div>
          </div>

          {/* Texto da resenha ou indicação de quick rating */}
          {review.comentario ? (
            <motion.p
              layoutId={`review-comment-${review.sk_movie_review_id}`}
              className={cn(
                'line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-sm',
                isLongText && 'group-hover:text-foreground/90'
              )}
            >
              {review.comentario}
            </motion.p>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic">
              Sem comentários.
            </p>
          )}
        </div>

        {/* Rodapé com data e indicador de expansão se for longo */}
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[11px] text-muted-foreground/75">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3 opacity-60" />
            {formatDate(review.created_at)}
          </span>

          {isLongText && (
            <span className="inline-flex items-center gap-0.5 text-primary group-hover:underline">
              <span>Ler resenha completa</span>
              <ChevronDown className="size-3" />
            </span>
          )}
        </div>
      </motion.div>

      {/* Modal Orgânico com layoutId do Framer Motion */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop com blur sutil */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Modal Elevado */}
            <motion.div
              layoutId={`review-card-${review.sk_movie_review_id}`}
              className="relative z-10 w-full max-w-xl rounded-2xl border border-white/10 bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                    <User className="size-5" />
                  </div>
                  <div>
                    <motion.h3
                      layoutId={`review-author-${review.sk_movie_review_id}`}
                      className="text-base font-bold text-foreground"
                    >
                      {review.nome}
                    </motion.h3>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="size-3 opacity-60" />
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.div
                    layoutId={`review-badge-${review.sk_movie_review_id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
                  >
                    <Star className="size-3.5 fill-current text-primary" />
                    <span>{review.nota.toFixed(1)} / 10</span>
                  </motion.div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setIsExpanded(false)}
                    aria-label="Fechar resenha"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
                <motion.p
                  layoutId={`review-comment-${review.sk_movie_review_id}`}
                  className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground"
                >
                  {review.comentario}
                </motion.p>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  Fechar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
