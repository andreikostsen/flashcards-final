import { z } from "zod";

export const editProfileSchema = z.object({
  avatar: z
    .any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 1_000_000,
      { message: "File too big (max 1MB)" }
    )
    .refine(
      (files) => !files || files.length === 0 || files[0]?.type?.startsWith("image/"),
      { message: "Only Image files are allowed" }
    ),


  userName: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name is too long")
    .optional()
    .transform((val) => (val?.trim() === "" ? undefined : val))
    .refine((val) => val === undefined || val.length > 0, {
      message: "Name cannot be empty"
    })
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>