interface MovieBackdropHeroViewProps {
  urlBackdrop: string | null | undefined
  titulo: string
}

export function MovieBackdropHeroView({ urlBackdrop, titulo }: MovieBackdropHeroViewProps) {
  if (!urlBackdrop) {
    return (
      <div
        data-testid="backdrop-fallback"
        className="relative h-64 w-full overflow-hidden bg-linear-to-b from-primary/10 via-background/40 to-background sm:h-80 md:h-96"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      </div>
    )
  }

  return (
    <div
      data-testid="backdrop-container"
      className="relative h-64 w-full overflow-hidden sm:h-80 md:h-96"
    >
      <img
        src={urlBackdrop}
        alt={`Backdrop de ${titulo}`}
        className="h-full w-full scale-105 object-cover object-top opacity-40 blur-xs filter"
      />
      {/* Máscara de gradiente fade-to-black na base conectando fluidamente ao conteúdo */}
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-background/90 via-transparent to-background/90" />
    </div>
  )
}
