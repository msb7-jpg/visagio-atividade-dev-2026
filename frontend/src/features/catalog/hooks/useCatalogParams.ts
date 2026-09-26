import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

export type SortByOption =
  | 'popularidade'
  | 'nota_media_usuarios'
  | 'receita_usd'
  | 'ano_lancamento'
  | 'titulo'

export type ViewModeOption = 'grid' | 'list'

export type SortOrderOption = 'asc' | 'desc'

export function useCatalogParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = useMemo(() => {
    const p = parseInt(searchParams.get('page') || '1', 10)
    return isNaN(p) || p < 1 ? 1 : p
  }, [searchParams])

  const q = useMemo(() => searchParams.get('q') || '', [searchParams])
  const genre = useMemo(() => searchParams.get('genre') || '', [searchParams])
  const year = useMemo(() => {
    const y = parseInt(searchParams.get('year') || '', 10)
    return isNaN(y) ? undefined : y
  }, [searchParams])
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

  const sortOrder = useMemo<SortOrderOption>(() => {
    const o = searchParams.get('order')
    if (o === 'asc' || o === 'desc') {
      return o
    }
    // Padrão: título alfabético é asc, métricas numéricas são desc
    return sortBy === 'titulo' ? 'asc' : 'desc'
  }, [searchParams, sortBy])

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
        const currentQ = prev.get('q') || ''
        const trimmed = newQ.trim()
        if (currentQ === trimmed) {
          return prev
        }
        const next = new URLSearchParams(prev)
        if (!trimmed) {
          next.delete('q')
        } else {
          next.set('q', trimmed)
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
        const currentGenre = prev.get('genre') || ''
        const targetGenre = newGenre === currentGenre ? '' : newGenre
        if (currentGenre === targetGenre) {
          return prev
        }
        const next = new URLSearchParams(prev)
        if (!targetGenre) {
          next.delete('genre')
        } else {
          next.set('genre', targetGenre)
        }
        next.delete('page') // Reseta para a página 1 ao filtrar
        return next
      })
    },
    [setSearchParams]
  )

  const setYear = useCallback(
    (newYear: number | undefined) => {
      setSearchParams((prev) => {
        const currentYearStr = prev.get('year') || ''
        const targetYearStr = newYear ? String(newYear) : ''
        if (currentYearStr === targetYearStr) {
          return prev
        }
        const next = new URLSearchParams(prev)
        if (!targetYearStr) {
          next.delete('year')
        } else {
          next.set('year', targetYearStr)
        }
        next.delete('page') // Reseta para a página 1 ao filtrar por ano
        return next
      })
    },
    [setSearchParams]
  )

  const setSortBy = useCallback(
    (newSort: SortByOption) => {
      setSearchParams((prev) => {
        const currentSort = prev.get('sort') || 'popularidade'
        if (currentSort === newSort) {
          return prev
        }
        const next = new URLSearchParams(prev)
        if (newSort === 'popularidade') {
          next.delete('sort')
        } else {
          next.set('sort', newSort)
        }
        next.delete('order')
        next.delete('page')
        return next
      })
    },
    [setSearchParams]
  )

  const toggleSort = useCallback(
    (targetSort: SortByOption) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        const currentSort = (prev.get('sort') as SortByOption) || 'popularidade'
        const currentOrder =
          (prev.get('order') as SortOrderOption) ||
          (currentSort === 'titulo' ? 'asc' : 'desc')

        if (currentSort === targetSort) {
          // Inverte direção se já estiver selecionado
          const nextOrder: SortOrderOption = currentOrder === 'asc' ? 'desc' : 'asc'
          const defaultOrderForSort = targetSort === 'titulo' ? 'asc' : 'desc'
          if (nextOrder === defaultOrderForSort) {
            next.delete('order')
          } else {
            next.set('order', nextOrder)
          }
        } else {
          // Seleciona novo critério com sua direção padrão
          if (targetSort === 'popularidade') {
            next.delete('sort')
          } else {
            next.set('sort', targetSort)
          }
          next.delete('order')
        }

        next.delete('page')
        return next
      })
    },
    [setSearchParams]
  )

  const setSortOrder = useCallback(
    (newOrder: SortOrderOption) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        const currentSort = (prev.get('sort') as SortByOption) || 'popularidade'
        const defaultOrder = currentSort === 'titulo' ? 'asc' : 'desc'
        if (newOrder === defaultOrder) {
          next.delete('order')
        } else {
          next.set('order', newOrder)
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
        const currentView = prev.get('view') === 'list' ? 'list' : 'grid'
        if (currentView === mode) {
          return prev
        }
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
    year,
    sortBy,
    sortOrder,
    viewMode,
    setPage,
    setQ,
    setGenre,
    setYear,
    setSortBy,
    setSortOrder,
    toggleSort,
    setViewMode
  }
}
