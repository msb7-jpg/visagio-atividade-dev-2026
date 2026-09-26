interface MovieSynopsisViewProps {
  sinopse: string | null | undefined
}

export function MovieSynopsisView({ sinopse }: MovieSynopsisViewProps) {
  if (!sinopse) return null

  return (
    <div className="max-w-3xl space-y-2 border-t border-white/10 pt-6">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Sinopse
      </h3>
      <p className="text-sm leading-relaxed font-normal text-foreground/85 sm:text-base">
        {sinopse}
      </p>
    </div>
  )
}
