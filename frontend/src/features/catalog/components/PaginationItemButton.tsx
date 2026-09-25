import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import React from 'react'

interface PaginationItemButtonProps {
  page: number | string
  isEllipsisStart: boolean
  currentPage: number
  onPageChange: (page: number) => void
}

export const PaginationItemButton: React.FC<PaginationItemButtonProps> = ({
  page,
  isEllipsisStart,
  currentPage,
  onPageChange
}) => {
  if (page === '...') {
    return (
      <span
        key={isEllipsisStart ? 'ellipsis-start' : 'ellipsis-end'}
        className="px-2 text-xs text-muted-foreground"
      >
        ...
      </span>
    )
  }

  const pageNum = page as number
  const isActive = pageNum === currentPage

  return (
    <Button
      type="button"
      variant="ghost"
      size="pagination"
      onClick={() => onPageChange(pageNum)}
    >
      {isActive && (
        <motion.span
          layoutId="activePageIndicator"
          className="absolute inset-0 rounded-lg bg-primary shadow-xs"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
        />
      )}
      <span className={isActive ? 'relative z-10 font-semibold text-primary-foreground' : 'relative z-10'}>
        {pageNum}
      </span>
    </Button>
  )
}
