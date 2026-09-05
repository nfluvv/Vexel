"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Pencil } from "lucide-react"

import { Button } from "@/shared/client/ui"
import { EditCardForm } from "@/features/edit-card"
import { DeleteCardButton } from "@/features/delete-card"
import type { CardItem } from "@/entities/card"

type DeckCardsListProps = {
  deckId: string
  cards: CardItem[]
  onCardsChange: (cards: CardItem[]) => void
}

export function DeckCardsList({
  deckId,
  cards,
  onCardsChange,
}: DeckCardsListProps) {
  const t = useTranslations("deckCreation")
  const [editingId, setEditingId] = useState<string | null>(null)

  if (cards.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
        {t("emptyCards")}
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
        {t("cardsHeading")} ({cards.length})
      </h3>

      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-3 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm"
          >
            {editingId === card.id ? (
              <EditCardForm
                card={card}
                deckId={deckId}
                onCancel={() => setEditingId(null)}
                onSaved={(updated) => {
                  onCardsChange(
                    cards.map((c) => (c.id === updated.id ? updated : c))
                  )
                  setEditingId(null)
                }}
              />
            ) : (
              <>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <span className="truncate font-medium text-foreground">
                    {card.term}
                  </span>
                  <span className="truncate text-muted-foreground">
                    {card.definition}
                  </span>
                </div>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingId(card.id)}
                  className="size-7 shrink-0 text-muted-foreground hover:text-primary"
                >
                  <Pencil className="size-3.5" />
                </Button>
                <DeleteCardButton
                  cardId={card.id}
                  deckId={deckId}
                  isLastCard={cards.length <= 1}
                  onDeleted={(deletedId) =>
                    onCardsChange(cards.filter((c) => c.id !== deletedId))
                  }
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
