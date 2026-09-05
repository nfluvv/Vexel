import { notFound } from "next/navigation"
import { DeckBrowseView } from "@/views/deck-browse-view"
import { getDeckById } from "@/entities/deck/api/queries"

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function BrowseDeck({ params }: Props) {
  const { id } = await params

  const deck = await getDeckById(id)
  if (!deck) notFound()

  return <DeckBrowseView deck={deck} />
}
