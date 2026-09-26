import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import { useCatalogParams } from '../useCatalogParams'

describe('useCatalogParams', () => {
  it('gerencia parâmetros de busca, gênero, ordenação e visualização', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={['/?page=2&q=Matrix&genre=Action&sort=titulo&view=list']}>
        {children}
      </MemoryRouter>
    )

    const { result } = renderHook(() => useCatalogParams(), { wrapper })

    expect(result.current.page).toBe(2)
    expect(result.current.q).toBe('Matrix')
    expect(result.current.genre).toBe('Action')
    expect(result.current.sortBy).toBe('titulo')
    expect(result.current.viewMode).toBe('list')

    // Altera gênero
    act(() => {
      result.current.setGenre('Drama')
    })
    expect(result.current.genre).toBe('Drama')

    // Alternar mesmo gênero desmarca
    act(() => {
      result.current.setGenre('Drama')
    })
    expect(result.current.genre).toBe('')

    // Altera busca
    act(() => {
      result.current.setQ('Inception')
    })
    expect(result.current.q).toBe('Inception')

    // Altera ordenação
    act(() => {
      result.current.setSortBy('ano_lancamento')
    })
    expect(result.current.sortBy).toBe('ano_lancamento')
    expect(result.current.sortOrder).toBe('desc')

    // Alterna ordenação com toggleSort
    act(() => {
      result.current.toggleSort('ano_lancamento')
    })
    expect(result.current.sortOrder).toBe('asc')

    act(() => {
      result.current.toggleSort('ano_lancamento')
    })
    expect(result.current.sortOrder).toBe('desc')

    // Altera viewMode
    act(() => {
      result.current.setViewMode('grid')
    })
    expect(result.current.viewMode).toBe('grid')

    // Altera página
    act(() => {
      result.current.setPage(3)
    })
    expect(result.current.page).toBe(3)
  })
})
