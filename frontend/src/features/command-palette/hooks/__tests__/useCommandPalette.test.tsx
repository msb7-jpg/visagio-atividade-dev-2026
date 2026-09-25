import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import {
  CommandPaletteProvider,
  useCommandPalette
} from '@/features/command-palette/hooks/useCommandPalette'

describe('useCommandPalette & CommandPaletteProvider', () => {
  it('lança erro descritivo ao ser utilizado fora do CommandPaletteProvider', () => {
    expect(() => {
      renderHook(() => useCommandPalette())
    }).toThrow('useCommandPalette deve ser utilizado dentro de um <CommandPaletteProvider>')
  })

  it('compartilha o estado isOpen entre múltiplos componentes dentro do Provider', () => {
    const ComponentA = () => {
      const { isOpen, open } = useCommandPalette()
      return (
        <div>
          <span data-testid="status-a">{isOpen ? 'open' : 'closed'}</span>
          <Button onClick={open}>Open A</Button>
        </div>
      )
    }

    const ComponentB = () => {
      const { isOpen, close, toggle } = useCommandPalette()
      return (
        <div>
          <span data-testid="status-b">{isOpen ? 'open' : 'closed'}</span>
          <Button onClick={close}>Close B</Button>
          <Button onClick={toggle}>Toggle B</Button>
        </div>
      )
    }

    render(
      <CommandPaletteProvider>
        <ComponentA />
        <ComponentB />
      </CommandPaletteProvider>
    )

    // Inicialmente fechado em ambos
    expect(screen.getByTestId('status-a').textContent).toBe('closed')
    expect(screen.getByTestId('status-b').textContent).toBe('closed')

    // Abrir via ComponentA
    fireEvent.click(screen.getByText('Open A'))
    expect(screen.getByTestId('status-a').textContent).toBe('open')
    expect(screen.getByTestId('status-b').textContent).toBe('open')

    // Fechar via ComponentB
    fireEvent.click(screen.getByText('Close B'))
    expect(screen.getByTestId('status-a').textContent).toBe('closed')
    expect(screen.getByTestId('status-b').textContent).toBe('closed')

    // Alternar via ComponentB
    fireEvent.click(screen.getByText('Toggle B'))
    expect(screen.getByTestId('status-a').textContent).toBe('open')
    expect(screen.getByTestId('status-b').textContent).toBe('open')
  })

  it('alterna o estado através do atalho de teclado Cmd+K e Ctrl+K', () => {
    const Consumer = () => {
      const { isOpen } = useCommandPalette()
      return <span data-testid="status">{isOpen ? 'open' : 'closed'}</span>
    }

    render(
      <CommandPaletteProvider>
        <Consumer />
      </CommandPaletteProvider>
    )

    expect(screen.getByTestId('status').textContent).toBe('closed')

    // Pressiona Meta+k (Cmd+K)
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    })
    expect(screen.getByTestId('status').textContent).toBe('open')

    // Pressiona Ctrl+k
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    })
    expect(screen.getByTestId('status').textContent).toBe('closed')
  })
})
