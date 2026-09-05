import { getUserDecks } from "@/entities/deck/api/queries"
import {
  getRecentStudiedDecks,
  getStreak,
} from "@/entities/study-session/api/queries"
import { getPopularDecks } from "@/entities/deck/api/queries"

import { Container } from "@/shared/client/ui"

import { DashboardHeader } from "@/widgets/dashboard-header"
import { RecentStudiedDecks } from "@/widgets/recent-studied-decks"
import { PopularDecks } from "@/widgets/popular-decks"
import { DashboardSidebar } from "@/widgets/dishboard-sidebar/ui/DashboardSidebar"
import { SavedDecks } from "@/widgets/saved-decks"
import { MyDecks } from "@/widgets/my-decks"

interface DashboardProps {
  searchParams: Promise<{
    query?: string
    filter?: string
    savedQuery?: string
    savedPage?: string
  }>
}

export async function DashboardView({ searchParams }: DashboardProps) {
  const {
    query = "",
    savedQuery = "",
    filter = "all",
    savedPage = "1",
  } = await searchParams

  const savedPageNum = Math.max(1, Number(savedPage) || 1)

  const [decks, popularDecks, recentStudied, streak] = await Promise.all([
    getUserDecks(),
    getPopularDecks(),
    getRecentStudiedDecks(),
    getStreak(),
  ])

  const currentDecksCount = decks?.length ?? 0

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Container className="py-8 sm:py-10">
        <DashboardHeader />

        <RecentStudiedDecks items={recentStudied} />

        {decks?.length === 0 && <PopularDecks decks={popularDecks} />}

        <section className="grid grid-cols-12 gap-x-8 gap-y-12">
          <MyDecks
            currentDecksCount={currentDecksCount}
            filter={filter}
            query={query}
            decks={decks ?? []}
          />

          <DashboardSidebar
            streak={streak}
            currentDecksCount={currentDecksCount}
          />
        </section>

        <SavedDecks savedQuery={savedQuery} savedPage={savedPageNum} />
      </Container>
    </main>
  )
}
