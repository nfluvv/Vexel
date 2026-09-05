"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"
import { DECKS_LIMIT } from "@/shared/config/decks"

export async function createDraftDeckAction() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const userId = session.user.id

  const deck = await prisma.$transaction(async (tx) => {
    const count = await tx.deck.count({ where: { userId } })

    if (count >= DECKS_LIMIT) {
      throw new Error("DECKS_LIMIT_REACHED")
    }

    return tx.deck.create({
      data: { title: "Untitled", userId },
      select: { id: true },
    })
  })

  revalidatePath("/dashboard")

  return deck
}
