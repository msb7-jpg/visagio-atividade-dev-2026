import { use } from 'react'
import {
  CommandPaletteContext,
  type CommandPaletteContextValue
} from '@/features/command-palette/context/CommandPaletteContext'

export function useCommandPalette(): CommandPaletteContextValue {
  const context = use(CommandPaletteContext)
  if (!context) {
    throw new Error(
      'useCommandPalette deve ser utilizado dentro de um <CommandPaletteProvider>'
    )
  }
  return context
}

export { CommandPaletteProvider } from '@/features/command-palette/context/CommandPaletteProvider'
export type { CommandPaletteContextValue } from '@/features/command-palette/context/CommandPaletteContext'
