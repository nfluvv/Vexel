import { NextResponse } from "next/server"
import createIntlMiddleware from "next-intl/middleware"

import { auth } from "@/auth"
import { checkAuthorization } from "@/auth.config"
import { routing } from "@/shared/i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

const LOCALE_PATTERN = new RegExp(`^/(${routing.locales.join("|")})(/.*)?$`)

const GUEST_ONLY_PATHS = ["/", "/login", "/register"]

function getLocale(pathname: string) {
  const match = pathname.match(LOCALE_PATTERN)

  return match?.[1] ?? routing.defaultLocale
}

function stripLocale(pathname: string) {
  const match = pathname.match(LOCALE_PATTERN)

  return match ? match[2] || "/" : pathname
}

export default auth((req) => {
  const { pathname, origin } = req.nextUrl

  const intlResponse = intlMiddleware(req)

  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse
  }

  const locale = getLocale(pathname)
  const normalizedPathname = stripLocale(pathname)
  const isLoggedIn = !!req.auth?.user

  if (isLoggedIn && GUEST_ONLY_PATHS.includes(normalizedPathname)) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, origin))
  }

  const result = checkAuthorization({
    isLoggedIn,
    role: req.auth?.user?.role,
    pathname: normalizedPathname,
    baseUrl: `${origin}/${locale}`,
  })

  if (result !== true) {
    return result
  }

  return intlResponse
})

export const config = {
  matcher: ["/", "/((?!api|_next|.*\\..*).*)"],
}
