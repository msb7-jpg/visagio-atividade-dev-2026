import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import * as React from 'react'

interface ValidatedImageUrlInputProps {
  id?: string
  name?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  error?: string
}

type ValidationStatus = 'idle' | 'loading' | 'valid' | 'invalid'

export const ValidatedImageUrlInput: React.FC<ValidatedImageUrlInputProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  error
}) => {
  const [resolvedUrl, setResolvedUrl] = React.useState<{ url: string; success: boolean } | null>(null)
  const trimmedUrl = value?.trim() || ''

  const MAX_URL_LENGTH = 2048

  const isValidHttpFormat = Boolean(
    trimmedUrl &&
      trimmedUrl.length <= MAX_URL_LENGTH &&
      (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://'))
  )

  React.useEffect(() => {
    if (!isValidHttpFormat) {
      return
    }

    let isCurrent = true
    const img = new Image()

    img.onload = () => {
      if (isCurrent) {
        setResolvedUrl({ url: trimmedUrl, success: true })
      }
    }
    img.onerror = () => {
      if (isCurrent) {
        setResolvedUrl({ url: trimmedUrl, success: false })
      }
    }
    img.src = trimmedUrl

    return () => {
      isCurrent = false
      img.onload = null
      img.onerror = null
    }
  }, [trimmedUrl, isValidHttpFormat])

  const status: ValidationStatus = !trimmedUrl
    ? 'idle'
    : !isValidHttpFormat
      ? 'invalid'
      : resolvedUrl?.url === trimmedUrl
        ? resolvedUrl.success
          ? 'valid'
          : 'invalid'
        : 'loading'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative flex items-center">
        <Input
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          variant="glass"
          size="action"
          disabled={disabled}
          aria-invalid={Boolean(error || status === 'invalid')}
          autoComplete="off"
        />

        {/* Indicador de status no canto direito */}
        <div className="pointer-events-none absolute right-3 flex items-center">
          {status === 'loading' && (
            <Loader2 className="size-4 animate-spin text-primary" data-testid="image-loading-indicator" />
          )}
          {status === 'valid' && (
            <CheckCircle2 className="size-4 text-profit" data-testid="image-valid-indicator" />
          )}
          {status === 'invalid' && trimmedUrl.length > 0 && (
            <AlertCircle className="size-4 text-destructive" data-testid="image-invalid-indicator" />
          )}
        </div>
      </div>

      {/* Mensagens de feedback */}
      {error && <span className="text-xs text-destructive">{error}</span>}
      {!error && status === 'valid' && (
        <span className="text-[11px] text-profit">
          ✓ Imagem verificada e acessível
        </span>
      )}
      {!error && status === 'invalid' && trimmedUrl.length > 0 && (
        <span className="text-[11px] text-destructive">
          URL da imagem inacessível ou inválida
        </span>
      )}
    </div>
  )
}
