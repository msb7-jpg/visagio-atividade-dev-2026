/**
 * Tipagens estritas de rotas da aplicação utilizando Template Literal Types.
 * Elimina strings mágicas e garante autocompletion e checagem em tempo de compilação.
 */

/** Rotas estáticas fixas */
export type StaticRoute =
  | '/'
  | '/login'

/** Rotas dinâmicas de detalhe de filme usando Template Literal Type */
export type DynamicMovieRoute = `/filmes/${string | number}`

/** Rotas de catálogo filtrado via query string usando Template Literal Type */
export type FilteredCatalogRoute = `/?genre=${string}` | `/?${string}`

/** União mestra de todas as rotas válidas da aplicação */
export type AppRoute = StaticRoute | DynamicMovieRoute | FilteredCatalogRoute

/**
 * Construtores de rotas tipadas para evitar concatenação manual de strings.
 */
export const routes = {
  home: () => '/' as const,
  login: () => '/login' as const,
  movieDetail: (id: string | number): DynamicMovieRoute => `/filmes/${id}`,
  catalogGenre: (genre: string): FilteredCatalogRoute => `/?genre=${encodeURIComponent(genre)}`,
  catalogSearch: (query: string): FilteredCatalogRoute => `/?q=${encodeURIComponent(query)}`
} as const
