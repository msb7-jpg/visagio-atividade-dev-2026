import React, { useCallback, useMemo, useState } from 'react'
import { SearchVisibilityContext } from './SearchVisibilityContext'

export const SearchVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHeroSearchVisible, setIsHeroSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [clearSearchHandler, setClearSearchHandler] = useState<(() => void) | undefined>(undefined)
  const [searchChangeHandler, setSearchChangeHandler] = useState<((query: string) => void) | undefined>(undefined)

  const setOnClearSearch = useCallback((cb: (() => void) | undefined) => {
    setClearSearchHandler(() => cb)
  }, [])

  const setOnSearchChange = useCallback((cb: ((query: string) => void) | undefined) => {
    setSearchChangeHandler(() => cb)
  }, [])

  const value = useMemo(
    () => ({
      isHeroSearchVisible,
      setIsHeroSearchVisible,
      searchQuery,
      setSearchQuery,
      isFetching,
      setIsFetching,
      onClearSearch: clearSearchHandler,
      setOnClearSearch,
      onSearchChange: searchChangeHandler,
      setOnSearchChange
    }),
    [
      isHeroSearchVisible,
      searchQuery,
      isFetching,
      clearSearchHandler,
      setOnClearSearch,
      searchChangeHandler,
      setOnSearchChange
    ]
  )

  return (
    <SearchVisibilityContext value={value}>
      {children}
    </SearchVisibilityContext>
  )
}
