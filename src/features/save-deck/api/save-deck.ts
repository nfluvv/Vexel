"use server"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"
import { saveDeckSchema, SaveDeckInput } from "../model/schema"

export async function saveDeckAction(rawInput: SaveDeckInput) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const validated = saveDeckSchema.safeParse(rawInput)
  if (!validated.success) throw new Error("Invalid input data")

  const { deckId, title, description, status } = validated.data

  return prisma.$transaction(async (tx) => {
    const deck = await tx.deck.findFirst({
      where: { id: deckId, userId: session.user.id },
      select: { publishedAt: true, _count: { select: { cards: true } } },
    })

    if (!deck) throw new Error("Forbidden or deck not found")

    if (status === "PUBLIC" && deck._count.cards === 0) {
      throw new Error("Cannot publish an empty deck")
    }

    return tx.deck.update({
      where: { id: deckId },
      data: {
        title,
        description: description || null,
        status,
        publishedAt:
          status === "PUBLIC"
            ? (deck.publishedAt ?? new Date())
            : deck.publishedAt,
      },
      select: { id: true, status: true },
    })
  })
}
