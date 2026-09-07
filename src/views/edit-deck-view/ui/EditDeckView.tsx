"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Layers } from "lucide-react"

import { AddCardForm } from "@/features/create-card"
import { SaveDeckControl } from "@/features/save-deck"
import { Input, Label, Container } from "@/shared/client/ui"
import { DeckCardsList } from "@/widgets/deck-cards-list"
import { MAX_CARDS_PER_DECK } from "@/shared/config/decks"

type CardItem = {
  id: string
  term: string
  definition: string
}

type DeckStatus = "DRAFT" | "PRIVATE" | "PUBLIC"

type DeckEditDashboardProps = {
  initialDeck: {
    id: string
    title: string | null
    description: string | null
    status: DeckStatus
    cards: CardItem[]
  }
}

export function EditDeckView({ initialDeck }: DeckEditDashboardProps) {
  const t = useTranslations("deckCreation")

  const [cards, setCards] = useState<CardItem[]>(initialDeck.cards)
  const [title, setTitle] = useState(initialDeck.title ?? "")
  const [description, setDescription] = useState(initialDeck.description ?? "")
  const [status, setStatus] = useState(initialDeck.status)

  const trimmedTitle = title.trim()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Container className="py-5 sm:py-8">
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
          <header className="border-b border-border/60 px-4 py-4 sm:px-7 sm:py-5">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <div className="flex min-w-0 flex-1 basis-60 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40">
                  <Layers className="size-4 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <p className="font-mono text-[9px] font-medium tracking-[0.16em] text-muted-foreground/60 uppercase">
                    {t("editDeck")}
                  </p>

                  <h1 className="mt-0.5 truncate text-lg font-semibold tracking-tight sm:text-xl">
                    {trimmedTitle || t("title")}
                  </h1>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <div className="hidden text-right min-[640px]:block">
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground/60 uppercase">
                    {t("cardsCountLabel")}
                  </p>

                  <p className="mt-0.5 text-sm font-semibold tabular-nums">
                    {cards.length}
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      / {MAX_CARDS_PER_DECK}
                    </span>
                  </p>
                </div>

                <SaveDeckControl
                  deckId={initialDeck.id}
                  title={trimmedTitle}
                  description={description}
                  cardsCount={cards.length}
                  currentStatus={status}
                  disabled={!trimmedTitle}
                  onSaved={setStatus}
                />
              </div>

              <div className="flex basis-full items-center gap-2 text-xs text-muted-foreground min-[640px]:hidden">
                <span>{t("cardsCountLabel")}</span>

                <span className="font-mono font-medium text-foreground tabular-nums">
                  {cards.length} / {MAX_CARDS_PER_DECK}
                </span>
              </div>
            </div>
          </header>

          <section className="px-5 py-6 sm:px-7 sm:py-8">
            <div className="mb-5">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold">{t("cards")}</h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("cardsDescription")}
                  </p>
                </div>

                <span className="font-mono text-[10px] tracking-widest text-muted-foreground/50 uppercase">
                  {cards.length}
                </span>
              </div>
            </div>

            <DeckCardsList
              deckId={initialDeck.id}
              cards={cards}
              onCardsChange={setCards}
            />

            <div className="mt-6 border-t border-border/60 pt-6">
              <AddCardForm
                deckId={initialDeck.id}
                onCardAdded={(card) => setCards((prev) => [...prev, card])}
              />
            </div>
          </section>

          <section className="border-t border-border/60 px-5 py-6 sm:px-7 sm:py-8">
            <div className="mb-6">
              <h2 className="text-base font-semibold">{t("deckSettings")}</h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {t("deckSettingsDescription")}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deck-title">{t("titleLabel")}</Label>

                <Input
                  id="deck-title"
                  placeholder={t("titlePlaceholder")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deck-description">
                  {t("descriptionLabel")}
                </Label>

                <Input
                  id="deck-description"
                  placeholder={t("descriptionPlaceholder")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>
      </Container>
    </main>
  )
}
