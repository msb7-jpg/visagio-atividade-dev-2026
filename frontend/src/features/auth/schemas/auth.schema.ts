import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido (ex: admin@rocketfilms.com)'),
  senha: z
    .string()
    .min(1, 'A senha é obrigatória')
    .min(4, 'A senha deve conter ao menos 4 caracteres')
})

export type LoginFormData = z.infer<typeof loginSchema>

export interface JwtPayload {
  sub: string
  email: string
  nome?: string
  role?: string
  exp?: number
  iat?: number
}

export interface AdminUser {
  id: string
  email: string
  nome: string
  role: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}
