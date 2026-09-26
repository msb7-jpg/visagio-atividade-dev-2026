export interface MovieReviewDTO {
  sk_movie_review_id: string
  sk_movie_id: string
  nome: string
  nota: number
  comentario: string | null
  created_at: string
}

export interface CreateReviewDTO {
  nome: string
  nota: number
  comentario?: string | null
}
