import { apiClient } from '@/lib/api-client'
import type { AdminUser, LoginFormData, TokenResponse } from '@/features/auth/schemas/auth.schema'

export const authApi = {
  /**
   * Realiza login enviando credenciais de e-mail e senha.
   */
  async login(credentials: LoginFormData): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/login', credentials)
    return response.data
  },

  /**
   * Obtém os dados do perfil do administrador autenticado atual.
   */
  async getMe(): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>('/auth/me')
    return response.data
  }
}
