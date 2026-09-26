import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { CatalogControlBar } from '@/features/catalog/components/CatalogControlBar'
import type { GenreItem } from '@/features/catalog/api/catalogApi'

describe('CatalogControlBar', () => {
  afterEach(() => {
    cleanup()
  })

  const mockGenres: GenreItem[] = [
    { sk_genre_id: 'g-1', nome_genero: 'Ação' },
    { sk_genre_id: 'g-2', nome_genero: 'Drama' }
  ]

  it('renderiza Selects de gênero, ordenação e contagem de itens', () => {
    const handleSelectGenre = vi.fn()
    const handleSelectSortBy = vi.fn()
    const handleChangeViewMode = vi.fn()

    render(
      <CatalogControlBar
        genres={mockGenres}
        selectedGenre=""
        onSelectGenre={handleSelectGenre}
        sortBy="popularidade"
        onSelectSortBy={handleSelectSortBy}
        viewMode="grid"
        onChangeViewMode={handleChangeViewMode}
        totalCount={150}
      />
    )

    expect(screen.getByText(/150/)).toBeDefined()
    expect(screen.getByLabelText('Filtrar por gênero')).toBeDefined()
    expect(screen.getByLabelText('Ordenar catálogo')).toBeDefined()
  })

  it('permite alternar entre os modos Grid e List', () => {
    const handleSelectGenre = vi.fn()
    const handleSelectSortBy = vi.fn()
    const handleChangeViewMode = vi.fn()

    render(
      <CatalogControlBar
        genres={mockGenres}
        selectedGenre=""
        onSelectGenre={handleSelectGenre}
        sortBy="popularidade"
        onSelectSortBy={handleSelectSortBy}
        viewMode="grid"
        onChangeViewMode={handleChangeViewMode}
        totalCount={150}
      />
    )

    const listBtn = screen.getByLabelText('Exibição em Lista')
    fireEvent.click(listBtn)
    expect(handleChangeViewMode).toHaveBeenCalledWith('list')
  })

  it('renderiza Select de anos quando availableYears é fornecido', () => {
    const handleSelectYear = vi.fn()

    render(
      <CatalogControlBar
        genres={mockGenres}
        selectedGenre=""
        onSelectGenre={vi.fn()}
        availableYears={[2024, 2023, 1999]}
        selectedYear={2024}
        onSelectYear={handleSelectYear}
        sortBy="popularidade"
        sortOrder="desc"
        onSelectSortBy={vi.fn()}
        viewMode="grid"
        onChangeViewMode={vi.fn()}
        totalCount={85}
      />
    )

    expect(screen.getByLabelText('Filtrar por ano')).toBeDefined()
  })
})
