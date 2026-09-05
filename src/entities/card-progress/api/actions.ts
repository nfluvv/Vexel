"use server"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"
import { calculateNextReview, addDays, type Quality } from "../lib/sm2"

export async function reviewCardAction(cardId: string, quality: Quality) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      deck: { OR: [{ userId: session.user.id }, { status: "PUBLIC" }] },
    },
    select: { id: true },
  })
  if (!card) throw new Error("Forbidden")

  const existing = await prisma.cardProgress.findUnique({
    where: { userId_cardId: { userId: session.user.id, cardId } },
  })

  const currentState = existing
    ? {
        easeFactor: existing.easeFactor,
        interval: existing.interval,
        repetitions: existing.repetitions,
      }
    : { easeFactor: 2.5, interval: 0, repetitions: 0 }

  const nextState = calculateNextReview(currentState, quality)
  const dueDate = addDays(new Date(), nextState.interval)

  return prisma.cardProgress.upsert({
    where: { userId_cardId: { userId: session.user.id, cardId } },
    create: {
      userId: session.user.id,
      cardId,
      ...nextState,
      dueDate,
      lastReviewedAt: new Date(),
    },
    update: {
      ...nextState,
      dueDate,
      lastReviewedAt: new Date(),
    },
  })
}
