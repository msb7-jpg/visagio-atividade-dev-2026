import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { GenreItem } from '@/features/catalog/api/catalogApi'
import type { SortByOption, ViewModeOption } from '@/features/catalog/hooks/useCatalogParams'
import { cn } from '@/lib/utils'
import { ArrowDownUp, LayoutGrid, List } from 'lucide-react'
import { motion } from 'framer-motion'
import React from 'react'

interface CatalogControlBarProps {
  genres: GenreItem[]
  selectedGenre: string
  onSelectGenre: (genre: string) => void
  sortBy: SortByOption
  onSelectSortBy: (sort: SortByOption) => void
  viewMode: ViewModeOption
  onChangeViewMode: (mode: ViewModeOption) => void
  totalCount: number
}

const SORT_OPTIONS: { label: string; value: SortByOption }[] = [
  { label: 'Mais Populares', value: 'popularidade' },
  { label: 'Maior Nota dos Usuários', value: 'nota_media_usuarios' },
  { label: 'Maior Bilheteria (USD)', value: 'receita_usd' },
  { label: 'Ano de Lançamento', value: 'ano_lancamento' },
  { label: 'Título (A-Z)', value: 'titulo' }
]

export const CatalogControlBar: React.FC<CatalogControlBarProps> = ({
  genres,
  selectedGenre,
  onSelectGenre,
  sortBy,
  onSelectSortBy,
  viewMode,
  onChangeViewMode,
  totalCount
}) => {
  return (
    <div className="flex w-full flex-col gap-4 border-b border-white/10 bg-background/50 py-4">
      {/* Linha de Gêneros (Chips pílula roláveis horizontalmente com transição fluida) */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto scroll-smooth py-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onSelectGenre('')}
          className={cn(
            'relative h-auto shrink-0 rounded-full px-3.5 py-1 text-xs font-medium transition-colors duration-200',
            !selectedGenre
              ? 'font-semibold text-primary-foreground hover:bg-transparent hover:text-primary-foreground'
              : 'border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
          )}
        >
          {!selectedGenre && (
            <motion.span
              layoutId="activeGenrePill"
              className="absolute inset-0 rounded-full bg-primary shadow-xs"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
            />
          )}
          <span className="relative z-10">Todos os Gêneros</span>
        </Button>

        {genres.map((g) => {
          const isSelected = selectedGenre.toLowerCase() === g.nome_genero.toLowerCase()
          return (
            <Button
              key={g.sk_genre_id}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onSelectGenre(isSelected ? '' : g.nome_genero)}
              className={cn(
                'relative h-auto shrink-0 rounded-full px-3.5 py-1 text-xs font-medium transition-colors duration-200',
                isSelected
                  ? 'font-semibold text-primary-foreground hover:bg-transparent hover:text-primary-foreground'
                  : 'border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
              )}
            >
              {isSelected && (
                <motion.span
                  layoutId="activeGenrePill"
                  className="absolute inset-0 rounded-full bg-primary shadow-xs"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                />
              )}
              <span className="relative z-10">{g.nome_genero}</span>
            </Button>
          )
        })}
      </div>

      {/* Linha de Controles: Contagem de filmes, Dropdown/Select de Ordenação e Toggle Grid/List */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="text-xs text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{totalCount.toLocaleString('pt-BR')}</span> filmes encontrados
        </div>

        <div className="flex items-center gap-3">
          {/* Ordenação */}
          <div className="flex items-center gap-2">
            <Select
              value={sortBy}
              onValueChange={(val) => onSelectSortBy(val as SortByOption)}
            >
              <SelectTrigger
                size="sm"
                className="gap-2 border-white/10 bg-white/5 text-xs text-foreground hover:bg-white/10"
              >
                <ArrowDownUp className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-black/95 text-foreground backdrop-blur-xl">
                <SelectGroup>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="cursor-pointer text-xs focus:bg-white/10 focus:text-primary"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Alternador Grid / List Pílula Cápsula (Referência sort-by-block-and-list.png) */}
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(val) => {
              if (val) onChangeViewMode(val as ViewModeOption)
            }}
            className="rounded-lg border border-white/10 bg-black/40 p-0.5"
          >
            <ToggleGroupItem
              value="grid"
              size="sm"
              aria-label="Exibição em Grid"
              className={cn(
                'h-7 w-7 p-0 hover:text-white/80 data-[state=off]:text-white/40 data-[state=on]:bg-white/15 data-[state=on]:text-white'
              )}
            >
              <LayoutGrid className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="list"
              size="sm"
              aria-label="Exibição em Lista"
              className={cn(
                'h-7 w-7 p-0 hover:text-white/80 data-[state=off]:text-white/40 data-[state=on]:bg-white/15 data-[state=on]:text-white'
              )}
            >
              <List className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  )
}
