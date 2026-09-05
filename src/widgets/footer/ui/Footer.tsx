import { getTranslations } from "next-intl/server"
import { siteConfig } from "@/shared/client/config/site"
import { Container } from "@/shared/client/ui"
import Link from "next/link"

export async function Footer() {
  const t = await getTranslations("Footer")

  return (
    <footer className="w-full border-t border-border/40 bg-background py-6">
      <Container className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <p className="tracking-tight">
          &copy; {siteConfig.currentYear} {siteConfig.name}. {t("rights")}
        </p>
        <div className="flex items-center gap-3 [&_a:not(:last-child)]:border-r [&_a:not(:last-child)]:border-border/40 [&_a:not(:last-child)]:pr-3">
          <Link 
            href="/donate" 
            className="transition-colors hover:text-foreground"
          >
            Donate
          </Link>

          <a
            href={siteConfig.links.repository}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Repository
          </a>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            My GitHub
          </a>
        </div>
      </Container>
    </footer>
  )
}
