export interface PersonSummaryDTO {
  sk_person_id: string
  nome_pessoa: string
  tipo_pessoa: string
}

export interface CompanyDTO {
  sk_company_id: string
  nome_produtora: string
}

export interface GenreDTO {
  sk_genre_id: string
  nome_genero: string
}

export interface FinancialMetricsDTO {
  orcamento_usd: number | string | null
  receita_usd: number | string | null
  lucro_usd: number | string | null
  orcamento_brl: number | string | null
  receita_brl: number | string | null
  lucro_brl: number | string | null
  roi_percentual: number | null
  popularidade: number
  nota_tmdb: number | null
  qtd_tmdb: number | null
  nota_imdb: number | null
  qtd_imdb: number | null
}

export interface MovieDetailDTO {
  sk_movie_id: string
  id_filme: string
  titulo: string
  data_lancamento: string | null
  ano_lancamento: number | null
  duracao_minutos: number | null
  status_filme: string | null
  sinopse: string | null
  url_poster: string | null
  url_backdrop: string | null
  generos: GenreDTO[]
  produtoras: CompanyDTO[]
  diretores: PersonSummaryDTO[]
  roteiristas: PersonSummaryDTO[]
  atores: PersonSummaryDTO[]
  metricas: FinancialMetricsDTO
  nota_media_usuarios: number | null
  qtd_avaliacoes_usuarios: number
}
