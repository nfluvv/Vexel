"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import type { DeckWithCount, DeckCardVariant } from "../model/types"

interface DeckCardProps {
  deck: DeckWithCount
  variant: DeckCardVariant
  actions?: React.ReactNode
}

const TITLE_MAX_LENGTH = 20

export const DeckCard = ({ deck, variant, actions }: DeckCardProps) => {
  const router = useRouter()
  const t = useTranslations("deckCard")

  const isOwnerView = variant === "owner"

  const statusLabel = {
    DRAFT: t("statusDraft"),
    PRIVATE: t("statusPrivate"),
    PUBLIC: t("statusPublic"),
  }[deck.status]

  const title = deck.title?.trim() || "Untitled Deck"

  const displayTitle =
    title.length > TITLE_MAX_LENGTH
      ? `${title.slice(0, TITLE_MAX_LENGTH).trimEnd()}…`
      : title

  const goToDeck = () => {
    router.push(`/decks/${deck.id}`)
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={goToDeck}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          goToDeck()
        }
      }}
      className="group relative flex h-71.25 cursor-pointer flex-col overflow-hidden rounded-[20px] bg-card p-6 text-card-foreground ring-1 ring-border/60 transition-all duration-300 ease-out ring-inset hover:-translate-y-0.5 hover:bg-muted/20 hover:shadow-lg hover:ring-foreground/15 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-52 rounded-full border border-foreground/[0.035] transition-transform duration-700 ease-out group-hover:scale-110"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 size-36 rounded-full border border-foreground/[0.035] transition-transform duration-700 ease-out group-hover:scale-110"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-9 -right-9 size-20 rounded-full border border-foreground/4.5 transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Actions */}
      {actions && (
        <div
          className="absolute top-5 right-5 z-20 flex items-center gap-1 opacity-100 md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {actions}
        </div>
      )}

      <div className="relative z-10 flex items-center gap-3">
        <span className="font-mono text-[9px] font-medium tracking-[0.18em] text-muted-foreground/60 uppercase">
          {isOwnerView ? statusLabel : "DECK"}
        </span>

        <span className="h-px w-5 bg-border" />
      </div>

      <div className="relative z-10 my-auto max-w-67.5">
        <h3
          className="truncate text-[26px] leading-[1.3] font-semibold tracking-[-0.04em] text-foreground"
          title={title}
        >
          {displayTitle}
        </h3>

        <p className="mt-4 line-clamp-3 max-w-85 text-xs leading-[1.65] text-muted-foreground">
          {deck.description ||
            "No description. Start adding flashcards to this deck to begin studying."}
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-border/40 pt-4">
        <span className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase">
          {deck._count.cards} cards
        </span>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground/60 uppercase">
            {new Date(deck.updatedAt).toLocaleDateString()}
          </span>

          <span
            aria-hidden
            className="flex size-7 scale-75 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
          >
            <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
              <path
                d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </article>
  )
}
