import { RequiredFieldBadge } from '@/components/feedback/RequiredFieldBadge'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { StatefulButton } from '@/components/ui/stateful-button'
import { Tooltip } from '@/components/ui/tooltip-card'
import { Clapperboard, Lock, Mail, Sparkles } from 'lucide-react'
import type { SubmitEvent } from 'react'

interface LoginCardViewProps {
  email: string
  setEmail: (val: string) => void
  emailError?: string
  password: string
  setPassword: (val: string) => void
  passwordError?: string
  serverError?: string | null
  isLoading: boolean
  onSubmit: (e: SubmitEvent) => void
  onFillDemoAdmin: () => void
}

export function LoginCardView(props: LoginCardViewProps) {
  return (
    <div className="flex h-140 w-full max-w-md flex-col justify-between rounded-2xl border border-white/10 bg-card/85 p-8 shadow-2xl backdrop-blur-xl">
      <div>
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

        {/* Global Server Error Message - TODO: use a toast instead*/}
        {props.serverError && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive">
            {props.serverError}
          </div>
        )}

        <form onSubmit={props.onSubmit} className="flex flex-col gap-4" noValidate>
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
                props.emailError ? 'border-destructive' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <InputGroupAddon align="inline-start" className="pl-3 text-muted-foreground">
                <Mail className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                id="email"
                type="email"
                value={props.email}
                onChange={(e) => props.setEmail(e.target.value)}
                placeholder="admin@rocketfilms.com"
                disabled={props.isLoading}
                aria-invalid={!!props.emailError}
                className="placeholder:text-muted-foreground/40"
              />
            </InputGroup>
            {props.emailError && (
              <p className="text-xs font-medium text-destructive">{props.emailError}</p>
            )}
          </div>

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
                props.passwordError ? 'border-destructive' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <InputGroupAddon align="inline-start" className="pl-3 text-muted-foreground">
                <Lock className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                id="password"
                type="password"
                value={props.password}
                onChange={(e) => props.setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={props.isLoading}
                aria-invalid={!!props.passwordError}
                className="placeholder:text-muted-foreground/40"
              />
            </InputGroup>
            {props.passwordError && (
              <p className="text-xs font-medium text-destructive">{props.passwordError}</p>
            )}
          </div>

          <div className="mt-2">
            <StatefulButton
              type="submit"
              disabled={props.isLoading}
              loading={props.isLoading}
              className="w-full text-sm font-semibold"
            >
              <span>{props.isLoading ? 'Autenticando...' : 'Entrar no Painel'}</span>
            </StatefulButton>
          </div>
        </form>
      </div>

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
            type="button"
            variant="outline"
            size="sm"
            onClick={props.onFillDemoAdmin}
            disabled={props.isLoading}
            className="cursor-pointer"
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>Preencher credencial de teste</span>
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}
