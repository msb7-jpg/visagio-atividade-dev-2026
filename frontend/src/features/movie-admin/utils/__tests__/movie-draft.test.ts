import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  clearMovieDraft,
  getMovieDraft,
  hasMovieDraft,
  isDraftNotEmpty,
  MOVIE_DRAFT_KEY,
  saveMovieDraft
} from '../movie-draft'

describe('movie-draft utility', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('isDraftNotEmpty retorna false para valores vazios', () => {
    expect(isDraftNotEmpty(null)).toBe(false)
    expect(isDraftNotEmpty({})).toBe(false)
    expect(isDraftNotEmpty({ titulo: '   ' })).toBe(false)
  })

  it('isDraftNotEmpty retorna true se algum campo estiver preenchido', () => {
    expect(isDraftNotEmpty({ titulo: 'Oppenheimer' })).toBe(true)
    expect(isDraftNotEmpty({ sinopse: 'Um filme biográfico' })).toBe(true)
    expect(isDraftNotEmpty({ url_poster: 'https://image.tmdb.org/poster.jpg' })).toBe(true)
    expect(isDraftNotEmpty({ generos_ids: ['1', '2'] })).toBe(true)
  })

  it('salva e recupera rascunho do localStorage', () => {
    saveMovieDraft({
      titulo: 'Interestelar',
      diretor: 'Christopher Nolan',
      ano_lancamento: 2014,
      duracao_minutos: 169,
      sinopse: 'Viagem espacial através de um buraco de minhoca.',
      url_poster: 'https://image.tmdb.org/poster.jpg',
      url_backdrop: 'https://image.tmdb.org/backdrop.jpg',
      generos_ids: ['1']
    })

    expect(hasMovieDraft()).toBe(true)
    const draft = getMovieDraft()
    expect(draft?.titulo).toBe('Interestelar')
    expect(draft?.diretor).toBe('Christopher Nolan')
    expect(draft?.updatedAt).toBeDefined()
  })

  it('limpa o rascunho com clearMovieDraft', () => {
    localStorage.setItem(MOVIE_DRAFT_KEY, JSON.stringify({ titulo: 'Avatar' }))
    expect(hasMovieDraft()).toBe(true)

    clearMovieDraft()
    expect(hasMovieDraft()).toBe(false)
    expect(getMovieDraft()).toBeNull()
  })
})
