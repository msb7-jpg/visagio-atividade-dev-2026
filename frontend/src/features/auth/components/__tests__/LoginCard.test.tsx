import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginCardView } from '@/features/auth/components/LoginCardView'

describe('LoginCardView', () => {
  it('renderiza os títulos, inputs de e-mail e senha e o botão de submissão', () => {
    const handleSubmit = vi.fn((e) => e.preventDefault())
    const handleFillDemo = vi.fn()

    render(
      <LoginCardView
        email=""
        setEmail={vi.fn()}
        password=""
        setPassword={vi.fn()}
        isLoading={false}
        onSubmit={handleSubmit}
        onFillDemoAdmin={handleFillDemo}
      />
    )

    expect(screen.getByText('ROCKETFILMS')).toBeInTheDocument()
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('admin@rocketfilms.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Entrar no Painel/i })).toBeInTheDocument()
  })

  it('exibe mensagens de erro de validação e erro de servidor', () => {
    render(
      <LoginCardView
        email=""
        setEmail={vi.fn()}
        emailError="O e-mail é obrigatório"
        password=""
        setPassword={vi.fn()}
        passwordError="A senha é obrigatória"
        serverError="E-mail ou senha inválidos"
        isLoading={false}
        onSubmit={vi.fn()}
        onFillDemoAdmin={vi.fn()}
      />
    )

    expect(screen.getByText('O e-mail é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('A senha é obrigatória')).toBeInTheDocument()
    expect(screen.getByText('E-mail ou senha inválidos')).toBeInTheDocument()
  })

  it('aciona callback de preenchimento rápido ao clicar em credenciais demo', () => {
    const handleFillDemo = vi.fn()

    render(
      <LoginCardView
        email=""
        setEmail={vi.fn()}
        password=""
        setPassword={vi.fn()}
        isLoading={false}
        onSubmit={vi.fn()}
        onFillDemoAdmin={handleFillDemo}
      />
    )

    const demoBtn = screen.getByRole('button', { name: /Preencher credencial de teste/i })
    fireEvent.click(demoBtn)
    expect(handleFillDemo).toHaveBeenCalledTimes(1)
  })
})
