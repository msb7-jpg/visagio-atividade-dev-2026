import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MediaExpandedLightboxDialog } from '@/features/movie-details/components/MediaExpandedLightboxDialog'
import { cn } from '@/lib/utils'
import { Film, Image as ImageIcon, ImageOff, Maximize2 } from 'lucide-react'
import * as React from 'react'

interface PosterLivePreviewProps {
  urlPoster?: string | null
  urlBackdrop?: string | null
  title?: string
  releaseYear?: number
  className?: string
}

const currentYear = new Date().getFullYear()

export const PosterLivePreview: React.FC<PosterLivePreviewProps> = ({
  urlPoster,
  urlBackdrop,
  title,
  releaseYear,
  className
}) => {
  const [activeView] = React.useState<'poster' | 'backdrop'>('poster')
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false)
  const [failedPosterUrl, setFailedPosterUrl] = React.useState<string | null>(null)
  const [failedBackdropUrl, setFailedBackdropUrl] = React.useState<string | null>(null)

  const trimmedPosterUrl = urlPoster?.trim()
  const trimmedBackdropUrl = urlBackdrop?.trim()

  const isValidHttpUrl = (url?: string) =>
    Boolean(url && url.length <= 2048 && (url.startsWith('http://') || url.startsWith('https://')))

  const isPosterFailed = Boolean(
    trimmedPosterUrl && (!isValidHttpUrl(trimmedPosterUrl) || failedPosterUrl === trimmedPosterUrl)
  )
  const hasValidPosterUrl = Boolean(trimmedPosterUrl && isValidHttpUrl(trimmedPosterUrl) && !isPosterFailed)

  const isBackdropFailed = Boolean(
    trimmedBackdropUrl && (!isValidHttpUrl(trimmedBackdropUrl) || failedBackdropUrl === trimmedBackdropUrl)
  )
  const hasValidBackdropUrl = Boolean(trimmedBackdropUrl && isValidHttpUrl(trimmedBackdropUrl) && !isBackdropFailed)

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {activeView === 'poster' ? (
        /* Card de Prévia do Pôster (2:3) */
        <div className="group relative aspect-2/3 w-full max-w-70 overflow-hidden rounded-xl border border-white/10 bg-card/80 shadow-2xl transition-all duration-300">
          {hasValidPosterUrl ? (
            <>
              <img
                src={trimmedPosterUrl}
                alt={title ? `Pôster de ${title}` : 'Prévia do pôster'}
                className="size-full object-cover transition-opacity duration-300"
                onError={() => setFailedPosterUrl(trimmedPosterUrl ?? null)}
                loading="lazy"
              />

              {/* Botão de expansão no hover */}
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="Ver artes em tela cheia"
                >
                  <span className="flex items-center gap-1.5">
                    <Maximize2 className="size-3.5" />
                    <span>Ver em Tela Cheia</span>
                  </span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex size-full flex-col items-center justify-center p-6 text-center text-muted-foreground">
              {isPosterFailed ? (
                <>
                  <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
                    <ImageOff className="size-6" />
                  </div>
                  <span className="text-xs font-medium text-destructive/90">
                    URL de pôster inacessível
                  </span>
                  <span className="mt-1 text-[11px] text-muted-foreground">
                    Verifique o link digitado
                  </span>
                </>
              ) : (
                <>
                  <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground">
                    <Film className="size-6 text-primary/70" />
                  </div>
                  <span className="text-xs font-medium text-foreground/80">
                    Prévia em Tempo Real
                  </span>
                  <span className="mt-1 text-[11px] text-muted-foreground">
                    Insira uma URL de pôster ao lado
                  </span>
                </>
              )}
            </div>
          )}

          {/* Gradiente inferior com título e ano */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-background/95 via-background/60 to-transparent p-4 pt-10">
            <Badge
              variant="glass"
              size="sm"
              className="mb-1"
            >
              Pôster 2:3
            </Badge>
            <h4 className="line-clamp-2 text-sm font-semibold tracking-tight text-white drop-shadow-xs">
              {title?.trim() || 'Título da Obra'}
            </h4>
            <span className="text-xs text-muted-foreground">
              {releaseYear || currentYear}
            </span>
          </div>
        </div>
      ) : (
        /* Card de Prévia do Backdrop Panorâmico (16:9) */
        <div className="group relative aspect-16/9 w-full max-w-[340px] overflow-hidden rounded-xl border border-white/10 bg-card/80 shadow-2xl transition-all duration-300">
          {hasValidBackdropUrl ? (
            <>
              <img
                src={trimmedBackdropUrl}
                alt={title ? `Backdrop de ${title}` : 'Prévia do backdrop'}
                className="size-full object-cover transition-opacity duration-300"
                onError={() => setFailedBackdropUrl(trimmedBackdropUrl ?? null)}
                loading="lazy"
              />

              {/* Botão de expansão no hover */}
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="Ver backdrop em tela cheia"
                >
                  <span className="flex items-center gap-1.5">
                    <Maximize2 className="size-3.5" />
                    <span>Ver em Tela Cheia</span>
                  </span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex size-full flex-col items-center justify-center p-6 text-center text-muted-foreground">
              {isBackdropFailed ? (
                <>
                  <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
                    <ImageOff className="size-6" />
                  </div>
                  <span className="text-xs font-medium text-destructive/90">
                    URL de backdrop inacessível
                  </span>
                  <span className="mt-1 text-[11px] text-muted-foreground">
                    Verifique o link digitado
                  </span>
                </>
              ) : (
                <>
                  <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground">
                    <ImageIcon className="size-6 text-primary/70" />
                  </div>
                  <span className="text-xs font-medium text-foreground/80">
                    Prévia Panorâmica
                  </span>
                  <span className="mt-1 text-[11px] text-muted-foreground">
                    Insira uma URL de backdrop ao lado
                  </span>
                </>
              )}
            </div>
          )}

          {/* Gradiente inferior com título e ano */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-background/95 via-background/60 to-transparent p-4 pt-10">
            <Badge
              variant="glass"
              size="sm"
              className="mb-1"
            >
              Backdrop 16:9
            </Badge>
            <h4 className="line-clamp-1 text-sm font-semibold tracking-tight text-white drop-shadow-xs">
              {title?.trim() || 'Título da Obra'}
            </h4>
            <span className="text-xs text-muted-foreground">
              {releaseYear || currentYear}
            </span>
          </div>
        </div>
      )}

      <span className="text-center text-[11px] text-muted-foreground">
        {activeView === 'poster'
          ? 'Proporção padrão de cinema (2:3)'
          : 'Proporção panorâmica cinematográfica (16:9)'}
      </span>

      {/* Mesma galeria cinematográfica em tela expandida usada na tela de detalhes */}
      <MediaExpandedLightboxDialog
        open={isLightboxOpen}
        onOpenChange={setIsLightboxOpen}
        titulo={title?.trim() || 'Prévia da Obra'}
        urlPoster={hasValidPosterUrl ? trimmedPosterUrl : null}
        urlBackdrop={hasValidBackdropUrl ? trimmedBackdropUrl : null}
        defaultMedia={activeView}
      />
    </div>
  )
}
