import { z } from 'zod'

export type addNewDeckFormValues = z.infer<typeof addNewDeckSchema>

export const addNewDeckSchema = z.object({
  addDeckCoverInput: z
    .any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files.size <= 1_000_000,
      { message: 'File too big (max 1MB)' }
    )
    .refine(
      (files) => !files || files.length === 0 || files?.type?.startsWith("image/"),
      { message: 'Only Image files are allowed' }
    ),
  isPrivate: z.boolean(),
  name: z.string().max(200, 'This name is too long').min(3, 'This name is too short'),
});
