import { getTranslations } from "next-intl/server"
import { SaveDeckButton } from "@/features/save-deck-to-library"
import { DeckCard, type PublicDeckWithSaveState } from "@/entities/deck"

interface Props {
  decks: PublicDeckWithSaveState[]
}

export const PopularDecks = async ({ decks }: Props) => {
  const t = await getTranslations("dashboard")

  return (
    <div className="mb-10">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("popular.title")}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("popular.desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {decks.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            variant="public"
            actions={
              <SaveDeckButton deckId={deck.id} initialSaved={deck.isSaved} />
            }
          />
        ))}
      </div>
    </div>
  )
}
