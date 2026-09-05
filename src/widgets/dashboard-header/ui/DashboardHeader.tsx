import { getTranslations } from "next-intl/server"

export const DashboardHeader = async () => {
  const t = await getTranslations("dashboard")

  return (
    <header className="mb-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("title")}
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">{t("manageDecks")}</p>
    </header>
  )
}
