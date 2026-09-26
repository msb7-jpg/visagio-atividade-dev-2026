import type { MovieDetailDTO } from '@/features/movie-details/types/movie-details.types'

export interface CreateMoviePayload {
  titulo: string
  diretor?: string | null
  ano_lancamento: number
  duracao_minutos?: number | null
  status_filme?: string | null
  sinopse?: string | null
  url_poster?: string | null
  url_backdrop?: string | null
  generos_ids: string[]
}

export interface UpdateMoviePayload {
  titulo?: string
  diretor?: string | null
  ano_lancamento?: number
  duracao_minutos?: number | null
  status_filme?: string | null
  sinopse?: string | null
  url_poster?: string | null
  url_backdrop?: string | null
  generos_ids?: string[]
}

export interface MovieAdminFormValues {
  titulo: string
  diretor: string
  ano_lancamento: number
  duracao_minutos: number | null
  sinopse: string
  url_poster: string
  url_backdrop: string
  generos_ids: string[]
}

export interface DirectorItem {
  sk_person_id: string
  nome_pessoa: string
  tipo_pessoa: string
}

export type { MovieDetailDTO }
