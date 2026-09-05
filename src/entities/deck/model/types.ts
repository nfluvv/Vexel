import type { Deck } from "@prisma/client"

export type DeckWithCount = Deck & {
  _count: {
    cards: number
  }
}

export type PublicDeckWithSaveState = DeckWithCount & {
  isSaved: boolean
}

export type DeckCardVariant = "owner" | "public"
