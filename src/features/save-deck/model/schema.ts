import { z } from "zod"

export const saveDeckSchema = z.object({
  deckId: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(["PRIVATE", "PUBLIC"]),
})

export type SaveDeckInput = z.infer<typeof saveDeckSchema>
