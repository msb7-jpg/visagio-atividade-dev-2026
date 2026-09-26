import { describe, expect, it } from 'vitest'
import {
  formatCompactCurrency,
  formatCurrency,
  formatDuration,
  formatRoi
} from '../movie-formatters'

describe('movie-formatters', () => {
  describe('formatDuration', () => {
    it('deve formatar minutos em horas e minutos', () => {
      expect(formatDuration(169)).toBe('2h 49m')
      expect(formatDuration(120)).toBe('2h')
      expect(formatDuration(45)).toBe('45min')
    })

    it('deve lidar com valores nulos ou zero', () => {
      expect(formatDuration(null)).toBe('Duração não informada')
      expect(formatDuration(undefined)).toBe('Duração não informada')
      expect(formatDuration(0)).toBe('Duração não informada')
    })
  })

  describe('formatCompactCurrency', () => {
    it('deve formatar valores monetários compactos em USD e BRL', () => {
      expect(formatCompactCurrency(800000, 'USD')).toBe('$800k')
      expect(formatCompactCurrency(165000000, 'USD')).toBe('$165M')
      expect(formatCompactCurrency(1000000000, 'USD')).toBe('$1B')
      expect(formatCompactCurrency(701729206, 'USD')).toBe('$701.7M')
      expect(formatCompactCurrency(3508646030, 'BRL')).toBe('R$3.5B')
      expect(formatCompactCurrency(-50000000, 'USD')).toBe('-$50M')
    })

    it('deve lidar com valores menores que mil e formatações numéricas', () => {
      expect(formatCompactCurrency(500, 'USD')).toBe('$500')
      expect(formatCompactCurrency(500, 'BRL')).toBe('R$500')
      expect(formatCompactCurrency('1500000', 'USD')).toBe('$1.5M')
      expect(formatCompactCurrency(-500, 'USD')).toBe('-$500')
    })

    it('deve lidar com valores nulos ou inválidos', () => {
      expect(formatCompactCurrency(null)).toBe('Não informado')
      expect(formatCompactCurrency(undefined)).toBe('Não informado')
      expect(formatCompactCurrency('')).toBe('Não informado')
      expect(formatCompactCurrency('invalid-number')).toBe('Não informado')
    })
  })

  describe('formatCurrency', () => {
    it('deve formatar valores monetários em USD', () => {
      const formatted = formatCurrency(165000000, 'USD')
      expect(formatted).toContain('165,000,000')
      expect(formatted).toContain('$')
    })

    it('deve formatar valores monetários em BRL', () => {
      const formatted = formatCurrency(825000000, 'BRL')
      expect(formatted).toContain('R$')
    })

    it('deve lidar com valores nulos ou inválidos', () => {
      expect(formatCurrency(null)).toBe('Não informado')
      expect(formatCurrency(undefined)).toBe('Não informado')
      expect(formatCurrency('')).toBe('Não informado')
    })
  })

  describe('formatRoi', () => {
    it('deve formatar ROI positivo com sinal + e flag verdadeira', () => {
      const result = formatRoi(325.28)
      expect(result.formatted).toBe('+325.3%')
      expect(result.isPositive).toBe(true)
    })

    it('deve formatar ROI negativo com flag falsa', () => {
      const result = formatRoi(-42.1)
      expect(result.formatted).toBe('-42.1%')
      expect(result.isPositive).toBe(false)
    })

    it('deve retornar N/A para valores nulos', () => {
      const result = formatRoi(null)
      expect(result.formatted).toBe('N/A')
      expect(result.isPositive).toBe(false)
    })
  })
})
