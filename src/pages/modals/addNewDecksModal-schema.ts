import { z } from 'zod'

export type addNewDeckFormValues = z.infer<typeof addNewDeckSchema>

export const addNewDeckSchema = z.object({
  isPrivate: z.boolean(),
  name: z.string().max(200, 'This name is too long').min(3, 'This name is too short'),
})
