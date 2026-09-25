import React from 'react'
import { Button } from '@/components/ui/button'

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
      variant={isActive ? 'default' : 'ghost'}
      size="sm"
      onClick={() => onPageChange(pageNum)}
      className={`h-8 w-8 rounded-md p-0 text-xs ${
        isActive
          ? 'bg-primary font-semibold text-primary-foreground shadow-xs'
          : 'text-muted-foreground hover:bg-white/10 hover:text-foreground'
      }`}
    >
      {pageNum}
    </Button>
  )
}
