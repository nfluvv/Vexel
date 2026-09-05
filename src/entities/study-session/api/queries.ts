import "server-only"
import { cache } from "react"
import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"
import { getLocalDateKey } from "@/shared/server/lib/timezone"

export const getRecentStudiedDecks = cache(async (limit = 3) => {
  const session = await auth()
  if (!session?.user?.id) return []

  const sessions = await prisma.studySession.findMany({
    where: { userId: session.user.id },
    orderBy: { completedAt: "desc" },
    take: 20,
    include: {
      deck: { include: { _count: { select: { cards: true } } } },
    },
  })

  const seen = new Set<string>()
  const result: (typeof sessions)[number]["deck"] extends infer D
    ? Array<{ deck: D; lastStudiedAt: Date }>
    : never = []

  for (const s of sessions) {
    if (seen.has(s.deckId)) continue
    seen.add(s.deckId)
    result.push({ deck: s.deck, lastStudiedAt: s.completedAt })
    if (result.length >= limit) break
  }

  return result
})

export const getStreak = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return 0

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { timezone: true },
  })
  const timezone = user?.timezone ?? "UTC"

  const sessions = await prisma.studySession.findMany({
    where: { userId: session.user.id },
    orderBy: { completedAt: "desc" },
    take: 400,
    select: { completedAt: true },
  })

  return computeStreak(
    sessions.map((s) => s.completedAt),
    timezone
  )
})

function computeStreak(dates: Date[], timezone: string): number {
  const days = new Set(dates.map((d) => getLocalDateKey(d, timezone)))

  let streak = 0
  const cursor = new Date()

  const todayStr = getLocalDateKey(cursor, timezone)
  if (!days.has(todayStr)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  while (days.has(getLocalDateKey(cursor, timezone))) {
    streak++
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  return streak
}
