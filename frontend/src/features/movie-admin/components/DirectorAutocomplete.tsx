import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { movieAdminApi } from '@/features/movie-admin/api/movieAdminApi'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Plus, User } from 'lucide-react'
import * as React from 'react'

interface DirectorAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  error?: string
}

export const DirectorAutocomplete: React.FC<DirectorAutocompleteProps> = ({
  value,
  onChange,
  onBlur,
  disabled = false,
  error
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const searchTerm = value || ''

  const { data: directors = [], isLoading } = useQuery({
    queryKey: ['directors', searchTerm],
    queryFn: () => movieAdminApi.searchDirectors(searchTerm, 10),
    enabled: isOpen && searchTerm.trim().length >= 1,
    staleTime: 30 * 1000
  })

  // Fecha dropdown ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        onBlur?.()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onBlur])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onChange(val)
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const handleSelect = (directorName: string) => {
    onChange(directorName)
    setIsOpen(false)
  }

  const trimmedSearch = searchTerm.trim()
  const exactMatchExists = directors.some(
    (d) => d.nome_pessoa.toLowerCase() === trimmedSearch.toLowerCase()
  )

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      <Input
        id="diretor"
        name="diretor"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder="Ex: Christopher Nolan, Denis Villeneuve..."
        variant="glass"
        disabled={disabled}
        aria-invalid={Boolean(error)}
        autoComplete="off"
      />

      {error && <span className="text-xs text-destructive">{error}</span>}

      {/* Dropdown com sugestões e opção de criação */}
      {isOpen && trimmedSearch.length >= 1 && (
        <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-white/10 bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin text-primary" />
              <span>Buscando diretores no catálogo...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {directors.map((director) => (
                <Button
                  key={director.sk_person_id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSelect(director.nome_pessoa)}
                  className="w-full justify-start text-left"
                >
                  <span className="flex items-center gap-2 truncate">
                    <User className="size-3.5 shrink-0 text-primary/70" />
                    <span className="truncate">{director.nome_pessoa}</span>
                  </span>
                </Button>
              ))}

              {!exactMatchExists && trimmedSearch.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelect(trimmedSearch)}
                  className="w-full justify-start text-left"
                >
                  <span className="flex items-center gap-2 truncate text-primary">
                    <Plus className="size-3.5 shrink-0" />
                    <span className="truncate">Cadastrar novo diretor: <strong>"{trimmedSearch}"</strong></span>
                  </span>
                </Button>
              )}
            </div>
          )}

          {!isLoading && directors.length === 0 && exactMatchExists && (
            <div className="py-2 text-center text-xs text-muted-foreground">
              Nenhum outro diretor encontrado
            </div>
          )}
        </div>
      )}
    </div>
  )
}
