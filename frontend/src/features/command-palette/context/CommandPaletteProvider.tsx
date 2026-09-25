import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CommandPaletteContext, type CommandPaletteContextValue } from './CommandPaletteContext'

export interface CommandPaletteProviderProps {
  children: React.ReactNode
}

export const CommandPaletteProvider: React.FC<CommandPaletteProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Captura Ctrl+K ou Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const value = useMemo<CommandPaletteContextValue>(
    () => ({
      isOpen,
      setIsOpen,
      open,
      close,
      toggle
    }),
    [isOpen, open, close, toggle]
  )

  return (
    <CommandPaletteContext value={value}>
      {children}
    </CommandPaletteContext>
  )
}
