import { apiClient } from '@/lib/api-client'

export interface MovieListItem {
  sk_movie_id: string
  id_filme: string
  titulo: string
  ano_lancamento: number | null
  duracao_minutos: number | null
  sinopse: string | null
  url_poster: string | null
  url_backdrop: string | null
  status_filme?: string | null
  generos: string[]
  diretores: string[]
  produtoras: string[]
  popularidade: number
  nota_media_usuarios: number | null
  qtd_avaliacoes_usuarios: number
  nota_tmdb: number | null
  nota_imdb: number | null
  receita_usd: number | null
  receita_brl: number | null
}

export interface PaginatedMoviesResponse {
  items: MovieListItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface GenreItem {
  sk_genre_id: string
  nome_genero: string
}

export interface CompanyItem {
  sk_company_id: string
  nome_produtora: string
}

export interface FetchMoviesParams {
  page?: number
  pageSize?: number
  q?: string
  genre?: string
  company?: string
  year?: number
  status?: string
  sortBy?: 'popularidade' | 'nota_media_usuarios' | 'receita_usd' | 'ano_lancamento' | 'titulo'
  order?: 'asc' | 'desc'
}

export async function fetchMovies(
  params: FetchMoviesParams = {}
): Promise<PaginatedMoviesResponse> {
  const response = await apiClient.get<PaginatedMoviesResponse>('/movies', {
    params: {
      page: params.page ?? 1,
      page_size: params.pageSize ?? 24,
      q: params.q || undefined,
      genre: params.genre || undefined,
      company: params.company || undefined,
      year: params.year || undefined,
      status: params.status || undefined,
      sort_by: params.sortBy ?? 'popularidade',
      order: params.order ?? 'desc'
    }
  })
  return response.data
}

export async function fetchGenres(): Promise<GenreItem[]> {
  const response = await apiClient.get<GenreItem[]>('/genres')
  return response.data
}

export async function fetchCompanies(): Promise<CompanyItem[]> {
  const response = await apiClient.get<CompanyItem[]>('/companies')
  return response.data
}

export async function fetchAvailableYears(): Promise<number[]> {
  const response = await apiClient.get<number[]>('/movies/available-years')
  return response.data
}

export async function fetchAvailableStatuses(): Promise<string[]> {
  const response = await apiClient.get<string[]>('/movies/available-statuses')
  return response.data
}
