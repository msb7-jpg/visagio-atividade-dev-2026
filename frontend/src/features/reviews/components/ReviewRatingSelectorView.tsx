import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Frown, Meh, Smile, Sparkles, Star } from 'lucide-react'

interface ReviewRatingSelectorViewProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  error?: string
}

function getMoodIcon(rating: number) {
  if (rating === 0) {
    return <Meh className="size-5 text-muted-foreground transition-all duration-300" />
  }
  if (rating <= 4) {
    return <Frown className="size-5 text-destructive transition-all duration-300" />
  }
  if (rating <= 7) {
    return <Meh className="size-5 text-primary transition-all duration-300" />
  }
  if (rating <= 9) {
    return <Smile className="size-5 text-profit transition-all duration-300" />
  }
  return <Sparkles className="size-5 text-primary transition-all duration-300" />
}

function getMoodDescription(rating: number): string {
  if (rating === 0) return 'Selecione uma nota de 1 a 10'
  if (rating <= 2) return 'Muito fraco'
  if (rating <= 4) return 'Abaixo da média'
  if (rating <= 6) return 'Regular / Razoável'
  if (rating <= 8) return 'Bom / Muito bom'
  if (rating <= 9) return 'Excelente'
  return 'Obra-prima imperdível!'
}

export function ReviewRatingSelectorView({
  value,
  onChange,
  disabled = false,
  error
}: ReviewRatingSelectorViewProps) {
  const ratingScores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Nota (0 a 10)</span>
        <motion.div
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center gap-1.5 text-xs font-semibold"
        >
          {getMoodIcon(value)}
          <span className="text-foreground">{value > 0 ? `${value}/10` : '—'}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{getMoodDescription(value)}</span>
        </motion.div>
      </div>

      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
        {ratingScores.map((score) => {
          const isSelected = value === score
          const isLowerOrEqual = value >= score
          const variant = isSelected
            ? 'rating-selected'
            : isLowerOrEqual
              ? 'rating-active'
              : 'rating'

          return (
            <Button
              key={score}
              type="button"
              variant={variant}
              size="rating-score"
              disabled={disabled}
              onClick={() => onChange(score)}
              aria-label={`Avaliar com nota ${score}`}
            >
              <Star
                className={`size-3 ${
                  isLowerOrEqual ? 'fill-current text-primary' : 'opacity-40'
                }`}
              />
              <span>{score}</span>
            </Button>
          )
        })}
      </div>

      {error && <span className="text-xs font-medium text-destructive">{error}</span>}
    </div>
  )
}
