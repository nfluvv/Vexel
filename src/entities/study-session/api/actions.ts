"use server"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"

export async function recordStudySessionAction(deckId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const deck = await prisma.deck.findFirst({
    where: {
      id: deckId,
      OR: [{ userId: session.user.id }, { status: "PUBLIC" }],
    },
    select: { id: true },
  })

  if (!deck) throw new Error("Forbidden")

  return prisma.studySession.create({
    data: { userId: session.user.id, deckId },
  })
}
