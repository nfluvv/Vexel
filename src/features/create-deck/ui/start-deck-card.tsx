"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Loader2, Plus } from "lucide-react"
import toast from "react-hot-toast"

import { createDraftDeckAction } from "../api/create-draft-deck"

export function StartDeckCard() {
  const t = useTranslations("deckCreation")
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStart = async () => {
    if (loading) return

    setLoading(true)

    try {
      const deck = await createDraftDeckAction()
      router.push(`/dashboard/decks/${deck.id}/edit`)
    } catch (e) {
      const message = e instanceof Error ? e.message : ""

      toast.error(
        message === "DECKS_LIMIT_REACHED"
          ? t("errors.decksLimitReached")
          : t("errors.unauthorized")
      )

      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleStart}
      disabled={loading}
      className="group relative flex h-71.25 w-full cursor-pointer flex-col overflow-hidden rounded-[20px] border border-dashed border-border bg-card p-6 text-left text-card-foreground transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:border-foreground/25 hover:bg-muted/30 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:outline-none disabled:cursor-wait"
    >
      {/* Decorative rings */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 -right-28 size-72 rounded-full border border-foreground/[0.035]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full border border-foreground/[0.035]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full border border-foreground/4.5"
      />

      {/* Top */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-[9px] font-medium tracking-[0.18em] text-muted-foreground/60 uppercase">
          NEW DECK
        </span>

        <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 ease-out group-hover:scale-105">
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-4" strokeWidth={1.5} />
          )}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-auto">
        <div
          aria-hidden
          className="mb-5 text-[72px] leading-[0.7] font-light tracking-[-0.08em] text-foreground/6"
        >
          +
        </div>

        <h2 className="text-xl font-semibold tracking-tight">
          {loading ? t("starting") : t("startTitle")}
        </h2>

        <p className="mt-2 max-w-70 text-xs leading-relaxed text-muted-foreground">
          {t("startDescription")}
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-5 flex items-center">
        <span className="text-xs font-medium">
          {loading ? t("starting") : t("startButton")}
        </span>

        {!loading && (
          <span
            aria-hidden
            className="ml-2 text-muted-foreground/50 transition-transform duration-300 ease-out group-hover:translate-x-1"
          >
            →
          </span>
        )}
      </div>
    </button>
  )
}
