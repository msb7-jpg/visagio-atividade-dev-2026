import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setAppNavigator, navigateApp } from '@/lib/navigation'
import { queryClient } from '@/lib/query-client'

describe('navigation and mutationCache integration', () => {
  beforeEach(() => {
    setAppNavigator(null)
  })

  it('setAppNavigator registra a função e navigateApp a executa com opções', () => {
    const mockNavigate = vi.fn()
    setAppNavigator(mockNavigate)

    navigateApp('/login', { replace: true })
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })

  it('MutationCache onSuccess aciona redirectOnSuccess e invalidates quando especificados no meta', async () => {
    const mockNavigate = vi.fn()
    setAppNavigator(mockNavigate)

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => ({ success: true }),
      meta: {
        redirectOnSuccess: '/login',
        invalidates: [['mock-query-key']]
      }
    })

    await mutation.execute(undefined)

    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['mock-query-key'] })
  })

  it('MutationCache onSuccess aceita função geradora de rota em redirectOnSuccess', async () => {
    const mockNavigate = vi.fn()
    setAppNavigator(mockNavigate)

    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => ({ id: '123' }),
      meta: {
        redirectOnSuccess: (data: unknown) => `/filmes/${(data as { id: string }).id}`,
        replace: false
      }
    })

    await mutation.execute(undefined)

    expect(mockNavigate).toHaveBeenCalledWith('/filmes/123', { replace: false })
  })
})
