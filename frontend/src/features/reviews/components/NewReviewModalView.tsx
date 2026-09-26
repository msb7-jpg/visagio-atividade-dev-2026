import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { extractFirstErrorMessage } from '@/features/auth/utils/form-error'
import { StarRatingInput } from '@/features/reviews/components/StarRatingInput'
import { reviewSchema, type ReviewFormValues } from '@/features/reviews/schemas/review.schema'
import { useForm, useSelector } from '@tanstack/react-form'
import { Film, PencilLine } from 'lucide-react'
import * as React from 'react'

interface NewReviewModalViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movieTitle: string
  onSubmitReview: (values: ReviewFormValues) => Promise<void>
  isSubmitting: boolean
  mode?: 'create' | 'edit'
  initialValues?: {
    nota?: number
    comentario?: string | null
    nome?: string
  }
}

export function NewReviewModalView({
  open,
  onOpenChange,
  movieTitle,
  onSubmitReview,
  isSubmitting,
  mode = 'create',
  initialValues
}: NewReviewModalViewProps) {
  const { user, isAuthenticated } = useAuth()
  const authorName = initialValues?.nome || user?.nome || 'Cinéfilo'
  const isEditMode = mode === 'edit'

  const form = useForm({
    defaultValues: {
      nome: authorName,
      nota: initialValues?.nota ?? 0,
      comentario: initialValues?.comentario ?? ''
    } as ReviewFormValues,
    onSubmit: async ({ value }) => {
      const validated = reviewSchema.parse({
        ...value,
        nome: value.nome || authorName
      })
      await onSubmitReview(validated)
    }
  })

  // Sincroniza campos quando o modal abre com initialValues ou modo
  React.useEffect(() => {
    if (open) {
      form.setFieldValue('nome', authorName)
      form.setFieldValue('nota', initialValues?.nota ?? 0)
      form.setFieldValue('comentario', initialValues?.comentario ?? '')
    }
  }, [open, authorName, initialValues?.nota, initialValues?.comentario, form])

  const isFormValidating = useSelector(form.store, (s) => s.isValidating)

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset()
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-1.5 text-primary">
            {isEditMode ? <PencilLine className="size-4" /> : <Film className="size-4" />}
            <span className="text-xs font-semibold tracking-wider uppercase">
              {isEditMode ? 'Eu reasisti...' : 'Eu assisti...'}
            </span>
          </div>

          <DialogTitle>
            {movieTitle}
          </DialogTitle>

          <DialogDescription>
            {isEditMode
              ? 'Atualize sua classificação ou resenha cadastrada para esta obra.'
              : 'Registre sua avaliação e compartilhe suas impressões com a comunidade.'}
          </DialogDescription>

          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground/80">
            <div className="flex items-center gap-1.5">
              <span>Avaliando como</span>
              <span className="font-semibold text-foreground underline decoration-primary/40 underline-offset-4">
                {authorName}
              </span>
            </div>
            {!isAuthenticated && (
              <span className="text-[11px] text-muted-foreground/70 italic">
                (Visitante · salvo neste navegador)
              </span>
            )}
          </div>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="space-y-5 pt-1"
          noValidate
        >
          {/* Seletor de 5 Estrelas Cineclubista */}
          <form.Field
            name="nota"
            validators={{
              onSubmit: ({ value }) => {
                const res = reviewSchema.shape.nota.safeParse(value)
                return res.success ? undefined : res.error.issues[0]?.message
              }
            }}
            children={(field) => {
              const fieldError = extractFirstErrorMessage(field.state.meta.errors)
              return (
                <div className="space-y-1.5 rounded-lg border border-white/5 bg-white/[0.02] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Sua classificação
                    </span>
                  </div>

                  <div className="pt-1">
                    <StarRatingInput
                      value={field.state.value}
                      onChange={(score) => field.handleChange(score)}
                      disabled={isSubmitting}
                      error={fieldError}
                      size="lg"
                    />
                  </div>
                </div>
              )
            }}
          />

          {/* Campo Resenha / Comentário Orgânico */}
          <form.Field
            name="comentario"
            validators={{
              onSubmit: ({ value }) => {
                const res = reviewSchema.shape.comentario.safeParse(value)
                return res.success ? undefined : res.error.issues[0]?.message
              }
            }}
            children={(field) => {
              const fieldError = extractFirstErrorMessage(field.state.meta.errors)
              return (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={field.name}
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Resenha ou comentários (opcional)
                    </label>
                    <span className="text-[11px] text-muted-foreground/60">
                      {(field.state.value || '').length} / 4.000
                    </span>
                  </div>

                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="O que achou da direção, fotografia, ritmo e atuações? Deixe registrado seu ponto de vista..."
                    rows={5}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(fieldError)}
                  />

                  {fieldError && (
                    <span className="text-xs font-medium text-destructive">{fieldError}</span>
                  )}
                </div>
              )
            }}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isSubmitting || isFormValidating}
            >
              {isSubmitting
                ? isEditMode
                  ? 'Salvando alterações...'
                  : 'Publicando...'
                : isEditMode
                  ? 'Salvar Alterações'
                  : 'Publicar Avaliação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
