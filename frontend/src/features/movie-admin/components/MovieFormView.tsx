import { RequiredFieldBadge } from '@/components/feedback/RequiredFieldBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { extractFirstErrorMessage } from '@/features/auth/utils/form-error'
import type { GenreItem } from '@/features/catalog/api/catalogApi'
import { DirectorAutocomplete } from '@/features/movie-admin/components/DirectorAutocomplete'
import { DiscardDraftConfirmDialog } from '@/features/movie-admin/components/DiscardDraftConfirmDialog'
import { GenreSelectorPills } from '@/features/movie-admin/components/GenreSelectorPills'
import { PosterLivePreview } from '@/features/movie-admin/components/PosterLivePreview'
import { ValidatedImageUrlInput } from '@/features/movie-admin/components/ValidatedImageUrlInput'
import { useHasMovieDraft } from '@/features/movie-admin/hooks/useMovieDraft'
import {
  movieFormSchema,
  type MovieFormSchemaValues
} from '@/features/movie-admin/schemas/movie-form.schema'
import type { MovieAdminFormValues } from '@/features/movie-admin/types/movie-admin.types'
import {
  clearMovieDraft,
  DRAFT_CHANGE_EVENT,
  isDraftNotEmpty,
  MOVIE_DRAFT_KEY,
  saveMovieDraft
} from '@/features/movie-admin/utils/movie-draft'
import { useForm, useSelector } from '@tanstack/react-form'
import { ArrowLeft, Check, Clapperboard, Film, Loader2 } from 'lucide-react'
import * as React from 'react'

interface MovieFormViewProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<MovieAdminFormValues>
  availableGenres: GenreItem[]
  onSubmit: (values: MovieFormSchemaValues) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  serverError?: string | null
}

const currentYear = new Date().getFullYear()

