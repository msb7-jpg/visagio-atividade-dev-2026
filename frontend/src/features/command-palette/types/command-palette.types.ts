import type { QuickSearchMovieItem } from '@/features/command-palette/api/spotlightApi'
import type { AppRoute } from '@/routes/routes.types'

/**
 * Identificadores de ações de sistema (operações não-navegacionais).
 */
export type CommandSystemAction = 'logout'

/**
 * Ações de navegação estritas usando Template Literal Types de rotas.
 */
export type CommandRouteAction = AppRoute

/**
 * União completa de ações disparáveis pela Command Palette.
 */
export type CommandPaletteAction = CommandRouteAction | CommandSystemAction

/**
 * Constantes tipadas para evitar strings mágicas nas ações.
 */
export const COMMAND_ACTIONS = {
  NAVIGATE_HOME: '/' as const,
  NAVIGATE_LOGIN: '/login' as const,
  LOGOUT: 'logout' as const
} as const

/**
 * Definição estruturada de um item de ação rápida na paleta de comando.
 * Permite incremento contínuo conforme novos recursos e atalhos forem adicionados.
 */
export interface CommandActionItem {
  id: string
  label: string
  action: CommandPaletteAction
  shortcut?: string
  destructive?: boolean
  requiresAuth?: boolean
}

/**
 * Tipo para item de filme retornado na busca da Command Palette.
 */
export type CommandMovieItem = QuickSearchMovieItem

/**
 * Tipo para item de gênero selecionável.
 */
export type CommandGenreItem = string
