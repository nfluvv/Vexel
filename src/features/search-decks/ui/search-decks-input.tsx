"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useClickAway, useDebounce } from "react-use"
import { Search, Layers } from "lucide-react"

import { cn } from "@/shared/client/lib/utils"
import { searchPublicDecksAction } from "../api/search-decks"
import type { DeckWithCount } from "@/entities/deck"

import { useTranslations } from "next-intl"

interface Props {
  className?: string
  autoFocus?: boolean
  onNavigate?: () => void
}

export const SearchDecksInput: React.FC<Props> = ({
  className,
  autoFocus,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [focused, setFocused] = React.useState(false)
  const [decks, setDecks] = React.useState<DeckWithCount[]>([])
  const ref = React.useRef(null)
  const router = useRouter()

  const t = useTranslations("header")

  useClickAway(ref, () => {
    setFocused(false)
  })

  useDebounce(
    async () => {
      if (!searchQuery.trim()) {
        setDecks([])
        return
      }
      try {
        const response = await searchPublicDecksAction(searchQuery)
        setDecks(response)
      } catch (error) {
        console.log(error)
      }
    },
    300,
    [searchQuery]
  )

  const onClickItem = (deckId: string) => {
    setFocused(false)
    setSearchQuery("")
    setDecks([])
    onNavigate?.()
    router.push(`/decks/${deckId}`)
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative z-30 flex h-11 w-full max-w-lg justify-between rounded-full",
        className
      )}
    >
      <Search className="absolute top-1/2 left-3 h-4 -translate-y-1/2 text-muted-foreground" />
      <input
        className="w-full rounded-full border border-border/60 bg-background pr-4 pl-10 text-sm outline-none placeholder:text-muted-foreground"
        type="text"
        placeholder={t("searchPlaceholder")}
        onFocus={() => setFocused(true)}
        value={searchQuery}
        autoFocus={autoFocus}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {decks.length > 0 && (
        <div
          className={cn(
            "invisible absolute top-14 z-30 w-full overflow-hidden rounded-2xl border border-border/60 bg-popover/95 p-1.5 opacity-0 shadow-xl shadow-black/5 backdrop-blur-md transition-all duration-200",
            focused && "visible top-12 opacity-100"
          )}
        >
          {decks.map((deck, index) => (
            <button
              key={deck.id}
              onClick={() => onClickItem(deck.id)}
              className={cn(
                "group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                "hover:bg-muted/70",
                index !== decks.length - 1 && "mb-0.5"
              )}
            >
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl",
                  "border border-border/60 bg-muted/40",
                  "transition-colors group-hover:border-primary/20 group-hover:bg-primary/10"
                )}
              >
                <Layers className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {deck.title}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("deckType")}
                </p>
              </div>

              <span
                className={cn(
                  "shrink-0 rounded-full border border-border/60 bg-muted/50",
                  "px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
                  "transition-colors group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary"
                )}
              >
                {deck._count.cards} {t("cards")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
