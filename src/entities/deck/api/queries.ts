import "server-only"
import { cache } from "react"
import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"

export const getUserDecks = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null

  return prisma.deck.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { cards: true } } },
  })
})

export const getDeckSummaryById = cache(async (deckId: string) => {
  const session = await auth()
  const viewerId = session?.user?.id

  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    include: {
      _count: { select: { cards: true } },
      ...(viewerId
        ? {
            savedDecks: {
              where: { userId: viewerId },
              select: { id: true },
            },
          }
        : {}),
    },
  })

  if (!deck) return null

  const isOwner = viewerId === deck.userId
  if (!isOwner && deck.status !== "PUBLIC") return null

  const { savedDecks, ...rest } = deck as typeof deck & {
    savedDecks?: { id: string }[]
  }

  return {
    ...rest,
    isSaved: (savedDecks?.length ?? 0) > 0,
  }
})

export const getDeckById = cache(async (deckId: string) => {
  const session = await auth()

  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    include: { cards: true },
  })

  if (!deck) return null

  const isOwner = session?.user?.id === deck.userId
  if (isOwner) return deck

  if (deck.status !== "PUBLIC") return null

  return deck
})

export const getOwnedDeckById = cache(async (deckId: string) => {
  const session = await auth()
  if (!session?.user?.id) return null

  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    include: { cards: true },
  })

  if (!deck) return null
  if (deck.userId !== session.user.id) return null

  return deck
})

export const getPublicDecks = cache(async () => {
  return prisma.deck.findMany({
    where: { status: "PUBLIC" },
    orderBy: { publishedAt: "desc" },
    include: { _count: { select: { cards: true } } },
  })
})

export const getPublicUserDecks = cache(async (userId: string) => {
  const session = await auth()
  const viewerId = session?.user?.id

  const decks = await prisma.deck.findMany({
    where: {
      userId,
      status: "PUBLIC",
    },
    include: {
      _count: {
        select: {
          cards: true,
        },
      },
      ...(viewerId
        ? {
            savedDecks: {
              where: {
                userId: viewerId,
              },
              select: {
                id: true,
              },
            },
          }
        : {}),
    },
    orderBy: {
      publishedAt: "desc",
    },
  })

  return decks.map(({ savedDecks, ...deck }) => ({
    ...deck,
    isSaved: savedDecks?.length > 0,
  }))
})

export const searchPublicDecks = cache(async (query: string, limit = 10) => {
  if (!query.trim()) return []

  return prisma.deck.findMany({
    where: {
      status: "PUBLIC",
      title: { contains: query, mode: "insensitive" },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { _count: { select: { cards: true } } },
  })
})

export const getRecentPublicUserDecks = cache(
  async (userId: string, limit = 4) => {
    const session = await auth()
    const viewerId = session?.user?.id

    const decks = await prisma.deck.findMany({
      where: {
        userId,
        status: "PUBLIC",
      },
      take: limit,
      include: {
        _count: {
          select: {
            cards: true,
          },
        },
        ...(viewerId
          ? {
              savedDecks: {
                where: {
                  userId: viewerId,
                },
                select: {
                  id: true,
                },
              },
            }
          : {}),
      },
      orderBy: { publishedAt: "desc" },
    })

    return decks.map(({ savedDecks, ...deck }) => ({
      ...deck,
      isSaved: savedDecks?.length > 0,
    }))
  }
)

export const getPopularDecks = cache(async (limit = 4) => {
  const session = await auth()
  const viewerId = session?.user?.id

  const decks = await prisma.deck.findMany({
    where: { status: "PUBLIC" },
    take: limit,
    orderBy: {
      savedDecks: {
        _count: "desc",
      },
    },
    include: {
      _count: {
        select: {
          cards: true,
          savedDecks: true,
        },
      },
      ...(viewerId
        ? {
            savedDecks: {
              where: {
                userId: viewerId,
              },
              select: {
                id: true,
              },
            },
          }
        : {}),
    },
  })

  return decks.map(({ savedDecks, ...deck }) => ({
    ...deck,
    isSaved: savedDecks?.length > 0,
  }))
})
