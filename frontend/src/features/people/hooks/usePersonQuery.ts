import { peopleApi, type PersonMoviesParams } from '@/features/people/api/peopleApi'
import type {
  PersonDetail,
  PersonFilmographyResponse
} from '@/features/people/types/people.types'
import { useQuery } from '@tanstack/react-query'

export const PERSON_QUERY_KEY = (id: string) => ['person', id] as const
export const PERSON_MOVIES_QUERY_KEY = (id: string, params: PersonMoviesParams) =>
  ['person', id, 'movies', params] as const

export function usePersonProfileQuery(personId: string | undefined) {
  return useQuery<PersonDetail>({
    queryKey: PERSON_QUERY_KEY(personId ?? ''),
    queryFn: () => peopleApi.getPersonDetail(personId!),
    enabled: Boolean(personId)
  })
}

export function usePersonFilmographyQuery(
  personId: string | undefined,
  params: PersonMoviesParams
) {
  return useQuery<PersonFilmographyResponse>({
    queryKey: PERSON_MOVIES_QUERY_KEY(personId ?? '', params),
    queryFn: () => peopleApi.getPersonMovies(personId!, params),
    enabled: Boolean(personId)
  })
}
