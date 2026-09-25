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
  })

  it('insere elipses corretamente quando há muitas páginas', () => {
    expect(calculatePageNumbers(1, 10)).toEqual([1, 2, 3, '...', 10])
    expect(calculatePageNumbers(5, 10)).toEqual([1, '...', 3, 4, 5, 6, 7, '...', 10])
    expect(calculatePageNumbers(10, 10)).toEqual([1, '...', 8, 9, 10])
  })
})
