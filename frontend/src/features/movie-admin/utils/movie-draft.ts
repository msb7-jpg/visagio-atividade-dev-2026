import type { MovieAdminFormValues } from '@/features/movie-admin/types/movie-admin.types'

export const MOVIE_DRAFT_KEY = 'rocketfilms_movie_create_draft'
export const DRAFT_CHANGE_EVENT = 'rocketfilms:draft-change'

export interface MovieDraftData extends MovieAdminFormValues {
  updatedAt: number
}

function dispatchDraftChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(DRAFT_CHANGE_EVENT))
  }
}

export function isDraftNotEmpty(values?: Partial<MovieAdminFormValues> | null): boolean {
  if (!values) return false

  const hasTitle = Boolean(values.titulo && values.titulo.trim().length > 0)
  const hasDirector = Boolean(values.diretor && values.diretor.trim().length > 0)
  const hasSinopse = Boolean(values.sinopse && values.sinopse.trim().length > 0)
  const hasPoster = Boolean(values.url_poster && values.url_poster.trim().length > 0)
  const hasBackdrop = Boolean(values.url_backdrop && values.url_backdrop.trim().length > 0)
  const hasGenres = Boolean(values.generos_ids && values.generos_ids.length > 0)
  const hasDuration = Boolean(values.duracao_minutos && values.duracao_minutos > 0)

  return hasTitle || hasDirector || hasSinopse || hasPoster || hasBackdrop || hasGenres || hasDuration
}

export function saveMovieDraft(values: MovieAdminFormValues): void {
  if (typeof window === 'undefined') return

  if (!isDraftNotEmpty(values)) {
    clearMovieDraft()
    return
  }

  try {
    const draft: MovieDraftData = {
      ...values,
      updatedAt: Date.now()
    }
    localStorage.setItem(MOVIE_DRAFT_KEY, JSON.stringify(draft))
    dispatchDraftChange()
  } catch {
    // Falha silenciosa caso o storage esteja bloqueado ou sem cota
  }
}

export function getMovieDraft(): MovieDraftData | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem(MOVIE_DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as MovieDraftData
    if (isDraftNotEmpty(parsed)) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

export function clearMovieDraft(): void {
  if (typeof window === 'undefined') return

  try {
    console.log('Limpando rascunho de filme do localStorage')
    localStorage.removeItem(MOVIE_DRAFT_KEY)
    dispatchDraftChange()
  } catch {
    // Falha silenciosa
  }
}

export function hasMovieDraft(): boolean {
  return getMovieDraft() !== null
}
