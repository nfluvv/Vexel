import "server-only"
import { cache } from "react"
import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"

export const getDueCards = cache(async (deckId: string) => {
  const session = await auth()
  if (!session?.user?.id) return []

  const deck = await prisma.deck.findFirst({
    where: {
      id: deckId,
      OR: [{ userId: session.user.id }, { status: "PUBLIC" }],
    },
    select: { id: true },
  })
  if (!deck) return []

  const now = new Date()

  const cards = await prisma.card.findMany({
    where: {
      deckId,
      OR: [
        { cardProgresses: { none: { userId: session.user.id } } },
        {
          cardProgresses: {
            some: { userId: session.user.id, dueDate: { lte: now } },
          },
        },
      ],
    },
    include: {
      cardProgresses: {
        where: { userId: session.user.id },
      },
    },
  })

  return cards
})

export const getDueCardsCount = cache(async (deckId: string) => {
  const session = await auth()
  if (!session?.user?.id) return 0

  const deck = await prisma.deck.findFirst({
    where: {
      id: deckId,
      OR: [{ userId: session.user.id }, { status: "PUBLIC" }],
    },
    select: { id: true },
  })
  if (!deck) return 0

  const now = new Date()

  return prisma.card.count({
    where: {
      deckId,
      OR: [
        { cardProgresses: { none: { userId: session.user.id } } },
        {
          cardProgresses: {
            some: { userId: session.user.id, dueDate: { lte: now } },
          },
        },
      ],
    },
  })
})
