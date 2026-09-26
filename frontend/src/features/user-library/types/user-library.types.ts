export interface UserLibraryIdsDTO {
  favorites: string[]
  watchlist: string[]
}

export interface UserMovieInteractionDTO {
  sk_movie_id: string
  is_favorite: boolean
  in_watchlist: boolean
  updated_at: string
}

export interface UserLibraryMovieItemDTO {
  sk_movie_id: string
  id_filme: string
  titulo: string
  ano_lancamento: number | null
  duracao_minutos: number | null
  url_poster: string | null
  url_backdrop: string | null
  nota_media_usuarios: number | null
  qtd_avaliacoes_usuarios: number
  generos: string[]
  diretores: string[]
  is_favorite: boolean
  in_watchlist: boolean
  updated_at: string
}

export interface PaginatedUserLibraryMoviesDTO {
  items: UserLibraryMovieItemDTO[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
