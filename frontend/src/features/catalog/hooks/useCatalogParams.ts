import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

export type SortByOption =
  | 'popularidade'
  | 'nota_media_usuarios'
  | 'receita_usd'
  | 'ano_lancamento'
  | 'titulo'

export type ViewModeOption = 'grid' | 'list'

export function useCatalogParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = useMemo(() => {
    const p = parseInt(searchParams.get('page') || '1', 10)
    return isNaN(p) || p < 1 ? 1 : p
  }, [searchParams])

  const q = useMemo(() => searchParams.get('q') || '', [searchParams])
  const genre = useMemo(() => searchParams.get('genre') || '', [searchParams])
  const sortBy = useMemo<SortByOption>(() => {
    const s = searchParams.get('sort') as SortByOption
    const allowed: SortByOption[] = [
      'popularidade',
      'nota_media_usuarios',
      'receita_usd',
      'ano_lancamento',
      'titulo'
    ]
    return allowed.includes(s) ? s : 'popularidade'
  }, [searchParams])

  const viewMode = useMemo<ViewModeOption>(() => {
    const v = searchParams.get('view')
    return v === 'list' ? 'list' : 'grid'
  }, [searchParams])

  const setPage = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (newPage <= 1) {
          next.delete('page')
        } else {
          next.set('page', newPage.toString())
        }
        return next
      })
    },
    [setSearchParams]
  )

  const setQ = useCallback(
    (newQ: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (!newQ.trim()) {
          next.delete('q')
        } else {
          next.set('q', newQ.trim())
        }
        next.delete('page') // Reseta para a página 1 ao buscar
        return next
      })
    },
    [setSearchParams]
  )

  const setGenre = useCallback(
    (newGenre: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (!newGenre || newGenre === prev.get('genre')) {
          next.delete('genre')
        } else {
          next.set('genre', newGenre)
        }
        next.delete('page') // Reseta para a página 1 ao filtrar
        return next
      })
    },
    [setSearchParams]
  )

  const setSortBy = useCallback(
    (newSort: SortByOption) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (newSort === 'popularidade') {
          next.delete('sort')
        } else {
          next.set('sort', newSort)
        }
        next.delete('page')
        return next
      })
    },
    [setSearchParams]
  )

  const setViewMode = useCallback(
    (mode: ViewModeOption) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (mode === 'grid') {
          next.delete('view')
        } else {
          next.set('view', mode)
        }
        return next
      })
    },
    [setSearchParams]
  )

  return {
    page,
    q,
    genre,
    sortBy,
    viewMode,
    setPage,
    setQ,
    setGenre,
    setSortBy,
    setViewMode
  }
}
