"use client"

import { useState } from "react"
import { useRouter } from "@/shared/i18n/navigation"
import type { Card as CardType, Deck } from "@prisma/client"
import { useTranslations } from "next-intl"
import { Container } from "@/shared/client/ui"
import { FlipCard } from "@/entities/study-card"
import { reviewCardAction } from "@/entities/card-progress/api/actions"
import type { Quality } from "@/entities/card-progress/lib/sm2"
import { useTextToSpeech, SpeakButton } from "@/features/card-speech"
import { useRecordStudySession } from "@/entities/study-session/lib/use-record-study-session"

type DeckReviewViewProps = {
  deck: Deck
  dueCards: CardType[]
}

const QUALITY_BUTTONS: {
  quality: Quality
  labelKey: string
}[] = [
  { quality: 0, labelKey: "again" },
  { quality: 1, labelKey: "hard" },
  { quality: 2, labelKey: "good" },
  { quality: 3, labelKey: "easy" },
]

export function DeckReviewView({ deck, dueCards }: DeckReviewViewProps) {
  const [queue, setQueue] = useState(dueCards)
  const [flipped, setFlipped] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const t = useTranslations("study")
  const router = useRouter()
  const { speak, isSpeaking } = useTextToSpeech()

  const current = queue[0]
  useRecordStudySession(deck.id, queue.length === 0 && dueCards.length > 0)

  const handleGrade = async (quality: Quality) => {
    if (!current || isPending) return
    setIsPending(true)

    try {
      await reviewCardAction(current.id, quality)

      const remaining = queue.slice(1)
      if (remaining.length === 0) {
        router.replace(`/decks/${deck.id}`)
        return
      }

      setQueue(remaining)
      setFlipped(false)
      setIsPending(false)
    } catch (error) {
      setIsPending(false)
      throw error
    }
  }

  return (
    <main className="mx-auto max-w-xl py-8">
      <Container>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{deck.title}</h1>
            <p className="text-sm text-muted-foreground">
              {t("dueCount", { count: queue.length })}
            </p>
          </div>
          <SpeakButton
            onSpeak={() => speak(flipped ? current.definition : current.term)}
            isSpeaking={isSpeaking}
          />
        </div>

        <FlipCard
          front={current.term}
          back={current.definition}
          flipped={flipped}
          onToggle={() => setFlipped((f) => !f)}
        />

        {!flipped ? (
          <button
            onClick={() => setFlipped(true)}
            className="mt-4 w-full rounded-full bg-primary py-2.5 font-medium text-primary-foreground"
          >
            {t("showAnswer")}
          </button>
        ) : (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {QUALITY_BUTTONS.map(({ quality, labelKey }) => (
              <button
                key={quality}
                onClick={() => handleGrade(quality)}
                disabled={isPending}
                className={
                  "cursor-pointer rounded-full border border-border/70 bg-muted/40 py-2.5 text-sm font-medium text-foreground hover:border-foreground/20 hover:bg-muted disabled:opacity-40"
                }
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}