export const MovieFormView: React.FC<MovieFormViewProps> = ({
  mode,
  initialValues,
  availableGenres,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError = null
}) => {
  const isEditMode = mode === 'edit'

  const defaultValues: MovieAdminFormValues = React.useMemo(() => ({
    titulo: initialValues?.titulo ?? '',
    diretor: initialValues?.diretor ?? '',
    ano_lancamento: initialValues?.ano_lancamento ?? currentYear,
    duracao_minutos: initialValues?.duracao_minutos ?? null,
    sinopse: initialValues?.sinopse ?? '',
    url_poster: initialValues?.url_poster ?? '',
    url_backdrop: initialValues?.url_backdrop ?? '',
    generos_ids: initialValues?.generos_ids ?? []
  }), [initialValues])

  // Flag para evitar que o cleanup do useEffect ressalve o rascunho ao desmontar
  const isDiscardingRef = React.useRef(false)

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: movieFormSchema
    },
    onSubmit: async ({ value }) => {
      const validated = movieFormSchema.parse(value)
      await onSubmit(validated)
      isDiscardingRef.current = true
      clearMovieDraft()
    }
  })

  React.useEffect(() => {
    if (initialValues) {
      form.reset({ ...defaultValues, ...initialValues })
    }
  }, [initialValues, form, defaultValues])

  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = React.useState(false)
  const hasSavedDraft = useHasMovieDraft()

  // Escuta limpezas de rascunho externas (como logout ou descarte em outra aba)
  React.useEffect(() => {
    const handleDraftEvent = () => {
      if (typeof window !== 'undefined' && !localStorage.getItem(MOVIE_DRAFT_KEY)) {
        isDiscardingRef.current = true
      }
    }

    window.addEventListener(DRAFT_CHANGE_EVENT, handleDraftEvent)
    window.addEventListener('storage', handleDraftEvent)

    return () => {
      window.removeEventListener(DRAFT_CHANGE_EVENT, handleDraftEvent)
      window.removeEventListener('storage', handleDraftEvent)
    }
  }, [])

  const formValues = useSelector(form.store, (s) => s.values)
  const liveTitle = useSelector(form.store, (s) => s.values.titulo)
  const livePosterUrl = useSelector(form.store, (s) => s.values.url_poster)
  const liveBackdropUrl = useSelector(form.store, (s) => s.values.url_backdrop)
  const liveReleaseYear = useSelector(form.store, (s) => s.values.ano_lancamento)
  const liveGenresIds = useSelector(form.store, (s) => s.values.generos_ids)

  // Guarda o valor mais recente para sincronização instantânea
  const latestValuesRef = React.useRef(formValues)
  React.useEffect(() => {
    latestValuesRef.current = formValues
    // Se o usuário estiver interagindo e digitando dados, reativa a permissão de salvar rascunho
    if (!isEditMode && isDraftNotEmpty(formValues)) {
      isDiscardingRef.current = false
    }
  }, [formValues, isEditMode])

  // Salva rascunho com debounce e flush ao recarregar a página
  React.useEffect(() => {
    if (isEditMode) return

    const timer = setTimeout(() => {
      if (!isDiscardingRef.current) {
        saveMovieDraft(latestValuesRef.current)
      }
    }, 150)

    const handleBeforeUnload = () => {
      if (!isDiscardingRef.current && isDraftNotEmpty(latestValuesRef.current)) {
        saveMovieDraft(latestValuesRef.current)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      // Só salva na desmontagem se NÃO foi uma ação explícita de descarte/submissão e o rascunho contém valores válidos
      if (!isDiscardingRef.current && isDraftNotEmpty(latestValuesRef.current)) {
        saveMovieDraft(latestValuesRef.current)
      }
    }
  }, [isEditMode, formValues])

  const handleAttemptCancel = () => {
    if (!isEditMode && isDraftNotEmpty(formValues)) {
      setIsDiscardDialogOpen(true)
    } else {
      onCancel()
    }
  }

  const handleConfirmDiscard = () => {
    isDiscardingRef.current = true
    clearMovieDraft()
    onCancel()
  }

  const handleToggleGenre = (genreId: string) => {
    form.setFieldValue('generos_ids', (current = []) =>
      current.includes(genreId)
        ? current.filter((id) => id !== genreId)
        : [...current, genreId]
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Botão de retorno e cabeçalho de navegação */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAttemptCancel}
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="size-4" />
            <span>Voltar</span>
          </span>
        </Button>

        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          {isEditMode ? 'Painel de Edição' : 'Estúdio de Criação  '}
        </span>
      </div>

      {/* Título editorial da página com indicador de rascunho salvo */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-primary">
            <Film className="size-5" />
            <h1 className="text-2xl font-bold tracking-tight text-muted-foreground sm:text-3xl">
              {isEditMode ? 'Editar Filme' : 'Cadastrar Filme'}
            </h1>
          </div>

          {!isEditMode && hasSavedDraft && (
            <Badge variant="admin">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                <span>Rascunho Salvo</span>
              </span>
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEditMode
            ? 'Atualize metadados, pôster e informações do filme selecionado.'
            : 'Preencha os metadados da obra cinematográfica para adicioná-la ao catálogo.'}
        </p>
      </div>

      {serverError && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Layout em 2 colunas: Formulário à esquerda + Live Poster Preview à direita */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl sm:p-8 lg:col-span-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="flex flex-col gap-6"
          >
            {/* Título do Filme */}
            <form.Field
              name="titulo"
              validators={{
                onChange: ({ value }) =>
                  !value || value.trim().length === 0 ? 'Título é obrigatório' : undefined
              }}
            >
              {(field) => {
                const error = extractFirstErrorMessage(field.state.meta.errors)
                return (
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="flex items-center text-xs font-semibold tracking-wider text-foreground/90 uppercase"
                    >
                      <span>Título do Filme</span>
                      <RequiredFieldBadge tooltipText="Obrigatório para identificação da obra" />
                    </label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ex: Interestelar, Pulp Fiction, Oppenheimer..."
                      variant="glass"
                      aria-invalid={Boolean(error)}
                    />
                    {error && <span className="text-xs text-destructive">{error}</span>}
                  </div>
                )
              }}
            </form.Field>

            {/* Diretor e Ano de Lançamento em 2 colunas */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <form.Field name="diretor">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="text-xs font-semibold tracking-wider text-foreground/90 uppercase"
                    >
                      Diretor Principal
                    </label>
                    <DirectorAutocomplete
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                      onBlur={field.handleBlur}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="ano_lancamento"
                validators={{
                  onChange: ({ value }) => {
                    const num = Number(value)
                    if (isNaN(num) || num < 1888 || num > 2030) {
                      return 'Ano deve estar entre 1888 e 2030'
                    }
                    return undefined
                  }
                }}
              >
                {(field) => {
                  const error = extractFirstErrorMessage(field.state.meta.errors)
                  return (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={field.name}
                        className="flex items-center text-xs font-semibold tracking-wider text-foreground/90 uppercase"
                      >
                        <span>Ano de Lançamento</span>
                        <RequiredFieldBadge tooltipText="Ano entre 1888 e 2030" />
                      </label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={1888}
                        max={2030}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        variant="glass"
                        aria-invalid={Boolean(error)}
                      />
                      {error && <span className="text-xs text-destructive">{error}</span>}
                    </div>
                  )
                }}
              </form.Field>
            </div>

            {/* Duração em Minutos */}
            <form.Field
              name="duracao_minutos"
              validators={{
                onChange: ({ value }) => {
                  if (value !== null && value !== undefined) {
                    const num = Number(value)
                    if (num < 1 || num > 1000) {
                      return 'Duração deve estar entre 1 e 1000 minutos'
                    }
                  }
                  return undefined
                }
              }}
            >
              {(field) => {
                const error = extractFirstErrorMessage(field.state.meta.errors)
                return (
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="text-xs font-semibold tracking-wider text-foreground/90 uppercase"
                    >
                      Duração (Minutos)
                    </label>
                    <div className="sm:max-w-xs">
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={1}
                        max={1000}
                        value={field.state.value ?? ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const val = e.target.value
                          field.handleChange(val === '' ? null : Number(val))
                        }}
                        placeholder="Ex: 148"
                        variant="glass"
                        aria-invalid={Boolean(error)}
                      />
                    </div>
                    {error && <span className="text-xs text-destructive">{error}</span>}
                  </div>
                )
              }}
            </form.Field>

            {/* Seleção de Gêneros com chips */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold tracking-wider text-foreground/90 uppercase">
                Gêneros Cinematográficos
              </span>
              <GenreSelectorPills
                availableGenres={availableGenres}
                selectedGenreIds={liveGenresIds}
                onToggleGenre={handleToggleGenre}
              />
            </div>

            {/* Sinopse */}
            <form.Field name="sinopse">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={field.name}
                      className="text-xs font-semibold tracking-wider text-foreground/90 uppercase"
                    >
                      Sinopse Narrativa
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      {field.state.value.length} / 4000
                    </span>
                  </div>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value.slice(0, 4000))}
                    placeholder="Descreva o enredo, atmosfera, conflito principal e premissa da obra..."
                    className="max-h-60 min-h-28 overflow-y-auto"
                    rows={4}
                    maxLength={4000}
                  />
                </div>
              )}
            </form.Field>

            {/* URLs de Imagens: Pôster e Backdrop */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <form.Field
                name="url_poster"
                validators={{
                  onChange: ({ value }) => {
                    const result = movieFormSchema.shape.url_poster.safeParse(value)
                    return result.success ? undefined : result.error.errors[0]?.message
                  }
                }}
              >
                {(field) => {
                  const error = extractFirstErrorMessage(field.state.meta.errors)
                  return (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={field.name}
                        className="text-xs font-semibold tracking-wider text-foreground/90 uppercase"
                      >
                        URL do Pôster (2:3)
                      </label>
                      <ValidatedImageUrlInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(val) => field.handleChange(val)}
                        placeholder="https://image.tmdb.org/t/p/w500/..."
                        error={error}
                      />
                    </div>
                  )
                }}
              </form.Field>

              <form.Field
                name="url_backdrop"
                validators={{
                  onChange: ({ value }) => {
                    const result = movieFormSchema.shape.url_backdrop.safeParse(value)
                    return result.success ? undefined : result.error.errors[0]?.message
                  }
                }}
              >
                {(field) => {
                  const error = extractFirstErrorMessage(field.state.meta.errors)
                  return (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={field.name}
                        className="text-xs font-semibold tracking-wider text-foreground/90 uppercase"
                      >
                        URL do Backdrop (Panorâmica)
                      </label>
                      <ValidatedImageUrlInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(val) => field.handleChange(val)}
                        placeholder="https://image.tmdb.org/t/p/w1280/..."
                        error={error}
                      />
                    </div>
                  )
                }}
              </form.Field>
            </div>

            {/* Botões de Ação */}
            <div className="mt-4 flex flex-col-reverse items-center justify-end gap-3 border-t border-white/10 pt-6 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                onClick={handleAttemptCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                <span className="flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      {isEditMode ? (
                        <Check className="size-4 text-primary-foreground" />
                      ) : (
                        <Clapperboard className="size-4 text-primary-foreground" />
                      )}
                      <span>{isEditMode ? 'Atualizar Filme' : 'Cadastrar Filme'}</span>
                    </>
                  )}
                </span>
              </Button>
            </div>
          </form>
        </div>

        {/* Coluna da Direita: Live Media Preview (Pôster e Backdrop) fixado com respiro */}
        <div className="sticky top-24 lg:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-card/40 p-6 backdrop-blur-xl">
            <PosterLivePreview
              urlPoster={livePosterUrl}
              urlBackdrop={liveBackdropUrl}
              title={liveTitle}
              releaseYear={liveReleaseYear}
            />
          </div>
        </div>
      </div>

      <DiscardDraftConfirmDialog
        open={isDiscardDialogOpen}
        onOpenChange={setIsDiscardDialogOpen}
        onConfirmDiscard={handleConfirmDiscard}
      />
    </div>
  )
}
