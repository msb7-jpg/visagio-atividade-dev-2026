import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import {
  SearchVisibilityProvider,
  useSearchVisibility
} from '../useSearchVisibility'

const TestConsumer = () => {
  const { isHeroSearchVisible, setIsHeroSearchVisible } = useSearchVisibility()
  return (
    <div>
      <span data-testid="status">{isHeroSearchVisible ? 'visible' : 'hidden'}</span>
      <Button type="button" onClick={() => setIsHeroSearchVisible(true)}>
        Show
      </Button>
      <Button type="button" onClick={() => setIsHeroSearchVisible(false)}>
        Hide
      </Button>
    </div>
  )
}

describe('SearchVisibilityContext', () => {
  it('gerencia o estado de visibilidade da barra de busca do Hero corretamente', () => {
    render(
      <SearchVisibilityProvider>
        <TestConsumer />
      </SearchVisibilityProvider>
    )

    expect(screen.getByTestId('status').textContent).toBe('hidden')

    fireEvent.click(screen.getByText('Show'))
    expect(screen.getByTestId('status').textContent).toBe('visible')

    fireEvent.click(screen.getByText('Hide'))
    expect(screen.getByTestId('status').textContent).toBe('hidden')
  })
})
