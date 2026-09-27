import { peopleApi, type PersonMoviesParams } from '@/features/people/api/peopleApi'
import type {
  PersonDetail,
  PersonFilmographyResponse
} from '@/features/people/types/people.types'
import { useQuery } from '@tanstack/react-query'

const personQueryKeys = {
  all: ['person'] as const,
  details: (id: string) => [...personQueryKeys.all, 'details', id] as const,
  filmography: (id: string, params: PersonMoviesParams) =>
    [...personQueryKeys.all, 'filmography', id, params] as const
}

export function usePersonProfileQuery(personId: string | undefined) {
  return useQuery<PersonDetail>({
    queryKey: personQueryKeys.details(personId ?? ''),
    queryFn: () => peopleApi.getPersonDetail(personId!),
    enabled: Boolean(personId)
  })
}

export function usePersonFilmographyQuery(
  personId: string | undefined,
  params: PersonMoviesParams
) {
  return useQuery<PersonFilmographyResponse>({
    queryKey: personQueryKeys.filmography(personId ?? '', params),
    queryFn: () => peopleApi.getPersonMovies(personId!, params),
    enabled: Boolean(personId)
  })
}
