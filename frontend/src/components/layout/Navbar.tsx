import { routes } from '@/routes/routes.types'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Loader2, X, Film, LogIn, LogOut, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useSearchVisibility } from '@/context/useSearchVisibility'
import { cn } from '@/lib/utils'
import React, { useEffect, useRef } from 'react'

interface NavbarProps {
  onOpenCommandPalette: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const { isAuthenticated, user, logout } = useAuth()
  const {
    isHeroSearchVisible,
    searchQuery,
    setSearchQuery,
    isFetching,
    onClearSearch,
    onSearchChange
  } = useSearchVisibility()
  const navigate = useNavigate()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(val)
      }
    }, 350)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      if (onSearchChange) {
        onSearchChange(searchQuery)
      } else {
        navigate(routes.catalogSearch(searchQuery))
      }
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    onClearSearch?.()
    onSearchChange?.('')
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo / Brand */}
        <Link
          to={routes.home()}
          className="group flex items-center gap-2.5 transition-transform active:scale-95"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary shadow-[0_0_15px_rgba(234,179,8,0.15)] transition-all group-hover:border-primary/40 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]">
            <Film className="h-5 w-5 text-primary transition-transform group-hover:rotate-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              RocketLab Cinema
            </span>
            <span className="-mt-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Catálogo & Analytics
            </span>
          </div>
        </Link>

        {/* Barra de Busca da Navbar com Padronização Visual e Proporcional do CatalogHeroView */}
        <div
          data-testid="navbar-search-bar"
          className={cn(
            'group relative mx-4 hidden max-w-md flex-1 items-center rounded-lg shadow-sm transition-all duration-300 md:flex',
            isFetching
              ? 'shadow-[0_0_15px_rgba(234,179,8,0.2)] ring-1 ring-primary/40'
              : 'hover:border-white/30',
            isHeroSearchVisible
              ? 'pointer-events-none -translate-y-1 scale-95 opacity-0'
              : 'pointer-events-auto translate-y-0 scale-100 opacity-100'
          )}
        >
          {isFetching ? (
            <Loader2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 animate-spin text-primary transition-colors" />
          ) : (
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          )}

          <Input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Buscar filmes, diretores, gêneros..."
            className="h-9 w-full rounded-lg border-white/15 bg-black/50 py-1.5 pr-20 pl-9 text-sm transition-all placeholder:text-muted-foreground/60 hover:border-white/30 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40"
            aria-label="Buscar filmes, diretores, gêneros..."
          />

          <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1.5">
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-6 w-6 text-muted-foreground hover:text-white"
                aria-label="Limpar busca da navbar"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenCommandPalette}
              className="flex h-6 items-center gap-1 rounded-md border-white/10 bg-white/5 px-1.5 font-mono text-[11px] text-white/80 hover:bg-white/10"
              aria-label="Abrir command palette"
              title="Abrir busca rápida (⌘K)"
            >
              <span>⌘K</span>
            </Button>
          </div>
        </div>

        {/* Ações / Autenticação */}
        <div className="flex items-center gap-2">
          {/* Botão de busca mobile com feedback de loading */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenCommandPalette}
            className={cn(
              'text-muted-foreground transition-all duration-300 hover:text-foreground md:hidden',
              isHeroSearchVisible
                ? 'pointer-events-none scale-75 opacity-0'
                : 'pointer-events-auto scale-100 opacity-100'
            )}
            aria-label="Abrir busca"
          >
            {isFetching ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="hidden items-center gap-1.5 rounded-full border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary sm:flex"
              >
                <ShieldCheck className="size-3.5 text-primary" />
                <span className="max-w-30 truncate font-medium">
                  {user?.nome || 'Admin'}
                </span>
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(routes.login())}
              className="gap-1.5 border-white/15 bg-white/5 text-xs text-white hover:bg-white/10"
            >
              <LogIn className="h-4 w-4 text-primary" />
              <span>Entrar</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
