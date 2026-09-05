import "server-only"
import { cache } from "react"
import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"

export const SAVED_DECKS_PAGE_SIZE = 4

export const getSavedDecks = cache(
  async (query: string = "", page: number = 1) => {
    const session = await auth()

    if (!session?.user?.id) {
      return { decks: [], total: 0, pageSize: SAVED_DECKS_PAGE_SIZE }
    }

    const safePage = Math.max(1, page)

    const where = {
      userId: session.user.id,
      ...(query.trim()
        ? {
            deck: {
              title: {
                contains: query.trim(),
                mode: "insensitive" as const,
              },
            },
          }
        : {}),
    }

    const [saved, total] = await Promise.all([
      prisma.savedDeck.findMany({
        where,
        orderBy: { savedAt: "desc" },
        include: {
          deck: { include: { _count: { select: { cards: true } } } },
        },
        skip: (safePage - 1) * SAVED_DECKS_PAGE_SIZE,
        take: SAVED_DECKS_PAGE_SIZE,
      }),
      prisma.savedDeck.count({ where }),
    ])

    return {
      decks: saved.map((s) => s.deck),
      total,
      pageSize: SAVED_DECKS_PAGE_SIZE,
    }
  }
)

export const isDeckSaved = cache(async (deckId: string) => {
  const session = await auth()
  if (!session?.user?.id) return false

  const saved = await prisma.savedDeck.findUnique({
    where: { userId_deckId: { userId: session.user.id, deckId } },
  })

  return saved !== null
})
