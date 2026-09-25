import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { AuthProvider } from '@/features/auth/context/AuthProvider'
import { LoginContainer } from '../LoginContainer'

function renderLoginContainer() {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <LoginContainer />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('LoginContainer with TanStack Form and TanStack Query', () => {
  it('renderiza os campos e preenche credenciais de teste via TanStack Form', async () => {
    renderLoginContainer()

    const emailInput = screen.getByPlaceholderText('admin@rocketfilms.com') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement

    expect(emailInput.value).toBe('')
    expect(passwordInput.value).toBe('')

    const demoBtn = screen.getByRole('button', { name: /Preencher credencial de teste/i })
    fireEvent.click(demoBtn)

    await waitFor(() => {
      expect(emailInput.value).toBe('admin@rocketfilms.com')
      expect(passwordInput.value).toBe('admin123')
    })
  })

  it('exibe erros de validação ao submeter formulário vazio', async () => {
    renderLoginContainer()

    const submitBtn = screen.getByRole('button', { name: /Entrar no Painel/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText('O e-mail é obrigatório')).toBeInTheDocument()
      expect(screen.getByText('A senha é obrigatória')).toBeInTheDocument()
    })
  })
})
