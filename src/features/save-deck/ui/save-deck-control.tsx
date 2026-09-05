"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { Lock, Globe, Save, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

import { Button } from "@/shared/client/ui"
import { saveDeckAction } from "../api/save-deck"

type DeckStatus = "DRAFT" | "PRIVATE" | "PUBLIC"
type TargetStatus = "PRIVATE" | "PUBLIC"

type SaveDeckControlProps = {
  deckId: string
  title: string
  description?: string
  cardsCount: number
  currentStatus: DeckStatus
  disabled?: boolean
  onSaved: (status: TargetStatus) => void
}

export function SaveDeckControl({
  deckId,
  title,
  description,
  cardsCount,
  currentStatus,
  disabled,
  onSaved,
}: SaveDeckControlProps) {
  const t = useTranslations("deckCreation")
  const [isPending, startTransition] = useTransition()
  const [target, setTarget] = useState<TargetStatus>(
    currentStatus === "PUBLIC" ? "PUBLIC" : "PRIVATE"
  )

  const canPublish = cardsCount > 0

  const handleSave = () => {
    startTransition(async () => {
      try {
        const deck = await saveDeckAction({
          deckId,
          title,
          description,
          status: target,
        })
        toast.success(
          target === "PUBLIC" ? t("publishSuccess") : t("saveSuccess")
        )
        onSaved(deck.status as TargetStatus)
      } catch {
        toast.error(t("errors.saveFailed"))
      }
    })
  }
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <div
        role="radiogroup"
        className="flex shrink-0 rounded-full border border-border/60 bg-muted/40 p-0.5"
      >
        <button
          type="button"
          role="radio"
          aria-checked={target === "PRIVATE"}
          disabled={isPending}
          onClick={() => setTarget("PRIVATE")}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
            target === "PRIVATE"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground"
          } disabled:opacity-40`}
        >
          <Lock className="size-3.5 shrink-0" />

          <span className="hidden sm:inline">{t("statusPrivate")}</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={target === "PUBLIC"}
          disabled={isPending || !canPublish}
          onClick={() => setTarget("PUBLIC")}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
            target === "PUBLIC"
              ? "bg-background text-primary shadow-xs"
              : "text-muted-foreground"
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <Globe className="size-3.5 shrink-0" />

          <span className="hidden sm:inline">{t("statusPublic")}</span>
        </button>
      </div>

      <Button
        type="button"
        disabled={isPending || disabled}
        onClick={handleSave}
        className="shrink-0 rounded-full font-semibold"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>{t("saving")}</span>
          </>
        ) : (
          <>
            <Save className="size-4" />
            <span>{t("saveButton")}</span>
          </>
        )}
      </Button>
    </div>
  )
}
