import { DeckCard } from "@/entities/deck"
import { getSavedDecks } from "@/entities/saved-deck/api/queries"
import { SaveDeckButton } from "@/features/save-deck-to-library"

import { SavedDecksPagination } from "./SavedDecksPagination"
import { getTranslations } from "next-intl/server"

interface Props {
  savedQuery?: string
  savedPage?: number
}

export async function SavedDecksGrid({
  savedQuery = "",
  savedPage = 1,
}: Props) {
  const { decks, total, pageSize } = await getSavedDecks(savedQuery, savedPage)

  const t = await getTranslations("dashboard")

  if (total === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {savedQuery
          ? t("saved.notFound", { savedQuery: savedQuery })
          : t("saved.doesntExists")}
      </p>
    )
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {decks.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            variant="public"
            actions={<SaveDeckButton deckId={deck.id} initialSaved={true} />}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <SavedDecksPagination currentPage={savedPage} totalPages={totalPages} />
      )}
    </div>
  )
}
