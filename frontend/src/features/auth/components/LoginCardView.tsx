import { RequiredFieldBadge } from '@/components/feedback/RequiredFieldBadge'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { StatefulButton } from '@/components/ui/stateful-button'
import { Tooltip } from '@/components/ui/tooltip-card'
import { Clapperboard, Lock, Mail, Sparkles } from 'lucide-react'
import type { FormEvent } from 'react'

interface LoginCardViewProps {
  email: string
  setEmail: (val: string) => void
  emailError?: string
  password: string
  setPassword: (val: string) => void
  passwordError?: string
  serverError?: string | null
  isLoading: boolean
  onSubmit: (e: FormEvent) => void
  onFillDemoAdmin: () => void
}

export function LoginCardView({
  email,
  setEmail,
  emailError,
  password,
  setPassword,
  passwordError,
  serverError,
  isLoading,
  onSubmit,
  onFillDemoAdmin
}: LoginCardViewProps) {
  return (
    <div className="flex h-[560px] w-full max-w-md flex-col justify-between rounded-2xl border border-white/10 bg-card/85 p-8 shadow-2xl backdrop-blur-xl">
      <div>
        {/* Brand & Heading */}
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 text-base font-bold tracking-wider text-primary">
            <Clapperboard className="size-5" />
            <span>ROCKETFILMS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Bem-vindo de volta
          </h1>
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Entre com sua conta administrativa para gerir o catálogo e moderar avaliações.
          </p>
        </div>

        {/* Global Server Error Message */}
        {serverError && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive">
            {serverError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="flex items-center text-xs font-medium text-muted-foreground"
            >
              <span>E-mail</span>
              <RequiredFieldBadge tooltipText="Insira seu e-mail institucional" />
            </label>
            <InputGroup
              className={`h-10 rounded-xl bg-secondary/40 transition-colors ${
                emailError ? 'border-destructive' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <InputGroupAddon align="inline-start" className="pl-3 text-muted-foreground">
                <Mail className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rocketfilms.com"
                disabled={isLoading}
                aria-invalid={!!emailError}
                className="text-sm placeholder:text-muted-foreground/40"
              />
            </InputGroup>
            {emailError && (
              <p className="text-xs font-medium text-destructive">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="flex items-center text-xs font-medium text-muted-foreground"
            >
              <span>Senha</span>
              <RequiredFieldBadge tooltipText="Insira sua senha de acesso administrativo" />
            </label>
            <InputGroup
              className={`h-10 rounded-xl bg-secondary/40 transition-colors ${
                passwordError ? 'border-destructive' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <InputGroupAddon align="inline-start" className="pl-3 text-muted-foreground">
                <Lock className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                aria-invalid={!!passwordError}
                className="text-sm placeholder:text-muted-foreground/40"
              />
            </InputGroup>
            {passwordError && (
              <p className="text-xs font-medium text-destructive">{passwordError}</p>
            )}
          </div>

          {/* Aceternity StatefulButton para submissão */}
          <div className="mt-2">
            <StatefulButton
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              className="w-full text-sm font-semibold"
            >
              <span>{isLoading ? 'Autenticando...' : 'Entrar no Painel'}</span>
            </StatefulButton>
          </div>
        </form>
      </div>

      {/* Demo Credentials Quick Fill Helper */}
      <div className="mt-4 flex flex-col items-center gap-1.5 border-t border-white/5 pt-3 text-center">
        <p className="text-xs text-muted-foreground">
          Alo visagiano, clica aq
        </p>
        <Tooltip
          content={
            <div className="flex flex-col gap-1 text-left">
              <span className="font-semibold text-primary">Atenção Visagiano!</span>
              <span className="text-xs text-muted-foreground">
                Vc está presetes a ver um sistema sensacional, espero que aproveite :)
              </span>
            </div>
          }
        >
          <Button
            onClick={onFillDemoAdmin}
            disabled={isLoading}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-secondary/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>Preencher credencial de teste</span>
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}
