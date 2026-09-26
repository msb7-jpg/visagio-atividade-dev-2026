import { Button } from '@/components/ui/button'
import type { GenreItem } from '@/features/catalog/api/catalogApi'
import { cn } from '@/lib/utils'
import { Check, Plus } from 'lucide-react'
import * as React from 'react'

interface GenreSelectorPillsProps {
  availableGenres: GenreItem[]
  selectedGenreIds: string[]
  onToggleGenre: (genreId: string) => void
  error?: string
  className?: string
}

export const GenreSelectorPills: React.FC<GenreSelectorPillsProps> = ({
  availableGenres,
  selectedGenreIds,
  onToggleGenre,
  error,
  className
}) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap gap-2">
        {availableGenres.map((genre) => {
          const isSelected = selectedGenreIds.includes(genre.sk_genre_id)
          return (
            <Button
              key={genre.sk_genre_id}
              type="button"
              variant={isSelected ? 'pill-active' : 'pill'}
              size="pill"
              onClick={() => onToggleGenre(genre.sk_genre_id)}
              aria-pressed={isSelected}
            >
              <span className="flex items-center gap-1.5">
                {isSelected ? (
                  <Check className="size-3 stroke-[2.5] text-primary-foreground" />
                ) : (
                  <Plus className="size-3 opacity-60" />
                )}
                <span>{genre.nome_genero}</span>
              </span>
            </Button>
          )
        })}
      </div>

      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}
