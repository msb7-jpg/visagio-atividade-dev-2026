import {
  clearMovieDraft,
  DRAFT_CHANGE_EVENT,
  getMovieDraft,
  hasMovieDraft,
  type MovieDraftData
} from '@/features/movie-admin/utils/movie-draft'
import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {}

  window.addEventListener(DRAFT_CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(DRAFT_CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

export function useHasMovieDraft(): boolean {
  return useSyncExternalStore(
    subscribe,
    hasMovieDraft,
    () => false
  )
}

export function useMovieDraft() {
  const hasDraft = useHasMovieDraft()

  return {
    hasDraft,
    getDraft: (): MovieDraftData | null => getMovieDraft(),
    clearDraft: clearMovieDraft
  }
}
