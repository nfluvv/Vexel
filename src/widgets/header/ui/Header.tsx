import { Link } from "@/shared/i18n/navigation"

import { getCurrentUser } from "@/entities/user/api/queries"
import { ThemeToggle } from "@/features/toggle-theme"
import { LanguageSwitcher } from "@/features/switch-locale"
import { siteConfig } from "@/shared/client/config/site"
import { buttonVariants, Container } from "@/shared/client/ui"
import { getTranslations } from "next-intl/server"
import { UserMenu } from "./UserMenu"
import { SearchDecksInput, MobileSearchTrigger } from "@/features/search-decks"

export async function Header() {
  const user = await getCurrentUser()
  const t = await getTranslations("Auth")

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <Container className="relative flex h-14 items-center gap-2 sm:h-16">
        <Link
          href={siteConfig.routes.home}
          className="font-display shrink-0 text-base font-semibold sm:text-lg"
        >
          🪐 {siteConfig.name}
        </Link>

        {user && (
          <div className="hidden flex-1 px-4 md:flex">
            <SearchDecksInput className="mx-auto max-w-xl" />
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          {
            user && <MobileSearchTrigger />
          }
          <ThemeToggle />
          <LanguageSwitcher />

          <div className="mx-1 h-5 w-px bg-border sm:mx-2" />

          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href={siteConfig.routes.login}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                {t("login")}
              </Link>

              <Link
                href={siteConfig.routes.register}
                className={buttonVariants({ size: "sm" })}
              >
                {t("register")}
              </Link>
            </div>
          )}
        </div>
      </Container>
    </header>
  )
}
