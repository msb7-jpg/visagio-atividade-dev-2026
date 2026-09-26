import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { FileX2 } from 'lucide-react'
import * as React from 'react'

interface DiscardDraftConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDiscard: () => void
}

export const DiscardDraftConfirmDialog: React.FC<DiscardDraftConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirmDiscard
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/15 text-destructive">
              <FileX2 className="size-5" />
            </div>
            <div>
              <DialogTitle>Descartar Rascunho?</DialogTitle>
              <span className="text-xs text-muted-foreground">
                Alterações não salvas serão perdidas
              </span>
            </div>
          </div>
          <DialogDescription>
            Você possui dados preenchidos salvos automaticamente neste rascunho. Deseja realmente
            descartá-lo e voltar, ou prefere continuar editando a obra?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Continuar Editando
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirmDiscard()
              onOpenChange(false)
            }}
          >
            <span>Descartar Rascunho</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
