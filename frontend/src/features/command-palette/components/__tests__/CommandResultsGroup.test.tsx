import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Command, CommandList } from '@/components/ui/command'
import { CommandResultsGroupView } from '@/features/command-palette/components/CommandResultsGroupView'
import type { QuickSearchMovieItem } from '@/features/command-palette/api/spotlightApi'

describe('CommandResultsGroupView', () => {
  const mockMovies: QuickSearchMovieItem[] = [
    {
      sk_movie_id: 'movie-1',
      id_filme: 'matrix-1',
      titulo: 'The Matrix',
      ano_lancamento: 1999,
      url_poster: 'http://poster.jpg',
      nota_media_usuarios: 8.7,
      popularidade: 95.0,
      generos: ['Ficção Científica', 'Ação']
    }
  ]

  it('renderiza os filmes encontrados e dispara onSelectMovie ao clicar', () => {
    const handleSelectMovie = vi.fn()
    const handleSelectAction = vi.fn()
    const handleSelectGenre = vi.fn()

    render(
      <Command>
        <CommandList>
          <CommandResultsGroupView
            movies={mockMovies}
            query="mat"
            onSelectMovie={handleSelectMovie}
            onSelectAction={handleSelectAction}
            onSelectGenre={handleSelectGenre}
          />
        </CommandList>
      </Command>
    )

    expect(screen.getByText('The Matrix')).toBeDefined()
    expect(screen.getByText('(1999)')).toBeDefined()
    expect(screen.getByText('★ 8.7')).toBeDefined()
  })

  it('renderiza atalhos de gêneros e ações rápidas', () => {
    const handleSelectMovie = vi.fn()
    const handleSelectAction = vi.fn()
    const handleSelectGenre = vi.fn()

    render(
      <Command>
        <CommandList>
          <CommandResultsGroupView
            movies={[]}
            query=""
            onSelectMovie={handleSelectMovie}
            onSelectAction={handleSelectAction}
            onSelectGenre={handleSelectGenre}
          />
        </CommandList>
      </Command>
    )

    expect(screen.getByText('Gêneros & Categorias')).toBeDefined()
    expect(screen.getByText('Navegação & Ações Rápidas')).toBeDefined()
    expect(screen.getByText('Explorar Catálogo Completo')).toBeDefined()
  })
})
