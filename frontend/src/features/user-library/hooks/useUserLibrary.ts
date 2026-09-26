import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  getUserLibraryIds,
  getUserLibraryMovies,
  toggleFavoriteMovie,
  toggleWatchlistMovie
} from '@/features/user-library/api/userLibraryApi'
import type {
  PaginatedUserLibraryMoviesDTO,
  UserLibraryIdsDTO
} from '@/features/user-library/types/user-library.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

const USER_LIBRARY_IDS_QUERY_KEY = ['user', 'library', 'ids'] as const
const USER_LIBRARY_MOVIES_QUERY_KEY = ['user', 'library', 'movies'] as const

export function useUserLibrary() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: libraryIds, isLoading: isLoadingIds } = useQuery<UserLibraryIdsDTO>({
    queryKey: USER_LIBRARY_IDS_QUERY_KEY,
    queryFn: getUserLibraryIds,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10 // 10 minutos de cache
  })

  const favoriteIdsSet = React.useMemo(() => {
    return new Set(libraryIds?.favorites ?? [])
  }, [libraryIds?.favorites])

  const watchlistIdsSet = React.useMemo(() => {
    return new Set(libraryIds?.watchlist ?? [])
  }, [libraryIds?.watchlist])

  const isFavorite = React.useCallback(
    (movieId: string): boolean => {
      return favoriteIdsSet.has(movieId)
    },
    [favoriteIdsSet]
  )

  const inWatchlist = React.useCallback(
    (movieId: string): boolean => {
      return watchlistIdsSet.has(movieId)
    },
    [watchlistIdsSet]
  )

  const toggleFavoriteMutation = useMutation({
    mutationFn: (movieId: string) => toggleFavoriteMovie(movieId),
    onMutate: async (movieId: string) => {
      await queryClient.cancelQueries({ queryKey: USER_LIBRARY_IDS_QUERY_KEY })
      const previousIds = queryClient.getQueryData<UserLibraryIdsDTO>(USER_LIBRARY_IDS_QUERY_KEY)

      if (previousIds) {
        const isFav = previousIds.favorites.includes(movieId)
        const updatedFavorites = isFav
          ? previousIds.favorites.filter((id) => id !== movieId)
          : [...previousIds.favorites, movieId]

        queryClient.setQueryData<UserLibraryIdsDTO>(USER_LIBRARY_IDS_QUERY_KEY, {
          ...previousIds,
          favorites: updatedFavorites
        })
      }

      return { previousIds }
    },
    onError: (_err, _movieId, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(USER_LIBRARY_IDS_QUERY_KEY, context.previousIds)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: USER_LIBRARY_IDS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: USER_LIBRARY_MOVIES_QUERY_KEY })
    }
  })

  const toggleWatchlistMutation = useMutation({
    mutationFn: (movieId: string) => toggleWatchlistMovie(movieId),
    onMutate: async (movieId: string) => {
      await queryClient.cancelQueries({ queryKey: USER_LIBRARY_IDS_QUERY_KEY })
      const previousIds = queryClient.getQueryData<UserLibraryIdsDTO>(USER_LIBRARY_IDS_QUERY_KEY)

      if (previousIds) {
        const inWatch = previousIds.watchlist.includes(movieId)
        const updatedWatchlist = inWatch
          ? previousIds.watchlist.filter((id) => id !== movieId)
          : [...previousIds.watchlist, movieId]

        queryClient.setQueryData<UserLibraryIdsDTO>(USER_LIBRARY_IDS_QUERY_KEY, {
          ...previousIds,
          watchlist: updatedWatchlist
        })
      }

      return { previousIds }
    },
    onError: (_err, _movieId, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(USER_LIBRARY_IDS_QUERY_KEY, context.previousIds)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: USER_LIBRARY_IDS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: USER_LIBRARY_MOVIES_QUERY_KEY })
    }
  })

  const handleToggleFavorite = React.useCallback(
    (movieId: string) => {
      if (!isAuthenticated) {
        navigate('/login')
        return
      }
      toggleFavoriteMutation.mutate(movieId)
    },
    [isAuthenticated, navigate, toggleFavoriteMutation]
  )

  const handleToggleWatchlist = React.useCallback(
    (movieId: string) => {
      if (!isAuthenticated) {
        navigate('/login')
        return
      }
      toggleWatchlistMutation.mutate(movieId)
    },
    [isAuthenticated, navigate, toggleWatchlistMutation]
  )

  return {
    isFavorite,
    inWatchlist,
    toggleFavorite: handleToggleFavorite,
    toggleWatchlist: handleToggleWatchlist,
    isLoadingIds,
    isMutatingFavorite: toggleFavoriteMutation.isPending,
    isMutatingWatchlist: toggleWatchlistMutation.isPending,
    totalFavorites: libraryIds?.favorites.length ?? 0,
    totalWatchlist: libraryIds?.watchlist.length ?? 0
  }
}

export function useUserLibraryMoviesQuery(
  type: 'favorites' | 'watchlist' | 'all' = 'favorites',
  page = 1,
  pageSize = 20
) {
  const { isAuthenticated } = useAuth()

  return useQuery<PaginatedUserLibraryMoviesDTO>({
    queryKey: [...USER_LIBRARY_MOVIES_QUERY_KEY, type, page, pageSize],
    queryFn: () => getUserLibraryMovies(type, page, pageSize),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 3
  })
}
