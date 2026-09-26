/**
 * Tipagens estritas de rotas da aplicação utilizando Template Literal Types.
 * Elimina strings mágicas e garante autocompletion e checagem em tempo de compilação.
 */

/** Rotas estáticas fixas */
export type StaticRoute =
  | '/'
  | '/login'
  | '/admin/filmes/novo'

/** Rotas dinâmicas de detalhe de filme usando Template Literal Type */
export type DynamicMovieRoute = `/filmes/${string | number}`

/** Rotas dinâmicas de edição de filme no painel administrativo */
export type DynamicAdminMovieRoute = `/admin/filmes/${string | number}/editar`

/** Rotas de catálogo filtrado via query string usando Template Literal Type */
export type FilteredCatalogRoute = `/?genre=${string}` | `/?${string}`

/** União mestra de todas as rotas válidas da aplicação */
export type AppRoute =
  | StaticRoute
  | DynamicMovieRoute
  | DynamicAdminMovieRoute
  | FilteredCatalogRoute

/**
 * Construtores de rotas tipadas para evitar concatenação manual de strings.
 */
export const routes = {
  home: () => '/' as const,
  login: () => '/login' as const,
  movieDetail: (id: string | number): DynamicMovieRoute => `/filmes/${id}`,
  adminMovieCreate: () => '/admin/filmes/novo' as const,
  adminMovieEdit: (id: string | number): DynamicAdminMovieRoute =>
    `/admin/filmes/${id}/editar`,
  catalogGenre: (genre: string): FilteredCatalogRoute => `/?genre=${encodeURIComponent(genre)}`,
  catalogSearch: (query: string): FilteredCatalogRoute => `/?q=${encodeURIComponent(query)}`
} as const
