import { z } from 'zod'

export type editProfileFormValues = z.infer<typeof editProfileSchema>

export const editProfileSchema = z.object({
  // avatar: z.file().min(1, 'File is too small').max(1_000_000, 'File is too big').mime(['image/png']),
  userName: z.string().max(200, 'This name is too long').min(1, 'This name is too short'),
})
