import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

    render(
      <Command>
        <CommandList>
          <CommandResultsGroupView
            movies={mockMovies}
            query="mat"
            onSelectMovie={handleSelectMovie}
            onSelectAction={handleSelectAction}
          />
        </CommandList>
      </Command>
    )

    expect(screen.getByText('The Matrix')).toBeDefined()
    expect(screen.getByText('(1999)')).toBeDefined()
    expect(screen.getByText('★ 8.7')).toBeDefined()
  })

  it('renderiza atalhos de navegação e ações rápidas', () => {
    const handleSelectAction = vi.fn()

    render(
      <Command>
        <CommandList>
          <CommandResultsGroupView
            movies={[]}
            query=""
            onSelectMovie={vi.fn()}
            onSelectAction={handleSelectAction}
          />
        </CommandList>
      </Command>
    )

    expect(screen.getByText('Navegação & Ações Rápidas')).toBeDefined()
    expect(screen.getByText('Explorar Catálogo Completo')).toBeDefined()

    fireEvent.click(screen.getByText('Explorar Catálogo Completo'))
    expect(handleSelectAction).toHaveBeenCalledWith('/')
  })

  it('renderiza Sair quando isAuthenticated for true e dispara logout ao clicar', () => {
    const handleSelectAction = vi.fn()

    render(
      <Command>
        <CommandList>
          <CommandResultsGroupView
            movies={[]}
            query=""
            onSelectMovie={vi.fn()}
            onSelectAction={handleSelectAction}
            isAuthenticated={true}
          />
        </CommandList>
      </Command>
    )

    expect(screen.getByText('Sair')).toBeDefined()
    fireEvent.click(screen.getByText('Sair'))
    expect(handleSelectAction).toHaveBeenCalledWith('logout')
  })

  it('renderiza atalhos para Minha Biblioteca quando autenticado e dispara rota com tab', () => {
    const handleSelectAction = vi.fn()

    render(
      <Command>
        <CommandList>
          <CommandResultsGroupView
            movies={[]}
            query=""
            onSelectMovie={vi.fn()}
            onSelectAction={handleSelectAction}
            isAuthenticated={true}
          />
        </CommandList>
      </Command>
    )

    expect(screen.getByText('Minha Biblioteca: Favoritos')).toBeDefined()
    expect(screen.getByText('Minha Biblioteca: Watchlist')).toBeDefined()

    fireEvent.click(screen.getByText('Minha Biblioteca: Favoritos'))
    expect(handleSelectAction).toHaveBeenCalledWith('/minha-lista?tab=favorites')

    fireEvent.click(screen.getByText('Minha Biblioteca: Watchlist'))
    expect(handleSelectAction).toHaveBeenCalledWith('/minha-lista?tab=watchlist')
  })

  it('renderiza pessoas encontradas e dispara onSelectPerson ao clicar', () => {
    const handleSelectPerson = vi.fn()

    render(
      <Command>
        <CommandList>
          <CommandResultsGroupView
            movies={[]}
            people={[
              {
                sk_person_id: 'person-nolan',
                nome_pessoa: 'Christopher Nolan',
                tipo_pessoa: 'Diretor',
                total_filmes: 12
              }
            ]}
            query="nolan"
            onSelectMovie={vi.fn()}
            onSelectPerson={handleSelectPerson}
            onSelectAction={vi.fn()}
          />
        </CommandList>
      </Command>
    )

    expect(screen.getByText('Pessoas Encontradas')).toBeDefined()
    expect(screen.getByText('Christopher Nolan')).toBeDefined()
    expect(screen.getByText('Diretor')).toBeDefined()
    expect(screen.getByText('12 obras no catálogo')).toBeDefined()

    fireEvent.click(screen.getByText('Christopher Nolan'))
    expect(handleSelectPerson).toHaveBeenCalledWith({
      sk_person_id: 'person-nolan',
      nome_pessoa: 'Christopher Nolan',
      tipo_pessoa: 'Diretor',
      total_filmes: 12
    })
  })

  it('renderiza múltiplos papéis unificados como badges individuais', () => {
    render(
      <Command>
        <CommandList>
          <CommandResultsGroupView
            movies={[]}
            people={[
              {
                sk_person_id: 'person-tarantino',
                nome_pessoa: 'Quentin Tarantino',
                tipo_pessoa: 'Diretor, Roteirista',
                total_filmes: 9,
                papeis: ['Diretor', 'Roteirista']
              }
            ]}
            query="tarantino"
            onSelectMovie={vi.fn()}
            onSelectPerson={vi.fn()}
            onSelectAction={vi.fn()}
          />
        </CommandList>
      </Command>
    )

    expect(screen.getByText('Quentin Tarantino')).toBeDefined()
    expect(screen.getByText('Diretor')).toBeDefined()
    expect(screen.getByText('Roteirista')).toBeDefined()
  })
})
