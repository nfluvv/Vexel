import { getTranslations } from "next-intl/server"
import { DECKS_LIMIT } from "@/shared/config/decks"
import { ClientFilters } from "@/widgets/my-decks/ui/ClientFilters"
import { DeleteDeckButton } from "@/features/delete-deck/ui/delete-deck-button"
import { EditDeckButton } from "@/features/edit-deck/ui/edit-deck-button"
import { DeckCard } from "@/entities/deck/ui/DeckCard"
import { StartDeckCard } from "@/features/create-deck/ui/start-deck-card"
import type { DeckWithCount } from "@/entities/deck"

interface MyDecksProps {
  currentDecksCount: number
  filter: string
  query: string
  decks: DeckWithCount[]
}

export const MyDecks = async ({
  currentDecksCount,
  filter,
  query,
  decks,
}: MyDecksProps) => {
  const t = await getTranslations("dashboard")

  const filteredDecks = decks?.filter((deck) => {
    const title = deck.title || "Untitled"
    const matchesSearch = title.toLowerCase().includes(query.toLowerCase())

    if (filter === "private") {
      return matchesSearch && deck.status === "PRIVATE"
    }

    if (filter === "public") {
      return matchesSearch && deck.status === "PUBLIC"
    }

    if (filter === "draft") {
      return matchesSearch && deck.status === "DRAFT"
    }

    return matchesSearch
  })

  return (
    <div className="col-span-12 lg:col-span-9">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold tracking-tight">
            {t("totalDecks")}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {t("manageDecks")}
          </p>
        </div>

        <span className="text-xs text-muted-foreground tabular-nums sm:text-sm">
          {currentDecksCount} / {DECKS_LIMIT}
        </span>
      </div>

      <ClientFilters
        currentFilter={filter}
        placeholder={t("searchPlaceholder")}
      />

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {currentDecksCount === 0 ? (
          <StartDeckCard />
        ) : (
          <>
            {!query && (!filter || filter === "all") && <StartDeckCard />}

            {filteredDecks?.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                variant="owner"
                actions={
                  <>
                    <EditDeckButton deckId={deck.id} />
                    <DeleteDeckButton
                      deckId={deck.id}
                      deckTitle={deck.title ?? undefined}
                    />
                  </>
                }
              />
            ))}

            {filteredDecks?.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed py-16 text-center">
                <p className="text-sm text-muted-foreground">
                  {t("decksNotFound")}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
