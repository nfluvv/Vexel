import { z } from "zod"

export const createDeckSchema = z.object({
  title: z
    .string()
    .min(3, "Название должно быть не менее 3 символов")
    .max(50, "Название не должно превышать 50 символов")
    .trim(),
  description: z
    .string()
    .max(300, "Описание слишком длинное")
    .optional()
    .or(z.literal("")),
})

export type CreateDeckInput = z.infer<typeof createDeckSchema>
