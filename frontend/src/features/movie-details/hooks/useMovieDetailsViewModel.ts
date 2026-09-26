import { useNavigate, useParams } from 'react-router-dom'
import { routes } from '@/routes/routes.types'
import { useMovieDetailsQuery } from '@/features/movie-details/hooks/useMovieDetailsQuery'

export function useMovieDetailsViewModel() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const query = useMovieDetailsQuery(id)

  const handleBack = () => {
    navigate(-1)
  }

  const handleGoHome = () => {
    navigate(routes.home())
  }

  return {
    movie: query.data,
    isLoading: query.isLoading,
    isError: query.isError || !query.data,
    errorMessage: query.error?.message,
    handleBack,
    handleGoHome
  }
}
