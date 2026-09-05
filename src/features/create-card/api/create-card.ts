"use server"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"
import { createCardSchema, CreateCardInput } from "../model/schema"
import { MAX_CARDS_PER_DECK } from "@/shared/config/decks"

export async function createCardAction(rawInput: CreateCardInput) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const validated = createCardSchema.safeParse(rawInput)
  if (!validated.success) {
    throw new Error("Invalid input data")
  }

  const { deckId, term, definition } = validated.data

  return prisma.$transaction(async (tx) => {
    const deck = await tx.deck.findUnique({
      where: { id: deckId, userId: session.user.id },
      select: { _count: { select: { cards: true } } },
    })

    if (!deck) {
      throw new Error("Forbidden")
    }

    if (deck._count.cards >= MAX_CARDS_PER_DECK) {
      throw new Error("Card limit reached")
    }

    return tx.card.create({
      data: { deckId, term, definition },
    })
  })
}
