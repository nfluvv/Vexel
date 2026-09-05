"use client"
import { useInfiniteQuery } from "@tanstack/react-query"

type CardItem = {
  id: string
  term: string
  definition: string
  createdAt: string
}
type CardsPage = {
  items: CardItem[]
  nextCursor: { id: string; createdAt: string } | null
}

export function useDeckCards(deckId: string, initialPage: CardsPage) {
  return useInfiniteQuery({
    queryKey: ["deck-cards", deckId],
    initialPageParam: null as { id: string; createdAt: string } | null,
    queryFn: async ({ pageParam }) => {
      const url = new URL(`/api/decks/${deckId}/cards`, window.location.origin)
      if (pageParam) {
        url.searchParams.set("cursorId", pageParam.id)
        url.searchParams.set("cursorCreatedAt", pageParam.createdAt)
      }
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to load cards")
      return res.json() as Promise<CardsPage>
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: {
      pages: [initialPage],
      pageParams: [null],
    },
  })
}
