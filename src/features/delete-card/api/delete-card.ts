"use server"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"

export async function DeleteCardAction(id: string, deckId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const card = await tx.card.findFirst({
        where: {
          id,
          deckId,
          deck: { userId: session.user.id },
        },
        select: { id: true },
      })

      if (!card) {
        return { success: false, reason: "not_found" as const }
      }

      const totalInDeck = await tx.card.count({
        where: { deckId },
      })

      if (totalInDeck <= 1) {
        return { success: false, reason: "last_card" as const }
      }

      await tx.card.delete({ where: { id } })

      return { success: true as const, id }
    })

    return result
  } catch {
    return { success: false, reason: "error" as const }
  }
}
