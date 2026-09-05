"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input, Button } from "@/shared/client/ui"
import { Search, X } from "lucide-react"
import { useTranslations } from "next-intl"

export function SavedDecksSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get("savedQuery") ?? "")
  const timer = useRef<NodeJS.Timeout | null>(null)

  const t = useTranslations("dashboard")

  const searchParamsRef = useRef(searchParams)

  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  const isFirstRun = useRef(true)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    if (timer.current) clearTimeout(timer.current)

    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString())
      const value = search.trim()
      const currentQuery = searchParamsRef.current.get("savedQuery") ?? ""

      if (value === currentQuery) return

      if (value) {
        params.set("savedQuery", value)
      } else {
        params.delete("savedQuery")
      }

      params.delete("savedPage")

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    }, 400)

    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [search, pathname, router])

  const clearSearch = () => {
    if (timer.current) clearTimeout(timer.current)
    setSearch("")

    const params = new URLSearchParams(searchParamsRef.current.toString())
    params.delete("savedQuery")
    params.delete("savedPage")

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />

      <Input
        placeholder={t("saved.placeholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-10 w-full rounded-xl border-border/50 bg-muted/30 pr-10 pl-10 shadow-none transition-colors placeholder:text-muted-foreground/50 hover:bg-muted/50 focus-visible:border-primary/30 focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-primary/10"
      />

      {search && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clearSearch}
          className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
