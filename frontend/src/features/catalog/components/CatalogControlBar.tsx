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
import type {
  SortByOption,
  SortOrderOption,
  ViewModeOption
} from '@/features/catalog/hooks/useCatalogParams'
import { Activity, ArrowDownUp, Calendar, Clapperboard, LayoutGrid, List } from 'lucide-react'
import React from 'react'

interface CatalogControlBarProps {
  genres: GenreItem[]
  selectedGenre: string
  onSelectGenre: (genre: string) => void
  availableYears?: number[]
  selectedYear?: number
  onSelectYear?: (year: number | undefined) => void
  availableStatuses?: string[]
  selectedStatus?: string
  onSelectStatus?: (status: string) => void
  sortBy: SortByOption
  sortOrder?: SortOrderOption
  onSelectSortBy: (sort: SortByOption) => void
  onToggleSort?: (sort: SortByOption) => void
  viewMode: ViewModeOption
  onChangeViewMode: (mode: ViewModeOption) => void
  totalCount: number
}

const DEFAULT_STATUSES = ['Lançado', 'Não Lançado', 'Pós-Produção', 'Em Produção', 'Planejado']

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
  availableYears = [],
  selectedYear,
  onSelectYear,
  availableStatuses = [],
  selectedStatus,
  onSelectStatus,
  sortBy,
  sortOrder: _sortOrder,
  onSelectSortBy,
  onToggleSort: _onToggleSort,
  viewMode,
  onChangeViewMode,
  totalCount
}) => {
  const displayStatuses =
    availableStatuses.length > 0 ? availableStatuses : DEFAULT_STATUSES
  return (
    <div className="flex w-full flex-col gap-4 border-b border-white/10 bg-background/40 py-4 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Contagem total de filmes */}
        <div className="text-xs text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{totalCount.toLocaleString('pt-BR')}</span> filmes encontrados
        </div>

        {/* Controles: Dropdowns de Filtro (Gênero, Ano) e Ordenação + Toggle Grid/List */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dropdown de Gênero */}
          <div className="flex items-center gap-1.5">
            <Select
              value={selectedGenre || 'all'}
              onValueChange={(val) => onSelectGenre(val === 'all' ? '' : val)}
            >
              <SelectTrigger
                size="sm"
                aria-label="Filtrar por gênero"
              >
                <Clapperboard className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder="Todos os Gêneros" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectGroup>
                  <SelectItem value="all">
                    Todos os Gêneros
                  </SelectItem>
                  {genres.map((g) => (
                    <SelectItem
                      key={g.sk_genre_id}
                      value={g.nome_genero}
                    >
                      {g.nome_genero}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown de Ano de Lançamento (baseado nos anos distintos do banco) */}
          {availableYears.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Select
                value={selectedYear ? String(selectedYear) : 'all'}
                onValueChange={(val) =>
                  onSelectYear?.(val === 'all' ? undefined : Number(val))
                }
              >
                <SelectTrigger
                  size="sm"
                  aria-label="Filtrar por ano"
                >
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Todos os Anos" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectGroup>
                    <SelectItem value="all">
                      Todos os Anos
                    </SelectItem>
                    {availableYears.map((yr) => (
                      <SelectItem
                        key={yr}
                        value={String(yr)}
                      >
                        {yr}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Dropdown de Status de Lançamento */}
          <div className="flex items-center gap-1.5">
            <Select
              value={selectedStatus || 'all'}
              onValueChange={(val) => onSelectStatus?.(val === 'all' ? '' : val)}
            >
              <SelectTrigger
                size="sm"
                aria-label="Filtrar por status"
              >
                <Activity className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectGroup>
                  <SelectItem value="all">
                    Todos os Status
                  </SelectItem>
                  {displayStatuses.map((st) => (
                    <SelectItem
                      key={st}
                      value={st}
                    >
                      {st}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown Clássico de Ordenação */}
          <div className="flex items-center gap-1.5">
            <Select
              value={sortBy}
              onValueChange={(val) => onSelectSortBy(val as SortByOption)}
            >
              <SelectTrigger
                size="sm"
                aria-label="Ordenar catálogo"
              >
                <ArrowDownUp className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Alternador Grid / List Pílula Cápsula */}
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
