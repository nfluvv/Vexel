"use client"

import { useTranslations } from "next-intl"

type CardItem = { id: string; term: string; definition: string }

type CardsListProps = {
  cards: CardItem[]
}

export function CardsList({ cards }: CardsListProps) {
  const t = useTranslations("deckCreation")

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

      <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm"
          >
            <span className="font-medium text-foreground">{card.term}</span>
            <span className="text-muted-foreground">{card.definition}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
