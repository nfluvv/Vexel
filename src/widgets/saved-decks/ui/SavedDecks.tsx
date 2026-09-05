import { SavedDecksGrid } from "./SavedDecksGrid"
import { SavedDecksSearch } from "./SavedDecksSearch"
import { getTranslations } from "next-intl/server"

interface SavedDecksProps {
  savedQuery?: string
  savedPage?: number
}

export const SavedDecks = async ({
  savedQuery,
  savedPage,
}: SavedDecksProps) => {
  const t = await getTranslations("dashboard")

  return (
    <section className="mt-16 pb-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {t("saved.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("saved.desc")}
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <SavedDecksSearch />
        </div>
      </div>

      <SavedDecksGrid savedQuery={savedQuery} savedPage={savedPage} />
    </section>
  )
}
