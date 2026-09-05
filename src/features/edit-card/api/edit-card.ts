"use server"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"
import { editCardSchema, EditCardInput } from "../model/schema"

export async function updateCardAction(
  id: string,
  deckId: string,
  rawInput: EditCardInput
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const validated = editCardSchema.safeParse(rawInput)
  if (!validated.success) throw new Error("Invalid input data")

  const result = await prisma.card.updateMany({
    where: { id, deckId, deck: { userId: session.user.id } },
    data: validated.data,
  })

  if (result.count === 0) return { success: false as const }

  return { success: true as const, card: { id, ...validated.data } }
}
