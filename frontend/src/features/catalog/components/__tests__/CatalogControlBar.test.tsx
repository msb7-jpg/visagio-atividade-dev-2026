import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CatalogControlBar } from '@/features/catalog/components/CatalogControlBar'
import type { GenreItem } from '@/features/catalog/api/catalogApi'

describe('CatalogControlBar', () => {
  const mockGenres: GenreItem[] = [
    { sk_genre_id: 'g-1', nome_genero: 'Ação' },
    { sk_genre_id: 'g-2', nome_genero: 'Drama' }
  ]

  it('renderiza gêneros e permite alternar seleção', () => {
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

    expect(screen.getByText('Todos os Gêneros')).toBeDefined()
    expect(screen.getByText('Ação')).toBeDefined()
    expect(screen.getByText('Drama')).toBeDefined()

    const acaoBtn = screen.getByText('Ação')
    fireEvent.click(acaoBtn)
    expect(handleSelectGenre).toHaveBeenCalledWith('Ação')
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

  it('permite clicar em opções de ordenação e acionar alternância de ordenação', () => {
    const handleSelectGenre = vi.fn()
    const handleSelectSortBy = vi.fn()
    const handleToggleSort = vi.fn()
    const handleChangeViewMode = vi.fn()

    render(
      <CatalogControlBar
        genres={mockGenres}
        selectedGenre=""
        onSelectGenre={handleSelectGenre}
        sortBy="popularidade"
        sortOrder="desc"
        onSelectSortBy={handleSelectSortBy}
        onToggleSort={handleToggleSort}
        viewMode="grid"
        onChangeViewMode={handleChangeViewMode}
        totalCount={150}
      />
    )

    const avaliacoesBtn = screen.getByText('Avaliações')
    fireEvent.click(avaliacoesBtn)
    expect(handleToggleSort).toHaveBeenCalledWith('nota_media_usuarios')

    const popularidadeBtn = screen.getByText('Popularidade')
    fireEvent.click(popularidadeBtn)
    expect(handleToggleSort).toHaveBeenCalledWith('popularidade')
  })
})
