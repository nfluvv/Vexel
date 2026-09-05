import Link from "next/link"
import { BackButton } from "@/shared/client/ui"
import { SaveDeckButton } from "@/features/save-deck-to-library"
import { getTranslations } from "next-intl/server"
import type { PublicDeckWithSaveState } from "@/entities/deck/model/types"
import { auth } from "@/auth"

interface DeckLandingProps {
  dueCount: number
  cardCount: number
  deck: PublicDeckWithSaveState
}

export const DeckLanding = async ({
  dueCount,
  cardCount,
  deck,
}: DeckLandingProps) => {
  const session = await auth()
  const isOwner = deck.userId === session?.user?.id

  const t = await getTranslations("study")

  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex items-center justify-between">
          <BackButton label={t("back")} />

          {!isOwner && session?.user?.id && (
            <SaveDeckButton deckId={deck.id} initialSaved={deck.isSaved} />
          )}
        </div>

        <section className="pt-10 pb-10 sm:pt-14 sm:pb-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl min-w-0">
              <div className="mb-5 flex items-center gap-3">
                <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-muted-foreground/60 uppercase">
                  {cardCount} {t("cards")}
                </span>

                <span className="h-px w-6 bg-border" />
              </div>

              <h1 className="text-4xl font-semibold tracking-[-0.045em] wrap-break-word sm:text-5xl lg:text-[54px] lg:leading-[1.05]">
                {deck.title}
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
                {t("deckDescription")}
              </p>
            </div>

            <div className="hidden shrink-0 text-right sm:block">
              <div className="font-mono text-4xl font-medium tracking-[-0.06em]">
                {String(cardCount).padStart(2, "0")}
              </div>

              <div className="mt-1 text-[10px] font-medium tracking-[0.14em] text-muted-foreground/50 uppercase">
                {t("cards")}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 py-7 sm:py-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-3">
                <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-muted-foreground/60 uppercase">
                  {t("review")}
                </span>

                {dueCount > 0 && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

                    <span className="font-mono text-[10px] font-medium tracking-[0.12em] text-foreground/70 uppercase">
                      {dueCount} {t("due")}
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {dueCount > 0 ? t("reviewDueTitle") : t("allReviewed")}
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                {dueCount > 0
                  ? t("reviewDueDescription")
                  : t("allReviewedDescription")}
              </p>
            </div>

            <div className="shrink-0 lg:w-64">
              {dueCount > 0 ? (
                <Link
                  href={`/decks/${deck.id}/review`}
                  className="group flex h-12 w-full items-center justify-between rounded-[14px] bg-primary px-4 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
                >
                  <span>{t("reviewDue", { count: dueCount })}</span>

                  <span className="text-lg transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              ) : (
                <div className="flex h-12 items-center gap-3 rounded-[14px] border border-border/60 px-4 text-sm text-muted-foreground">
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs">
                    ✓
                  </span>

                  {t("allReviewed")}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 border-b border-border/60">
          <div className="border-r border-border/60 py-7 pr-5 sm:py-8">
            <p className="font-mono text-[9px] font-medium tracking-[0.16em] text-muted-foreground/50 uppercase">
              {t("deckSize")}
            </p>

            <div className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              {cardCount}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {t("cardsInDeck")}
            </p>
          </div>

          <div className="py-7 pl-5 sm:py-8">
            <p className="font-mono text-[9px] font-medium tracking-[0.16em] text-muted-foreground/50 uppercase">
              {t("progress")}
            </p>

            <div className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              {dueCount > 0 ? dueCount : "✓"}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {dueCount > 0 ? t("cardsToReview") : t("nothingToReview")}
            </p>
          </div>
        </section>

        <section className="pt-12 sm:pt-14">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight">
              {t("studyModes")}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t("studyModesDescription")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Browse */}
            <Link
              href={`/decks/${deck.id}/browse`}
              className="group relative flex min-h-64 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lg"
            >
              <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full border border-foreground/[0.035]" />
              <div className="pointer-events-none absolute -top-9 -right-9 size-20 rounded-full border border-foreground/4.5" />

              <div className="relative z-10 flex items-start justify-between">
                <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-muted-foreground/50 uppercase">
                  01
                </span>

                <span className="flex size-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
                  →
                </span>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-2xl font-semibold tracking-tight">
                  {t("browse")}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  {t("browseDesc")}
                </p>
              </div>
            </Link>

            {/* Learn */}
            <Link
              href={`/decks/${deck.id}/learn`}
              className="group relative flex min-h-64 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lg"
            >
              <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full border border-foreground/[0.035]" />
              <div className="pointer-events-none absolute -top-9 -right-9 size-20 rounded-full border border-foreground/4.5" />

              <div className="relative z-10 flex items-start justify-between">
                <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-muted-foreground/50 uppercase">
                  02
                </span>

                <span className="flex size-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
                  →
                </span>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-2xl font-semibold tracking-tight">
                  {t("learn")}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  {t("learnDesc")}
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
