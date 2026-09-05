"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/shared/client/ui"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  currentPage: number
  totalPages: number
}

export function SavedDecksPagination({ currentPage, totalPages }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())

    if (page <= 1) {
      params.delete("savedPage")
    } else {
      params.set("savedPage", String(page))
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div className="mt-6 flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-lg"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Предыдущая страница</span>
      </Button>

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span key={`e-${i}`} className="px-2 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            className="h-9 w-9 rounded-lg text-sm tabular-nums"
            onClick={() => goToPage(page)}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-lg"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Следующая страница</span>
      </Button>
    </div>
  )
}

function getPageNumbers(
  current: number,
  total: number
): (number | "ellipsis")[] {
  const delta = 1
  const range: (number | "ellipsis")[] = [1]
  const start = Math.max(2, current - delta)
  const end = Math.min(total - 1, current + delta)

  if (start > 2) range.push("ellipsis")
  for (let i = start; i <= end; i++) range.push(i)
  if (end < total - 1) range.push("ellipsis")
  if (total > 1) range.push(total)

  return range
}
