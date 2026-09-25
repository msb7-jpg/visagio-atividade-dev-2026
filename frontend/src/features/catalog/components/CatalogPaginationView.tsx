import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { calculatePageNumbers } from '@/features/catalog/utils/pagination-helper'
import { PaginationItemButton } from './PaginationItemButton'

interface CatalogPaginationViewProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const CatalogPaginationView: React.FC<CatalogPaginationViewProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null

  const pages = calculatePageNumbers(currentPage, totalPages)

  return (
    <nav className="flex items-center justify-center gap-1.5 py-8" aria-label="Navegação de páginas">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="gap-1 border-white/10 bg-white/5 px-3 text-xs hover:bg-white/10 disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((p, idx) => (
          <PaginationItemButton
            key={p === '...' ? (idx < 3 ? 'ellipsis-start' : 'ellipsis-end') : `page-${p}`}
            page={p}
            isEllipsisStart={idx < 3}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="gap-1 border-white/10 bg-white/5 px-3 text-xs hover:bg-white/10 disabled:opacity-30"
      >
        <span className="hidden sm:inline">Próximo</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}
