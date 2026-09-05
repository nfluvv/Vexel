"use client"

import { useState, useTransition } from "react"
import { useRouter } from "@/shared/i18n/navigation"
import { Bookmark } from "lucide-react"
import {
  saveDeckAction,
  unsaveDeckAction,
} from "@/entities/saved-deck/api/actions"

type SaveDeckButtonProps = {
  deckId: string
  initialSaved: boolean
}

export function SaveDeckButton({ deckId, initialSaved }: SaveDeckButtonProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [prevInitialSaved, setPrevInitialSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (initialSaved !== prevInitialSaved) {
    setPrevInitialSaved(initialSaved)
    setSaved(initialSaved)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !saved
    setSaved(next)

    startTransition(async () => {
      try {
        if (next) await saveDeckAction(deckId)
        else await unsaveDeckAction(deckId)
        router.refresh()
      } catch {
        setSaved(!next)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="cursor-pointer rounded-full border border-border/60 p-2 transition-colors hover:bg-muted disabled:opacity-50"
    >
      {saved ? (
        <Bookmark className="size-4 text-primary" fill="currentColor" />
      ) : (
        <Bookmark className="size-4 text-muted-foreground" />
      )}
    </button>
  )
}
