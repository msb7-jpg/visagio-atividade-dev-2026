import { routes } from '@/routes/routes.types'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Loader2, X, Film, LogIn, LogOut, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Kbd } from '@/components/ui/kbd'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useSearchVisibility } from '@/context/useSearchVisibility'
import { cn } from '@/lib/utils'

interface NavbarProps {
  onOpenCommandPalette: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const { isAuthenticated, user, logout } = useAuth()
  const { isHeroSearchVisible, searchQuery, isFetching, onClearSearch } = useSearchVisibility()
  const navigate = useNavigate()

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

        {/* Botão Gatilho da Command Palette (Central / Direita com Sincronização) */}
        <div
          className={cn(
            'mx-4 hidden max-w-md flex-1 transition-all duration-300 md:block',
            isHeroSearchVisible
              ? 'pointer-events-none -translate-y-1 scale-95 opacity-0'
              : 'pointer-events-auto translate-y-0 scale-100 opacity-100'
          )}
        >
          <Button
            type="button"
            variant="outline"
            onClick={onOpenCommandPalette}
            className="group flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-muted-foreground shadow-xs transition-all hover:border-white/20 hover:bg-white/10 hover:text-foreground"
          >
            <div className="flex min-w-0 items-center gap-2">
              {isFetching ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
              ) : (
                <Search className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              )}
              <span
                className={cn(
                  'truncate text-left',
                  searchQuery ? 'font-medium text-foreground' : 'text-muted-foreground'
                )}
              >
                {searchQuery || 'Buscar filmes, diretores, gêneros...'}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {searchQuery && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    onClearSearch?.()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation()
                      onClearSearch?.()
                    }
                  }}
                  className="rounded-xs p-0.5 text-muted-foreground hover:bg-white/10 hover:text-white"
                  aria-label="Limpar busca da navbar"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <Kbd className="border border-white/10 bg-white/10 font-mono text-[10px] text-white">
                ⌘K
              </Kbd>
            </div>
          </Button>
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
