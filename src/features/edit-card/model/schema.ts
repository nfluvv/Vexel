import { z } from "zod"

export const editCardSchema = z.object({
  term: z.string().min(1).max(200),
  definition: z.string().min(1).max(500),
})

export type EditCardInput = z.infer<typeof editCardSchema>
