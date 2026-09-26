import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

interface MediaExpandedLightboxDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  titulo: string
  urlPoster?: string | null
  urlBackdrop?: string | null
  defaultMedia?: 'poster' | 'backdrop'
}

export const MediaExpandedLightboxDialog: React.FC<MediaExpandedLightboxDialogProps> = ({
  open,
  onOpenChange,
  titulo,
  urlPoster,
  urlBackdrop,
  defaultMedia = 'poster'
}) => {
  const [selectedMedia, setSelectedMedia] = React.useState<'poster' | 'backdrop' | null>(null)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedMedia(null)
    }
    onOpenChange(nextOpen)
  }

  const effectiveMedia: 'poster' | 'backdrop' =
    selectedMedia ??
    (defaultMedia === 'backdrop' && urlBackdrop ? 'backdrop' : urlPoster ? 'poster' : 'backdrop')

  const hasBoth = Boolean(urlPoster && urlBackdrop)
  const currentUrl = effectiveMedia === 'poster' ? urlPoster : urlBackdrop
  const currentAlt =
    effectiveMedia === 'poster'
      ? `Pôster expandido de ${titulo}`
      : `Backdrop expandido de ${titulo}`

  const handleToggle = React.useCallback(() => {
    if (!hasBoth) return
    setSelectedMedia((prev) => {
      const current = prev ?? effectiveMedia
      return current === 'poster' ? 'backdrop' : 'poster'
    })
  }, [hasBoth, effectiveMedia])

  React.useEffect(() => {
    if (!open || !hasBoth) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        handleToggle()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, hasBoth, handleToggle])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl sm:max-w-5xl">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle>
              <span className="flex items-center gap-2">
                <span>{titulo}</span>
                <span className="hidden text-sm font-normal text-muted-foreground sm:inline">
                  • Galeria de Artes
                </span>
              </span>
            </DialogTitle>
            {hasBoth && (
              <span className="text-xs text-muted-foreground">
                {effectiveMedia === 'poster' ? '1 de 2' : '2 de 2'}
              </span>
            )}
          </div>
          <DialogDescription className="sr-only">
            Galeria de pôster e imagem de fundo em alta resolução de {titulo}
          </DialogDescription>
        </DialogHeader>

        {/* Viewport cinema com proporção estável e fundo ambient blur espelhado */}
        <div className="relative flex h-[58vh] w-full items-center justify-center overflow-hidden rounded-xl bg-black/85 select-none sm:h-[65vh]">
          {/* Efeito espelhado desfocado de preenchimento lateral suave */}
          {currentUrl && (
            <img
              src={currentUrl}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full scale-125 object-cover opacity-35 blur-2xl filter"
            />
          )}

          {/* Imagem nítida em alta fidelidade centralizada */}
          {currentUrl ? (
            <img
              src={currentUrl}
              alt={currentAlt}
              className="relative z-10 max-h-full max-w-full rounded-md object-contain shadow-2xl transition-all duration-300"
            />
          ) : (
            <div className="relative z-10 text-sm text-muted-foreground">
              Imagem não disponível
            </div>
          )}

          {/* Botões de navegação lateral rápida */}
          {hasBoth && (
            <>
              <div className="absolute top-1/2 left-3 z-20 -translate-y-1/2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleToggle}
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="size-5" />
                </Button>
              </div>
              <div className="absolute top-1/2 right-3 z-20 -translate-y-1/2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleToggle}
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Faixa de miniaturas inferiores com indicador ativo */}
        {hasBoth && (
          <div className="flex items-center justify-center gap-3 pt-1">
            {urlPoster && (
              <Button
                type="button"
                variant={effectiveMedia === 'poster' ? 'media-thumb-active' : 'media-thumb'}
                onClick={() => setSelectedMedia('poster')}
                aria-label="Ver pôster"
                aria-pressed={effectiveMedia === 'poster'}
              >
                <span className="flex items-center gap-2">
                  <img
                    src={urlPoster}
                    alt=""
                    aria-hidden="true"
                    className="h-10 w-7 rounded-xs object-cover"
                  />
                  <span className="text-xs font-medium">Pôster (2:3)</span>
                </span>
              </Button>
            )}

            {urlBackdrop && (
              <Button
                type="button"
                variant={effectiveMedia === 'backdrop' ? 'media-thumb-active' : 'media-thumb'}
                onClick={() => setSelectedMedia('backdrop')}
                aria-label="Ver backdrop"
                aria-pressed={effectiveMedia === 'backdrop'}
              >
                <span className="flex items-center gap-2">
                  <img
                    src={urlBackdrop}
                    alt=""
                    aria-hidden="true"
                    className="h-10 w-16 rounded-xs object-cover"
                  />
                  <span className="text-xs font-medium">Backdrop (16:9)</span>
                </span>
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
