"use server"

import { searchPublicDecks } from "@/entities/deck/api/queries"

export async function searchPublicDecksAction(query: string) {
  return searchPublicDecks(query)
}
