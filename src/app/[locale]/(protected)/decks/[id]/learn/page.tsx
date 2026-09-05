import { notFound } from "next/navigation"
import { DeckLearnView } from "@/views/deck-learn-view"
import { getDeckById } from "@/entities/deck/api/queries"

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function LearnDeck({ params }: Props) {
  const { id } = await params

  const deck = await getDeckById(id)
  if (!deck) notFound()

  return <DeckLearnView deck={deck} />
}
