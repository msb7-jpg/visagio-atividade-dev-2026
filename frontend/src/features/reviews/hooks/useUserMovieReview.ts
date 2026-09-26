import { useAuth } from '@/features/auth/hooks/useAuth'
import { useMovieReviewsQuery } from '@/features/reviews/hooks/useMovieReviews'
import type { MovieReviewDTO } from '@/features/reviews/types/reviews.types'
import * as React from 'react'

export interface UserMovieReviewData {
  reviewId?: string
  nota: number
  comentario: string | null
  nome: string
  isAnonymous?: boolean
}

const LOCAL_STORAGE_PREFIX = 'rocketfilms_anon_review_'

export function getAnonymousReview(movieId: string): UserMovieReviewData | null {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${movieId}`)
    if (!raw) return null
    return JSON.parse(raw) as UserMovieReviewData
  } catch {
    return null
  }
}

export function saveAnonymousReview(movieId: string, data: UserMovieReviewData): void {
  try {
    localStorage.setItem(
      `${LOCAL_STORAGE_PREFIX}${movieId}`,
      JSON.stringify({ ...data, isAnonymous: true })
    )
  } catch {
    // localStorage pode falhar em modo restrito
  }
}

export function useUserMovieReview(movieId: string) {
  const { user, isAuthenticated } = useAuth()
  const { data: reviews, isLoading } = useMovieReviewsQuery(movieId)

  const [anonReview, setAnonReview] = React.useState<UserMovieReviewData | null>(() =>
    getAnonymousReview(movieId)
  )

  // Recarrega do localStorage caso o movieId mude
  React.useEffect(() => {
    setAnonReview(getAnonymousReview(movieId))
  }, [movieId])

  const userReview = React.useMemo<UserMovieReviewData | null>(() => {
    if (isAuthenticated && user?.nome && reviews) {
      // Procura avaliação feita pelo usuário logado
      const found = reviews.find(
        (r: MovieReviewDTO) => r.nome.trim().toLowerCase() === user.nome.trim().toLowerCase()
      )
      if (found) {
        return {
          reviewId: found.sk_movie_review_id,
          nota: found.nota,
          comentario: found.comentario,
          nome: found.nome,
          isAnonymous: false
        }
      }
    }

    // Se não for logado ou não encontrou no backend pelo nome, verifica se há no localStorage
    if (anonReview) {
      return anonReview
    }

    return null
  }, [isAuthenticated, user?.nome, reviews, anonReview])

  const recordReview = React.useCallback(
    (data: UserMovieReviewData) => {
      if (!isAuthenticated) {
        saveAnonymousReview(movieId, data)
        setAnonReview(data)
      }
    },
    [isAuthenticated, movieId]
  )

  return {
    userReview,
    hasReviewed: Boolean(userReview),
    recordReview,
    isLoading
  }
}
