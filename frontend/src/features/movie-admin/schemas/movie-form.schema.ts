import { z } from 'zod'

export const movieFormSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, 'Título é obrigatório')
    .max(500, 'Título pode ter no máximo 500 caracteres'),
  diretor: z
    .string()
    .trim()
    .max(255, 'Nome do diretor pode ter no máximo 255 caracteres'),
  ano_lancamento: z.coerce
    .number({ invalid_type_error: 'Informe um ano válido' })
    .int('O ano deve ser um número inteiro')
    .min(1888, 'Ano mínimo é 1888 (início do cinema)')
    .max(2030, 'Ano máximo permitido é 2030'),
  duracao_minutos: z.coerce
    .number({ invalid_type_error: 'Informe uma duração válida' })
    .int('A duração deve ser em minutos inteiros')
    .min(1, 'Duração mínima é de 1 minuto')
    .max(1000, 'Duração máxima é de 1000 minutos')
    .nullable()
    .transform(val => (val === 0 || isNaN(val as number) ? null : val)),
  sinopse: z
    .string()
    .max(4000, 'A sinopse pode ter no máximo 4000 caracteres'),
  url_poster: z
    .string()
    .trim()
    .max(2048, 'URL do pôster muito longa')
    .refine(
      val => !val || /^https?:\/\/.+/i.test(val),
      'A URL do pôster deve começar com http:// ou https://'
    ),
  url_backdrop: z
    .string()
    .trim()
    .max(2048, 'URL do backdrop muito longa')
    .refine(
      val => !val || /^https?:\/\/.+/i.test(val),
      'A URL do backdrop deve começar com http:// ou https://'
    ),
  generos_ids: z.array(z.string())
})

export type MovieFormSchemaValues = z.infer<typeof movieFormSchema>
