import { notFound } from "next/navigation"
import { getOwnedDeckById } from "@/entities/deck/api/queries"
import { EditDeckView } from "@/views/edit-deck-view"

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditDeckPage({ params }: Props) {
  const { id } = await params
  const deck = await getOwnedDeckById(id)

  if (!deck) notFound()

  return <EditDeckView initialDeck={deck} />
}
