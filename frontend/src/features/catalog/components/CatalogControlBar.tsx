import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { GenreItem } from '@/features/catalog/api/catalogApi'
import type {
  SortByOption,
  SortOrderOption,
  ViewModeOption
} from '@/features/catalog/hooks/useCatalogParams'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpDown, LayoutGrid, List } from 'lucide-react'
import React from 'react'

interface CatalogControlBarProps {
  genres: GenreItem[]
  selectedGenre: string
  onSelectGenre: (genre: string) => void
  sortBy: SortByOption
  sortOrder?: SortOrderOption
  onSelectSortBy: (sort: SortByOption) => void
  onToggleSort?: (sort: SortByOption) => void
  viewMode: ViewModeOption
  onChangeViewMode: (mode: ViewModeOption) => void
  totalCount: number
}

const SORT_OPTIONS: { label: string; value: SortByOption }[] = [
  { label: 'Popularidade', value: 'popularidade' },
  { label: 'Avaliações', value: 'nota_media_usuarios' },
  { label: 'Bilheteria', value: 'receita_usd' },
  { label: 'Ano', value: 'ano_lancamento' },
  { label: 'Título', value: 'titulo' }
]

export const CatalogControlBar: React.FC<CatalogControlBarProps> = ({
  genres,
  selectedGenre,
  onSelectGenre,
  sortBy,
  sortOrder = 'desc',
  onSelectSortBy,
  onToggleSort,
  viewMode,
  onChangeViewMode,
  totalCount
}) => {
  const handleSortClick = (sortValue: SortByOption) => {
    if (onToggleSort) {
      onToggleSort(sortValue)
    } else {
      onSelectSortBy(sortValue)
    }
  }

  return (
    <div className="flex w-full flex-col gap-4 border-b border-white/10 bg-background/40 py-4 backdrop-blur-md">
      {/* Linha de Gêneros (Chips pílula roláveis horizontalmente com transição fluida) */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto scroll-smooth py-1">
        <Button
          type="button"
          variant={!selectedGenre ? 'pill-active' : 'pill'}
          size="pill"
          onClick={() => onSelectGenre('')}
          className="relative"
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
              variant={isSelected ? 'pill-active' : 'pill'}
              size="pill"
              onClick={() => onSelectGenre(isSelected ? '' : g.nome_genero)}
              className="relative"
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

      {/* Linha de Controles: Contagem de filmes, Itens Clicáveis de Ordenação e Toggle Grid/List */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="text-xs text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{totalCount.toLocaleString('pt-BR')}</span> filmes encontrados
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Ordenação Interativa via botões clicáveis com animação aceternity / smooth pill */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-md">
            <span className="flex items-center gap-1 px-2 text-xs font-medium text-white/50">
              <ArrowUpDown className="size-3 text-white/40" />
              <span className="hidden sm:inline">Ordenar:</span>
            </span>

            <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
              {SORT_OPTIONS.map((opt) => {
                const isActive = sortBy === opt.value
                const isAsc = sortOrder === 'asc'

                return (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={isActive ? 'sort-active' : 'sort'}
                    size="sort-pill"
                    onClick={() => handleSortClick(opt.value)}
                    aria-label={`Ordenar por ${opt.label} (${isActive ? (isAsc ? 'crescente' : 'decrescente') : 'clique para ordenar'})`}
                    className="group relative"
                  >
                    {/* Fundo ativo animado (Aceternity pill style com Framer Motion - Âmbar Suave / Translúcido) */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSortPill"
                        className="absolute inset-0 rounded-full border border-primary/30 bg-primary/15 shadow-[0_0_12px_rgba(234,179,8,0.15)]"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                      />
                    )}

                    <span className="relative z-10">{opt.label}</span>

                    {/* Seta animada com rotação suave ao alternar asc/desc */}
                    {isActive ? (
                      <motion.div
                        key={`${opt.value}-${sortOrder}`}
                        initial={{ scale: 0.6, rotate: isAsc ? 180 : 0, opacity: 0 }}
                        animate={{ scale: 1, rotate: isAsc ? 180 : 0, opacity: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 25
                        }}
                        className="relative z-10 flex items-center justify-center"
                      >
                        <ArrowDown className="size-3 stroke-[2.5]" />
                      </motion.div>
                    ) : (
                      <ArrowUpDown className="relative z-10 size-2.5 opacity-0 transition-opacity group-hover:opacity-60" />
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Alternador Grid / List Pílula Cápsula (Referência sort-by-block-and-list.png) */}
          <ToggleGroup
            type="single"
            variant="cinema"
            value={viewMode}
            onValueChange={(val) => {
              if (val) onChangeViewMode(val as ViewModeOption)
            }}
          >
            <ToggleGroupItem
              value="grid"
              size="icon-sm"
              aria-label="Exibição em Grid"
            >
              <LayoutGrid className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="list"
              size="icon-sm"
              aria-label="Exibição em Lista"
            >
              <List className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  )
}
