"use server"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"
import { revalidatePath } from "next/cache"

export async function saveDeckAction(deckId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const deck = await prisma.deck.findFirst({
    where: { id: deckId, status: "PUBLIC", userId: { not: session.user.id } },
    select: { id: true },
  })
  if (!deck) throw new Error("Forbidden")

  revalidatePath("/dashboard")
  return prisma.savedDeck.upsert({
    where: { userId_deckId: { userId: session.user.id, deckId } },
    create: { userId: session.user.id, deckId },
    update: {},
  })
}

export async function unsaveDeckAction(deckId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.savedDeck.deleteMany({
    where: { userId: session.user.id, deckId },
  })

  revalidatePath("/dashboard")
}
