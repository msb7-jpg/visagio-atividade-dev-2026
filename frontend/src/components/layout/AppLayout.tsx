import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import {
  CommandPaletteProvider,
  useCommandPalette
} from '@/features/command-palette/hooks/useCommandPalette'
import { CommandPaletteContainer } from '@/features/command-palette/components/CommandPaletteContainer'
import { SearchVisibilityProvider } from '@/context/useSearchVisibility'

const AppLayoutContent: React.FC = () => {
  const { isOpen, setIsOpen, open } = useCommandPalette()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <Navbar onOpenCommandPalette={open} />

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <CommandPaletteContainer isOpen={isOpen} onOpenChange={setIsOpen} />
    </div>
  )
}

export const AppLayout: React.FC = () => {
  return (
    <CommandPaletteProvider>
      <SearchVisibilityProvider>
        <AppLayoutContent />
      </SearchVisibilityProvider>
    </CommandPaletteProvider>
  )
}
