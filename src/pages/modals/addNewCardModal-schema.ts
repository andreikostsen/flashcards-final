import { z } from 'zod'

export type addNewCardFormValues = z.infer<typeof addNewCardSchema>

export const addNewCardSchema = z.object({
  answer: z.string().max(200, 'This name is too long').min(2, 'This name is too short'),
  question: z.string().max(200, 'This name is too long').min(1, 'This name is too short'),

})
