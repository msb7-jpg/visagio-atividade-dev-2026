import { describe, it, expect } from 'vitest'
import { calculatePageNumbers } from '../pagination-helper'

describe('calculatePageNumbers', () => {
  it('retorna lista vazia para 1 página ou menos', () => {
    expect(calculatePageNumbers(1, 1)).toEqual([])
    expect(calculatePageNumbers(1, 0)).toEqual([])
  })

  it('retorna todas as páginas quando total é pequeno', () => {
    expect(calculatePageNumbers(1, 4)).toEqual([1, 2, 3, 4])
    expect(calculatePageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5])
    expect(calculatePageNumbers(2, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('insere elipses e mantém blocos estáveis quando há muitas páginas', () => {
    // Bloco 1-5 (página 1 a 5)
    expect(calculatePageNumbers(1, 10)).toEqual([1, 2, 3, 4, 5, '...', 10])
    expect(calculatePageNumbers(3, 10)).toEqual([1, 2, 3, 4, 5, '...', 10])
    expect(calculatePageNumbers(5, 10)).toEqual([1, 2, 3, 4, 5, '...', 10])

    // Bloco 6-10 (página 6 a 10)
    expect(calculatePageNumbers(6, 10)).toEqual([1, '...', 6, 7, 8, 9, 10])
    expect(calculatePageNumbers(8, 10)).toEqual([1, '...', 6, 7, 8, 9, 10])
    expect(calculatePageNumbers(10, 10)).toEqual([1, '...', 6, 7, 8, 9, 10])

    // Bloco intermediário com páginas altas (ex: 3981-3985 em 4000 páginas)
    expect(calculatePageNumbers(3984, 4000)).toEqual([1, '...', 3981, 3982, 3983, 3984, 3985, '...', 4000])
  })
})
