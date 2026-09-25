import { use } from 'react'
import {
  SearchVisibilityContext,
  type SearchVisibilityContextValue
} from './SearchVisibilityContext'

export function useSearchVisibility(): SearchVisibilityContextValue {
  const context = use(SearchVisibilityContext)
  if (!context) {
    throw new Error(
      'useSearchVisibility deve ser utilizado dentro de um <SearchVisibilityProvider>'
    )
  }
  return context
}

export { SearchVisibilityProvider } from './SearchVisibilityProvider'
