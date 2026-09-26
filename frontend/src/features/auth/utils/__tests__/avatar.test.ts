import { describe, it, expect } from 'vitest'
import { getInitials } from '@/features/auth/utils/avatar'

describe('getInitials', () => {
  it('retorna "U" se o nome for nulo, indefinido ou vazio', () => {
    expect(getInitials(null)).toBe('U')
    expect(getInitials(undefined)).toBe('U')
    expect(getInitials('')).toBe('U')
    expect(getInitials('   ')).toBe('U')
  })

  it('retorna a inicial única se houver apenas um nome', () => {
    expect(getInitials('Miguel')).toBe('M')
    expect(getInitials('admin')).toBe('A')
  })

  it('retorna a primeira inicial e a última quando houver múltiplos nomes', () => {
    expect(getInitials('Miguel Batista')).toBe('MB')
    expect(getInitials('Miguel Silva Batista')).toBe('MB')
    expect(getInitials('João Carlos de Oliveira')).toBe('JO')
    expect(getInitials('  Ana   Maria   ')).toBe('AM')
  })
})
