import { getTranslations } from "next-intl/server"
import { DECKS_LIMIT } from "@/shared/config/decks"

interface DashboardSidebarProps {
  streak: number
  currentDecksCount: number
}

export const DashboardSidebar = async ({
  streak,
  currentDecksCount,
}: DashboardSidebarProps) => {
  const t = await getTranslations("dashboard")

  return (
    <aside className="col-span-12 self-start lg:col-span-3">
      <div className="lg:border-l lg:border-border/60 lg:pl-7">
        <div className="flex items-center justify-between lg:block">
          <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
            {t("streak")}
          </p>

          <div className="flex items-baseline gap-2 lg:mt-3">
            <span className="text-3xl font-semibold tracking-tight">
              {streak}
            </span>

            <span className="text-sm text-muted-foreground">{t("days")}</span>

            {streak > 0 && (
              <span className="ml-1 text-base" aria-hidden>
                🔥
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground transition-all"
            style={{
              width: `${Math.min(
                (currentDecksCount / DECKS_LIMIT) * 100,
                100
              )}%`,
            }}
          />
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {currentDecksCount} of {DECKS_LIMIT} decks
        </p>
      </div>
    </aside>
  )
}
