"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"

import { Button } from "@/shared/client/ui"
import { SearchDecksInput } from "./search-decks-input"

export function MobileSearchTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((o) => !o)}
        className="size-8 rounded-full"
      >
        {open ? <X className="size-4" /> : <Search className="size-4" />}
      </Button>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-border bg-background/95 p-3 backdrop-blur-sm">
          <SearchDecksInput
            className="max-w-none"
            autoFocus
            onNavigate={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
