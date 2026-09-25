import { describe, it, expect } from 'vitest'
import { shouldShowStatus } from '../list-status-helper'

describe('shouldShowStatus', () => {
  it('retorna true quando há erro', () => {
    expect(shouldShowStatus(false, true, 10)).toBe(true)
  })

  it('retorna true quando está carregando sem filmes', () => {
    expect(shouldShowStatus(true, false, 0)).toBe(true)
  })

  it('retorna true quando não há filmes', () => {
    expect(shouldShowStatus(false, false, 0)).toBe(true)
  })

  it('retorna false quando há filmes e não há erro', () => {
    expect(shouldShowStatus(false, false, 5)).toBe(false)
  })
})
