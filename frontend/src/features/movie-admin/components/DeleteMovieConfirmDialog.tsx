import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { AlertTriangle, Loader2 } from 'lucide-react'
import * as React from 'react'

interface DeleteMovieConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movieTitle: string
  onConfirmDelete: () => void
  isDeleting?: boolean
}

export const DeleteMovieConfirmDialog: React.FC<DeleteMovieConfirmDialogProps> = ({
  open,
  onOpenChange,
  movieTitle,
  onConfirmDelete,
  isDeleting = false
}) => {
  const [typedTitle, setTypedTitle] = React.useState('')

  const isTitleConfirmed = typedTitle.trim().toLowerCase() === movieTitle.trim().toLowerCase()

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTypedTitle('')
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" />
          </div>
          <DialogTitle>
            Excluir Filme do Catálogo?
          </DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir permanentemente o filme{' '}
            <strong className="text-foreground">"{movieTitle}"</strong>? Esta ação é
            irreversível e removerá todas as resenhas, pontes de elenco e métricas
            associadas no banco de dados.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 flex flex-col gap-2">
          <label
            htmlFor="confirm-movie-title"
            className="text-xs text-muted-foreground"
          >
            Para confirmar, digite exatamente <strong className="text-foreground">"{movieTitle}"</strong> no campo abaixo:
          </label>
          <Input
            id="confirm-movie-title"
            value={typedTitle}
            onChange={(e) => setTypedTitle(e.target.value)}
            placeholder={`Digite "${movieTitle}"`}
            variant="glass"
            disabled={isDeleting}
            autoComplete="off"
          />
        </div>

        <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirmDelete}
            disabled={!isTitleConfirmed || isDeleting}
          >
            <span className="flex items-center gap-2">
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Excluindo...</span>
                </>
              ) : (
                <span>Excluir Definitivamente</span>
              )}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
