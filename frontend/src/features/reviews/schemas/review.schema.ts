import { z } from 'zod'

export const reviewSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, 'O nome deve conter pelo menos 1 caractere.')
    .max(120, 'O nome deve conter no máximo 120 caracteres.'),
  nota: z
    .number()
    .min(1, 'Selecione uma nota de 0.5 a 5 estrelas.')
    .max(10, 'A nota máxima permitida é 10.'),
  comentario: z
    .string()
    .trim()
    .max(4000, 'Sua resenha não pode ultrapassar 4.000 caracteres.')
    .optional()
    .default('')
})

export type ReviewFormValues = z.infer<typeof reviewSchema>
