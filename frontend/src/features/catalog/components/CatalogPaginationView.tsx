import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { calculatePageNumbers } from '@/features/catalog/utils/pagination-helper'
import { PaginationItemButton } from './PaginationItemButton'
import { motion } from 'framer-motion'

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
    <motion.nav
      layout
      transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
      className="flex items-center justify-center gap-1.5 py-8"
      aria-label="Navegação de páginas"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      <motion.div
        layout
        transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
        className="flex items-center gap-1"
      >
        {pages.map((p, idx) => (
          <PaginationItemButton
            key={p === '...' ? (idx < 3 ? 'ellipsis-start' : 'ellipsis-end') : `page-${p}`}
            page={p}
            isEllipsisStart={idx < 3}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        ))}
      </motion.div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span className="hidden sm:inline">Próximo</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </motion.nav>
  )
}
