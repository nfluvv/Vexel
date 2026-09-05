import { notFound } from "next/navigation"
import Link from "next/link"
import { getDeckSummaryById } from "@/entities/deck/api/queries"
import { getDueCardsCount } from "@/entities/card-progress/api/queries"
import { BackButton } from "@/shared/client/ui"
import { SaveDeckButton } from "@/features/save-deck-to-library"
import { auth } from "@/auth"
import { DeckLanding } from "@/views/deck-landing"

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function DeckPage({ params }: Props) {
  const { id } = await params
  const session = await auth()

  const deck = await getDeckSummaryById(id)

  if (!deck) notFound()

  const dueCount = await getDueCardsCount(id)
  const cardCount = deck._count.cards

  return <DeckLanding dueCount={dueCount} cardCount={cardCount} deck={deck} />
}
