"use client"

import { useState, useCallback } from "react"
import { useRouter } from "@/shared/i18n/navigation"
import type { Card as CardType, Deck } from "@prisma/client"
import { useTranslations } from "next-intl"
import { Container, EmptyDeckState, ProgressBar } from "@/shared/client/ui"
import { useSwipe } from "@/shared/client/hooks/use-swipe"
import { useKeyboardShortcuts } from "@/shared/client/hooks/use-keyboard-shortcuts"
import { FlipCard } from "@/entities/study-card"
import { useRecordStudySession } from "@/entities/study-session/lib/use-record-study-session"
import { useTextToSpeech, SpeakButton } from "@/features/card-speech"
import { StudyResult } from "@/widgets/study-result"

type DeckBrowseViewProps = {
  deck: Deck & { cards: CardType[] }
}

export function DeckBrowseView({ deck }: DeckBrowseViewProps) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const router = useRouter()

  const { speak, isSpeaking } = useTextToSpeech()
  const { reset: resetRecording } = useRecordStudySession(deck.id, isFinished)
  const t = useTranslations("study")

  const card = deck.cards[index]
  const isLastCard = index === deck.cards.length - 1
  const progress =
    deck.cards.length > 0 ? ((index + 1) / deck.cards.length) * 100 : 0

  const goNext = useCallback(() => {
    setIndex((i) => {
      if (i === deck.cards.length - 1) {
        setIsFinished(true)
        return i
      }
      setFlipped(false)
      return i + 1
    })
  }, [deck.cards.length])

  const goPrev = useCallback(() => {
    setFlipped(false)
    setIndex((i) => Math.max(i - 1, 0))
  }, [])

  const toggleFlip = useCallback(() => setFlipped((f) => !f), [])

  const handleRestart = () => {
    setIndex(0)
    setFlipped(false)
    setIsFinished(false)
    resetRecording()
  }

  const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev })

  useKeyboardShortcuts(
    {
      Space: (e) => {
        e.preventDefault()
        toggleFlip()
      },
      Enter: (e) => {
        e.preventDefault()
        toggleFlip()
      },
      ArrowRight: goNext,
      ArrowLeft: goPrev,
      KeyS: () => card && speak(flipped ? card.definition : card.term),
    },
    !isFinished && deck.cards.length > 0
  )

  if (deck.cards.length === 0) {
    return <EmptyDeckState message={t("emptyDeck")} />
  }

  if (isFinished) {
    return (
      <StudyResult
        title={t("browseFinishedTitle")}
        description={t("browseFinishedDescription")}
      >
        <div className="flex flex-wrap items-center gap-3 pt-6">
          <button
            onClick={() => router.push(`/decks/${deck.id}/learn`)}
            className="rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
          >
            {t("goToLearn")}
          </button>

          <button
            onClick={handleRestart}
            className="rounded-full border border-border bg-background px-5 py-2.5 font-medium text-foreground transition-colors hover:bg-muted"
          >
            {t("reviewAgain")}
          </button>

          <button
            onClick={() => router.back()}
            className="rounded-full px-4 py-2.5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {t("goBack")}
          </button>
        </div>
      </StudyResult>
    )
  }

  return (
    <main className="mx-auto max-w-xl py-8">
      <Container>
        <div className="mb-1 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{deck.title}</h1>
            <p className="mb-2 text-sm text-muted-foreground">
              {index + 1} / {deck.cards.length}
            </p>
          </div>
          <SpeakButton
            onSpeak={() => speak(flipped ? card.definition : card.term)}
            isSpeaking={isSpeaking}
          />
        </div>

        <ProgressBar percent={progress} />

        <FlipCard
          front={card.term}
          back={card.definition}
          flipped={flipped}
          onToggle={toggleFlip}
          {...swipeHandlers}
        />

        <p className="mt-2 hidden text-center text-[11px] text-muted-foreground/60 sm:block">
          {t("actionsText")}
        </p>

        <div className="mt-4 flex justify-between">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="rounded-full border border-border/60 px-4 py-2 disabled:opacity-40"
          >
            {t("back")}
          </button>
          <button
            onClick={goNext}
            className="rounded-full border border-border/60 px-4 py-2"
          >
            {isLastCard ? t("finish") : t("next")}
          </button>
        </div>
      </Container>
    </main>
  )
}
