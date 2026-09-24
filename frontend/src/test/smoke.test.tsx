import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Smoke Test', () => {
  it('renders a button correctly', () => {
    render(<Button>Entrar</Button>)
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })
})
