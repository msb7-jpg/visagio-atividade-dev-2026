import * as React from 'react'
import { cn } from 'cn'
import { Star } from 'lucide-react'

export interface StarRatingInputProps {
  value: number // Escala de 0 a 10 (ou convertida 0.5 a 5 estrelas)
  onChange?: (value: number) => void
  disabled?: boolean
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showScoreLabel?: boolean
  error?: string
  className?: string
}

const STAR_SIZES = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-7'
} as const

export function StarRatingInput({
  value,
  onChange,
  disabled = false,
  readOnly = false,
  size = 'md',
  showScoreLabel = true,
  error,
  className
}: StarRatingInputProps) {
  const [hoverScore, setHoverScore] = React.useState<number | null>(null)

  const activeScore = hoverScore !== null ? hoverScore : value
  const starCount = 5

  const handlePointerLeave = () => {
    if (!readOnly && !disabled) {
      setHoverScore(null)
    }
  }

  const starSizeClass = STAR_SIZES[size]
  const displayStars = (activeScore / 2).toFixed(1)

  return (
    <div
      className={cn('flex flex-col gap-1.5', className)}
      onMouseLeave={handlePointerLeave}
    >
      <div className="flex items-center gap-2">
        <div
          role="radiogroup"
          aria-label="Avaliação em estrelas"
          className="flex items-center gap-1"
        >
          {Array.from({ length: starCount }).map((_, index) => {
            const starNumber = index + 1
            const halfThreshold = starNumber * 2 - 1
            const fullThreshold = starNumber * 2

            const isFull = activeScore >= fullThreshold
            const isHalf = !isFull && activeScore >= halfThreshold

            const halfScore = halfThreshold
            const fullScore = fullThreshold

            return (
              <div
                key={starNumber}
                className={cn(
                  'relative inline-flex items-center justify-center transition-transform duration-150 select-none',
                  !disabled && !readOnly && 'hover:scale-110 active:scale-95'
                )}
                data-testid={`star-wrapper-${starNumber}`}
              >
                {/* Estrela base inativa */}
                <Star
                  className={cn(
                    starSizeClass,
                    'text-white/20 transition-colors duration-150'
                  )}
                  aria-hidden="true"
                />

                {/* Camada de preenchimento em tom primário âmbar cineclube */}
                <div
                  className={cn(
                    'pointer-events-none absolute inset-0 overflow-hidden transition-all duration-150',
                    isFull ? 'w-full' : isHalf ? 'w-1/2' : 'w-0'
                  )}
                  aria-hidden="true"
                >
                  <Star
                    className={cn(
                      starSizeClass,
                      'fill-primary text-primary drop-shadow-[0_0_8px_rgba(234,179,8,0.25)]'
                    )}
                  />
                </div>

                {/* Zonas de clique e hover */}
                {!readOnly && !disabled && (
                  <div className="absolute inset-0 flex">
                    {/* Metade Esquerda (Meia-estrela) */}
                    <div
                      role="button"
                      tabIndex={-1}
                      onClick={() => onChange?.(halfScore)}
                      onMouseEnter={() => setHoverScore(halfScore)}
                      aria-label={`${starNumber - 0.5} estrelas`}
                      className="h-full w-1/2 cursor-pointer focus:outline-none"
                    />

                    {/* Metade Direita (Estrela Completa) */}
                    <div
                      role="button"
                      tabIndex={-1}
                      onClick={() => onChange?.(fullScore)}
                      onMouseEnter={() => setHoverScore(fullScore)}
                      aria-label={`${starNumber} estrelas`}
                      className="h-full w-1/2 cursor-pointer focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Feedback Numérico Discreto (ex: 3.5 ★) */}
        {showScoreLabel && (
          <span className="font-mono text-xs font-semibold text-primary">
            {activeScore > 0 && `${displayStars} ★`}
          </span>
        )}
      </div>

      {error && (
        <span className="text-xs font-medium text-destructive">{error}</span>
      )}
    </div>
  )
}
