import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
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
  it('renderiza o brand RocketLab Cinema e o campo de busca', () => {
    render(
      <BrowserRouter>
        <NavbarWithVisibilityToggle initialVisible={false} />
      </BrowserRouter>
    )

    expect(screen.getByText('RocketLab Cinema')).toBeDefined()
    const input = screen.getByPlaceholderText('Buscar filmes, diretores, gêneros...')
    expect(input).toBeDefined()
  })

  it('não ativa a command palette ao clicar no input ou no corpo da barra de busca da navbar', () => {
    const handleOpen = vi.fn()
    render(
      <BrowserRouter>
        <NavbarWithVisibilityToggle initialVisible={false} onOpen={handleOpen} />
      </BrowserRouter>
    )

    const input = screen.getByPlaceholderText('Buscar filmes, diretores, gêneros...')
    const searchBar = screen.getByTestId('navbar-search-bar')

    // Clica no input e no corpo da barra de busca
    fireEvent.click(input)
    fireEvent.click(searchBar)

    // A command palette NÃO deve ser acionada
    expect(handleOpen).not.toHaveBeenCalled()

    // Apenas ao clicar no botão ⌘K ela deve ser acionada
    const cmdkButton = screen.getByRole('button', { name: /abrir command palette/i })
    fireEvent.click(cmdkButton)

    expect(handleOpen).toHaveBeenCalledTimes(1)
  })

  it('permite digitar no input da navbar e limpa a busca ao clicar no botão X', () => {
    render(
      <BrowserRouter>
        <NavbarWithVisibilityToggle initialVisible={false} searchQuery="Avatar" />
      </BrowserRouter>
    )

    const input = screen.getByDisplayValue('Avatar')
    expect(input).toBeDefined()

    const clearButton = screen.getByRole('button', { name: /limpar busca da navbar/i })
    expect(clearButton).toBeDefined()

    fireEvent.click(clearButton)
    // O botão X não dispara a command palette
    expect(screen.queryByDisplayValue('Avatar')).toBeNull()
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

    expect(screen.getByDisplayValue('Oppenheimer')).toBeDefined()
    expect(container.querySelector('.animate-spin')).not.toBeNull()
  })
})
