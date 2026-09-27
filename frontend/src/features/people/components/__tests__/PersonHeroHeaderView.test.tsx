import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PersonHeroHeaderView } from '../PersonHeroHeaderView'
import type { PersonDetail } from '@/features/people/types/people.types'

const mockPerson: PersonDetail = {
  sk_person_id: 'person-test-1',
  nome_pessoa: 'Denis Villeneuve',
  tipo_pessoa: 'Diretor',
  total_filmes: 10,
  nota_media_filmes: 8.4,
  primeiro_ano: 2010,
  ultimo_ano: 2024,
  papeis: ['Diretor', 'Roteirista']
}

describe('PersonHeroHeaderView', () => {
  it('renderiza nome da pessoa, papéis e contagem de filmes', () => {
    render(
      <PersonHeroHeaderView
        person={mockPerson}
        watchedCount={3}
        totalInCatalog={10}
        isAuthenticated={false}
      />
    )

    expect(screen.getByText('Denis Villeneuve')).toBeInTheDocument()
    expect(screen.getByText('Diretor')).toBeInTheDocument()
    expect(screen.getByText('Roteirista')).toBeInTheDocument()
    expect(screen.getByText('(2010 – 2024)')).toBeInTheDocument()
    expect(screen.getByText('8.4')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('Filmografia completa catalogada')).toBeInTheDocument()
  })

  it('exibe indicador de progresso cineclubista para usuário autenticado', () => {
    render(
      <PersonHeroHeaderView
        person={mockPerson}
        watchedCount={5}
        totalInCatalog={10}
        isAuthenticated={true}
      />
    )

    const progressBadge = screen.getByTestId('person-watched-progress')
    expect(progressBadge).toBeInTheDocument()
    expect(progressBadge).toHaveTextContent('Você assistiu 5 de 10 / 50%')
  })
})
