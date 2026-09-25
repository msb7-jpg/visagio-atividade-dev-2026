import { describe, it, expect } from 'vitest'
import { extractFirstErrorMessage } from '../form-error'

describe('extractFirstErrorMessage', () => {
  it('retorna undefined para entradas vazias ou não-array', () => {
    expect(extractFirstErrorMessage(null)).toBeUndefined()
    expect(extractFirstErrorMessage(undefined)).toBeUndefined()
    expect(extractFirstErrorMessage([])).toBeUndefined()
    expect(extractFirstErrorMessage('erro')).toBeUndefined()
  })

  it('retorna a mensagem quando o item é uma string', () => {
    expect(extractFirstErrorMessage(['Campo obrigatório'])).toBe('Campo obrigatório')
  })

  it('retorna a propriedade message quando o item é um objeto de erro Zod', () => {
    expect(extractFirstErrorMessage([{ message: 'Formato inválido' }])).toBe('Formato inválido')
  })

  it('retorna undefined quando o objeto não possui message do tipo string', () => {
    expect(extractFirstErrorMessage([{ code: 123 }])).toBeUndefined()
  })
})
