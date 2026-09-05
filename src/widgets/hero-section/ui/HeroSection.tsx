import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { siteConfig } from "@/shared/client/config/site"
import { buttonVariants } from "@/shared/client/ui"
import { auth } from "@/auth"

export async function HeroSection() {
  const session = await auth()
  const isUserLoggedIn = Boolean(session?.user)
  const t = await getTranslations("Home")

  return (
    <div className="flex flex-col items-center justify-center gap-6 pt-44 pb-32 text-center">
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        {siteConfig.name} — {t("title")}
      </h1>
      <p className="max-w-md text-muted-foreground">{t("description")}</p>
      <div className="flex gap-3">
        {!isUserLoggedIn && (
          <>
            <Link
              href={siteConfig.routes.register}
              className={buttonVariants({ variant: "default" })}
            >
              {t("register")}
            </Link>
            <Link
              href={siteConfig.routes.login}
              className={buttonVariants({ variant: "outline" })}
            >
              {t("login")}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
