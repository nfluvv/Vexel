import { useTranslations } from "next-intl"
import { Layers } from "lucide-react"
import { DeckCard, type PublicDeckWithSaveState } from "@/entities/deck"
import { SaveDeckButton } from "@/features/save-deck-to-library"
import Link from "next/link"

type UserProfileDecksProps = {
  decks: PublicDeckWithSaveState[]
  canSaveDecks: boolean
  username?: string | null
}

export function UserProfileDecks({
  decks,
  canSaveDecks,
  username,
}: UserProfileDecksProps) {
  const t = useTranslations("profileDecks")

  return (
    <section className="border-t border-border/70 px-5 py-7 sm:px-8 sm:py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">{t("heading")}</h2>

        {decks.length > 0 && (
          <Link
            href={`/users/${username}/decks`}
            className="text-[12px] text-muted-foreground/90 tabular-nums"
          >
            {t("viewAll")}
          </Link>
        )}
      </div>

      {decks.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-border/70 py-14 text-center">
          <Layers className="mx-auto size-5 text-muted-foreground/50" />

          <p className="mt-4 text-sm font-medium">{t("emptyTitle")}</p>

          <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
            {t("emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              variant="public"
              actions={
                canSaveDecks ? (
                  <SaveDeckButton
                    deckId={deck.id}
                    initialSaved={deck.isSaved}
                  />
                ) : undefined
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}
