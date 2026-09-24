import type { ReactNode } from 'react'
import { Tooltip } from '@/components/ui/tooltip-card'
import { cn } from '@/lib/utils'

interface RequiredFieldBadgeProps {
  className?: string
  tooltipText?: string
  tooltipContent?: ReactNode
}

export function RequiredFieldBadge({
  className,
  tooltipText = 'Campo obrigatório',
  tooltipContent
}: RequiredFieldBadgeProps) {
  const content = tooltipContent || (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-primary">Campo Obrigatório</span>
      <span className="text-xs text-muted-foreground">{tooltipText}</span>
    </div>
  )

  return (
    <Tooltip
      content={content}
      containerClassName={cn('ml-1 inline-flex items-center align-middle select-none', className)}
    >
      <span
        className="cursor-help font-bold text-primary transition-opacity hover:opacity-80"
        aria-label={tooltipText}
      >
        *
      </span>
    </Tooltip>
  )
}
