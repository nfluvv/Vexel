import { notFound } from "next/navigation"
import { getDeckSummaryById } from "@/entities/deck/api/queries"
import { getDueCards } from "@/entities/card-progress/api/queries"
import { DeckReviewView } from "@/views/deck-review-view"

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function ReviewDeck({ params }: Props) {
  const { id } = await params

  const deck = await getDeckSummaryById(id)
  if (!deck) notFound()

  const dueCards = await getDueCards(id)

  return <DeckReviewView deck={deck} dueCards={dueCards} />
}
