import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { useCommandPalette } from '@/features/command-palette/hooks/useCommandPalette'
import { CommandPaletteContainer } from '@/features/command-palette/components/CommandPaletteContainer'
import { SearchVisibilityProvider } from '@/context/useSearchVisibility'

export const AppLayout: React.FC = () => {
  const { isOpen, setIsOpen, open } = useCommandPalette()

  return (
    <SearchVisibilityProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <Navbar onOpenCommandPalette={open} />

        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>

        <CommandPaletteContainer isOpen={isOpen} onOpenChange={setIsOpen} />
      </div>
    </SearchVisibilityProvider>
  )
}
