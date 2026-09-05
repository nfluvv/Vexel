import { z } from "zod"

export const createCardSchema = z.object({
  term: z.string().min(1).max(50),
  definition: z.string().min(1).max(200),
  deckId: z.string().min(1),
})

export type CreateCardInput = z.infer<typeof createCardSchema>
