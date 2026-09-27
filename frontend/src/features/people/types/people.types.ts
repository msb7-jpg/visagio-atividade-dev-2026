import type { MovieListItem } from '@/features/catalog/api/catalogApi'

export interface PersonDetail {
  sk_person_id: string
  nome_pessoa: string
  tipo_pessoa: string
  total_filmes: number
  nota_media_filmes: number | null
  primeiro_ano: number | null
  ultimo_ano: number | null
  papeis: string[]
}

export interface QuickSearchPerson {
  sk_person_id: string
  nome_pessoa: string
  tipo_pessoa: string
  total_filmes: number
}

export interface PersonFilmographyResponse {
  items: MovieListItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
