import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'

interface MovieDetailsErrorStateProps {
  errorMessage?: string
  onGoHome: () => void
}

export function MovieDetailsErrorState({ errorMessage, onGoHome }: MovieDetailsErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <EmptyState
        title="Filme não encontrado"
        description={
          errorMessage ||
          'Não foi possível localizar os detalhes deste título no catálogo do RocketFilms.'
        }
      />
      <Button onClick={onGoHome} variant="outline" className="mt-4">
        Voltar ao Catálogo de Filmes
      </Button>
    </div>
  )
}
