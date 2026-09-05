import { getTranslations } from "next-intl/server"
import type { RecentStudiedDeck } from "@/entities/study-session"

interface Props {
  items: RecentStudiedDeck[]
}

export const RecentStudiedDecks = async ({ items }: Props) => {
  const t = await getTranslations("dashboard")

  if (items.length < 1) return null

  return (
    <section className="mb-14">
      <div className="mb-4">
        <h2 className="text-base font-semibold">{t("reviewAgain")}</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("recentlyStudied")}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        {items.map(({ deck, lastStudiedAt }, index) => (
          <a
            key={`recent-${deck.id}`}
            href={`/decks/${deck.id}`}
            className="group flex items-center gap-4 border-border px-4 py-3.5 text-card-foreground transition-colors not-last:border-b hover:bg-muted/50 sm:px-5"
          >
            <span className="w-5 shrink-0 text-center text-xs text-muted-foreground/50 tabular-nums">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-medium">{deck.title}</h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("studied")} {new Date(lastStudiedAt).toLocaleDateString()}
              </p>
            </div>

            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
            >
              <path
                d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ))}
      </div>
    </section>
  )
}
