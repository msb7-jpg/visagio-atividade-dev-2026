import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton'

export function MovieDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-8" data-testid="movie-details-skeleton">
      {/* Backdrop skeleton */}
      <LoadingSkeleton className="h-64 w-full rounded-2xl sm:h-80 md:h-96" />

      {/* Hero integrado em 2 colunas */}
      <div className="relative z-10 mx-auto -mt-20 flex max-w-6xl flex-col items-start gap-6 px-4 sm:px-6 md:-mt-28 md:flex-row md:gap-8">
        <LoadingSkeleton className="aspect-2/3 w-48 shrink-0 rounded-2xl sm:w-56 md:w-64 lg:w-72" />
        <div className="w-full flex-1 space-y-4 pt-2">
          <LoadingSkeleton className="h-4 w-28" />
          <LoadingSkeleton className="h-4 w-40" />
          <LoadingSkeleton className="h-10 w-3/4" />
          <div className="flex gap-2">
            <LoadingSkeleton className="h-6 w-16 rounded-full" />
            <LoadingSkeleton className="h-6 w-20 rounded-full" />
          </div>
          {/* Ratings strip */}
          <div className="flex gap-3 pt-2">
            <LoadingSkeleton className="h-7 w-24 rounded-full" />
            <LoadingSkeleton className="h-7 w-24 rounded-full" />
            <LoadingSkeleton className="h-7 w-36 rounded-full" />
          </div>
          {/* Financial KPIs */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 sm:grid-cols-4">
            <LoadingSkeleton className="h-12 rounded-lg" />
            <LoadingSkeleton className="h-12 rounded-lg" />
            <LoadingSkeleton className="h-12 rounded-lg" />
            <LoadingSkeleton className="h-12 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Sinopse e equipe */}
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="max-w-3xl space-y-3 border-t border-white/10 pt-4">
          <LoadingSkeleton className="h-4 w-20" />
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-3 border-t border-white/10 pt-4">
          <LoadingSkeleton className="h-4 w-36" />
          <LoadingSkeleton className="h-4 w-72" />
          <LoadingSkeleton className="h-4 w-60" />
        </div>
      </div>
    </div>
  )
}
