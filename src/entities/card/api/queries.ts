import "server-only"
import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"

const CARDS_PAGE_SIZE = 20

export async function getDeckCardsPage(deckId: string, cursor?: string) {
  "use server"
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId: session.user.id },
    select: { id: true },
  })
  if (!deck) throw new Error("Forbidden")

  const cards = await prisma.card.findMany({
    where: { deckId },
    orderBy: { createdAt: "asc" },
    take: CARDS_PAGE_SIZE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })

  const hasMore = cards.length > CARDS_PAGE_SIZE
  const items = hasMore ? cards.slice(0, CARDS_PAGE_SIZE) : cards

  return { items, nextCursor: hasMore ? items.at(-1)!.id : null }
}
