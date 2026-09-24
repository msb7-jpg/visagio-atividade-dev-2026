import * as React from 'react'
import { Film } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = 'Nenhum resultado encontrado',
  description = 'Tente ajustar seus termos de busca ou filtros aplicados.',
  icon,
  action,
  className
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-white/10 bg-card/60 p-8 text-center backdrop-blur-sm',
        className
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground">
        {icon || <Film className="h-6 w-6 opacity-60" />}
      </div>
      <h3 className="mb-1 text-lg font-medium tracking-tight text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
