import { Tooltip } from '@/components/ui/tooltip-card'
import { cn } from '@/lib/utils'
import { HelpCircle, RotateCcw, SlidersHorizontal, Star, StarHalf } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'

export interface StarRatingInputProps {
  value: number // Escala de 0 a 10 (ou convertida 0.5 a 5 estrelas)
  onChange?: (value: number) => void
  disabled?: boolean
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showScoreLabel?: boolean
  showTooltip?: boolean
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
  showTooltip = true,
  error,
  className
}: StarRatingInputProps) {
  const [hoverScore, setHoverScore] = React.useState<number | null>(null)
  const isDraggingRef = React.useRef(false)
  const groupRef = React.useRef<HTMLDivElement>(null)

  const activeScore = hoverScore !== null ? hoverScore : value
  const starCount = 5

  const calculateScoreFromPointer = (clientX: number): number => {
    if (!groupRef.current) return 0
    const rect = groupRef.current.getBoundingClientRect()
    if (rect.width <= 0) return 0

    const relativeX = clientX - rect.left
    // Se arrastar à esquerda da área das estrelas ou nos primeiros 4px, nota 0
    if (relativeX <= 4) return 0
    if (relativeX >= rect.width) return 10

    const starWidth = rect.width / starCount
    const starIndex = Math.floor(relativeX / starWidth)
    const offsetInStar = relativeX - starIndex * starWidth
    const isHalf = offsetInStar < starWidth / 2

    const score = isHalf ? (starIndex + 1) * 2 - 1 : (starIndex + 1) * 2
    return Math.max(0, Math.min(10, score))
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (readOnly || disabled) return
    isDraggingRef.current = true
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } catch {
      // Ignore if pointer capture is not supported
    }
    const newScore = calculateScoreFromPointer(e.clientX)
    setHoverScore(newScore)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (readOnly || disabled) return
    if (isDraggingRef.current) {
      const newScore = calculateScoreFromPointer(e.clientX)
      setHoverScore(newScore)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (readOnly || disabled) return
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      try {
        if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
          ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
        }
      } catch {
        // Ignore
      }
      const finalScore = calculateScoreFromPointer(e.clientX)
      setHoverScore(null)
      onChange?.(finalScore)
    }
  }

  const handlePointerLeave = () => {
    if (!readOnly && !disabled && !isDraggingRef.current) {
      setHoverScore(null)
    }
  }

  const handleStarClick = (score: number) => {
    if (readOnly || disabled) return
    // Se clicar exatamente na mesma nota já selecionada (ou na primeira meia-estrela), alterna para 0
    if (value === score) {
      onChange?.(0)
    } else {
      onChange?.(score)
    }
  }

  const starSizeClass = STAR_SIZES[size]

  return (
    <div
      className={cn('flex flex-col gap-1.5', className)}
      onMouseLeave={handlePointerLeave}
    >
      <div className="flex items-center gap-2.5">
        <div
          ref={groupRef}
          role="radiogroup"
          aria-label="Avaliação em estrelas"
          className={cn(
            'flex touch-none items-center gap-1 select-none',
            !disabled && !readOnly && 'cursor-pointer'
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
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
                  <div className="pointer-events-auto absolute inset-0 flex">
                    {/* Metade Esquerda (Meia-estrela) */}
                    <div
                      role="radio"
                      aria-checked={activeScore === halfScore}
                      tabIndex={-1}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStarClick(halfScore)
                      }}
                      onMouseEnter={() => setHoverScore(halfScore)}
                      aria-label={`${starNumber - 0.5} estrelas`}
                      className="h-full w-1/2 cursor-pointer"
                    />

                    {/* Metade Direita (Estrela Completa) */}
                    <div
                      role="radio"
                      aria-checked={activeScore === fullScore}
                      tabIndex={-1}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStarClick(fullScore)
                      }}
                      onMouseEnter={() => setHoverScore(fullScore)}
                      aria-label={`${starNumber} estrelas`}
                      className="h-full w-1/2 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Feedback Numérico na Escala de 0 a 10 */}
        {showScoreLabel && (
          <div className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-primary">
            <span>{activeScore.toFixed(1)}</span>
            <span className="text-[11px] font-normal text-muted-foreground/70">
              / 10
            </span>
          </div>
        )}

        {/* Tooltip Educativo com Instruções de Interação */}
        {showTooltip && !readOnly && !disabled && (
          <Tooltip
            content={
              <div className="space-y-2 p-1 text-xs">
                <p className="font-semibold text-foreground">Como classificar:</p>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li className="leading-snug">
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      <SlidersHorizontal className="size-3 shrink-0 text-primary" />
                      Arrastar:
                    </span>{' '}
                    <span>deslize sobre as estrelas para ajustar a nota de 0 a 10.</span>
                  </li>
                  <li className="leading-snug">
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      <StarHalf className="size-3 shrink-0 text-primary" />
                      Meia-estrela:
                    </span>{' '}
                    <span>clique no lado esquerdo ou direito de cada estrela.</span>
                  </li>
                  <li className="leading-snug">
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      <RotateCcw className="size-3 shrink-0 text-primary" />
                      Zerar nota:
                    </span>{' '}
                    <span>arraste para fora à esquerda ou clique na mesma nota.</span>
                  </li>
                </ul>
              </div>
            }
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="cursor-help"
              aria-label="Como funciona a avaliação"
            >
              <HelpCircle className="size-3.5" />
            </Button>
          </Tooltip>
        )}
      </div>

      {error && (
        <span className="text-xs font-medium text-destructive">{error}</span>
      )}
    </div>
  )
}
