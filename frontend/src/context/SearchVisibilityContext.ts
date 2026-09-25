import { createContext } from 'react'

export interface SearchVisibilityContextValue {
  isHeroSearchVisible: boolean
  setIsHeroSearchVisible: (visible: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  isFetching: boolean
  setIsFetching: (isFetching: boolean) => void
  onClearSearch?: () => void
  setOnClearSearch: (cb: (() => void) | undefined) => void
  onSearchChange?: (query: string) => void
  setOnSearchChange: (cb: ((query: string) => void) | undefined) => void
}

export const SearchVisibilityContext = createContext<SearchVisibilityContextValue | undefined>(undefined)
