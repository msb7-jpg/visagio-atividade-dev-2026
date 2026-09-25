import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Film } from 'lucide-react'

export interface BlurImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
  alt: string
  containerClassName?: string
  fallbackIcon?: React.ReactNode
}

export const BlurImage: React.FC<BlurImageProps> = ({
  src,
  alt,
  className,
  containerClassName,
  fallbackIcon,
  loading = 'lazy',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const showFallback = !src || hasError

  if (showFallback) {
    return (
      <div
        className={cn(
          'flex h-full w-full flex-col items-center justify-center bg-white/5 p-4 text-muted-foreground',
          containerClassName
        )}
      >
        {fallbackIcon ?? <Film className="mb-2 h-8 w-8 opacity-30" />}
        <span className="text-center text-xs font-medium opacity-60">Sem imagem</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden bg-white/5',
        containerClassName
      )}
    >
      {/* Shimmer / Skeleton Placeholder enquanto carrega */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-white/5 via-white/10 to-white/5 backdrop-blur-md" />
      )}

      {/* Imagem com transição Blur-Up */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          'h-full w-full object-cover transition-all duration-500 ease-out',
          isLoaded ? 'blur-0 scale-100 opacity-100' : 'blur-md scale-105 opacity-0',
          className
        )}
        {...props}
      />
    </div>
  )
}
