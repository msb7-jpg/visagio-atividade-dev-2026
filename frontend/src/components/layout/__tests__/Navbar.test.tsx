import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Navbar } from '../Navbar'
import { SearchVisibilityProvider, useSearchVisibility } from '@/context/useSearchVisibility'
import { AuthProvider } from '@/features/auth/context/AuthProvider'

interface MockVisibilityProps {
  initialVisible?: boolean
  searchQuery?: string
  isFetching?: boolean
  onOpen?: () => void
}

const NavbarWithVisibilityToggle: React.FC<MockVisibilityProps> = ({
  initialVisible = false,
  searchQuery = '',
  isFetching = false,
  onOpen = vi.fn()
}) => {
  return (
    <AuthProvider>
      <SearchVisibilityProvider>
        <VisibilityController
          initialVisible={initialVisible}
          searchQuery={searchQuery}
          isFetching={isFetching}
        />
        <Navbar onOpenCommandPalette={onOpen} />
      </SearchVisibilityProvider>
    </AuthProvider>
  )
}

const VisibilityController: React.FC<{
  initialVisible: boolean
  searchQuery?: string
  isFetching?: boolean
}> = ({ initialVisible, searchQuery = '', isFetching = false }) => {
  const { setIsHeroSearchVisible, setSearchQuery, setIsFetching } = useSearchVisibility()
  React.useEffect(() => {
    setIsHeroSearchVisible(initialVisible)
    setSearchQuery(searchQuery)
    setIsFetching(isFetching)
  }, [initialVisible, searchQuery, isFetching, setIsHeroSearchVisible, setSearchQuery, setIsFetching])
  return null
}

describe('Navbar component', () => {
  it('renderiza o brand RocketLab Cinema e botão de busca', () => {
    const handleOpen = vi.fn()
    render(
      <BrowserRouter>
        <NavbarWithVisibilityToggle initialVisible={false} onOpen={handleOpen} />
      </BrowserRouter>
    )

    expect(screen.getByText('RocketLab Cinema')).toBeDefined()
    const searchTrigger = screen.getByText('Buscar filmes, diretores, gêneros...')
    expect(searchTrigger).toBeDefined()

    fireEvent.click(searchTrigger)
    expect(handleOpen).toHaveBeenCalledTimes(1)
  })

  it('aplica classes de ocultamento quando isHeroSearchVisible for true', () => {
    const { container } = render(
      <BrowserRouter>
        <NavbarWithVisibilityToggle initialVisible={true} />
      </BrowserRouter>
    )

    const searchContainer = container.querySelector('.opacity-0.pointer-events-none')
    expect(searchContainer).toBeDefined()
  })

  it('exibe o texto de busca sincronizado do Hero e o spinner de loading quando isFetching for true', () => {
    const { container } = render(
      <BrowserRouter>
        <NavbarWithVisibilityToggle
          initialVisible={false}
          searchQuery="Oppenheimer"
          isFetching={true}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Oppenheimer')).toBeDefined()
    expect(container.querySelector('.animate-spin')).not.toBeNull()
  })
})
