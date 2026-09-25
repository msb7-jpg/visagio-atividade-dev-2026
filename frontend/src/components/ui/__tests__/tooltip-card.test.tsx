import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tooltip } from '../tooltip-card'

describe('Tooltip component', () => {
  it('renderiza o trigger e abre ao passar o mouse calculando posição', () => {
    render(
      <Tooltip content={<span>Informações adicionais do card</span>}>
        <span>Passe o mouse aqui</span>
      </Tooltip>
    )

    const trigger = screen.getByText('Passe o mouse aqui')
    expect(trigger).toBeDefined()

    // Simula eventos de mouse
    fireEvent.mouseEnter(trigger)
    fireEvent.mouseMove(trigger, { clientX: 100, clientY: 150 })

    expect(screen.getByText('Informações adicionais do card')).toBeDefined()

    fireEvent.mouseLeave(trigger)
  })
})
