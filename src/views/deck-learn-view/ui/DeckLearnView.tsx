"use client"

import { useState, useCallback } from "react"
import type { Card as CardType, Deck } from "@prisma/client"
import { useTranslations } from "next-intl"
import { isCloseEnough } from "@/shared/client/lib/levenshtein"
import { Container, EmptyDeckState, ProgressBar } from "@/shared/client/ui"
import { cn } from "@/shared/client/lib/utils"
import { useRecordStudySession } from "@/entities/study-session/lib/use-record-study-session"
import { useTextToSpeech, SpeakButton } from "@/features/card-speech"
import { StudyResult } from "@/widgets/study-result"

type DeckLearnViewProps = {
  deck: Deck & { cards: CardType[] }
}

type Result = "exact" | "typo" | "wrong" | null

export function DeckLearnView({ deck }: DeckLearnViewProps) {
  const [queue, setQueue] = useState<CardType[]>(() => [...deck.cards])
  const [answer, setAnswer] = useState("")
  const [result, setResult] = useState<Result>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)

  const t = useTranslations("study")
  const { speak, isSpeaking } = useTextToSpeech()

  const current = queue[0]
  const isFinished = deck.cards.length > 0 && queue.length === 0
  const isPending = result === null

  const progress =
    deck.cards.length > 0
      ? Math.min(100, (correctCount / deck.cards.length) * 100)
      : 0

  const { reset: resetRecording } = useRecordStudySession(deck.id, isFinished)

  const handleCheck = useCallback(() => {
    if (!current) return
    const verdict = isCloseEnough(answer, current.definition)
    setResult(verdict)
    setTotalAnswered((n) => n + 1)
    if (verdict !== "wrong") setCorrectCount((n) => n + 1)
  }, [current, answer])

  const handleNext = useCallback(() => {
    if (!current) return
    setQueue((prev) => {
      const [, ...rest] = prev
      return result === "wrong" ? [...rest, current] : rest
    })
    setAnswer("")
    setResult(null)
  }, [current, result])

  const handleRestart = () => {
    setQueue([...deck.cards])
    setAnswer("")
    setResult(null)
    setCorrectCount(0)
    setTotalAnswered(0)
    resetRecording()
  }

  if (deck.cards.length === 0) {
    return <EmptyDeckState message={t("emptyDeck")} />
  }

  if (isFinished) {
    const accuracy =
      totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0

    return (
      <StudyResult
        title={t("finishedTitle")}
        description={t("finishedDescription", {
          correct: correctCount,
          total: totalAnswered,
        })}
        badge={
          <div className="mb-6 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {accuracy}%
          </div>
        }
      >
        <button
          onClick={handleRestart}
          className="rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground"
        >
          {t("restart")}
        </button>
      </StudyResult>
    )
  }

  return (
    <main className="mx-auto max-w-xl py-8">
      <Container>
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{deck.title}</h1>
            <p className="text-sm text-muted-foreground">
              {t("cardsLeft", { count: queue.length })}
            </p>
          </div>
          <SpeakButton
            onSpeak={() => speak(current.term)}
            isSpeaking={isSpeaking}
          />
        </div>

        <ProgressBar percent={progress} />

        <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-6">
          <p className="text-center text-lg font-medium">{current.term}</p>

          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                isPending ? handleCheck() : handleNext()
              }
            }}
            disabled={!isPending}
            placeholder={t("answerPlaceholder")}
            autoFocus
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm disabled:opacity-70"
          />

          {result && (
            <div
              className={cn("rounded-lg border px-3 py-2 text-sm", {
                "border-primary/20 bg-primary/10 text-primary":
                  result === "exact",
                "border-amber-500/20 bg-amber-500/10 text-amber-600":
                  result === "typo",
                "border-destructive/20 bg-destructive/10 text-destructive":
                  result === "wrong",
              })}
            >
              {result === "exact" && t("correct")}
              {result === "typo" &&
                t("typoCorrect", { answer: current.definition })}
              {result === "wrong" &&
                t("incorrect", { answer: current.definition })}
            </div>
          )}

          <button
            onClick={isPending ? handleCheck : handleNext}
            disabled={isPending && !answer.trim()}
            className={cn(
              "w-full rounded-full py-2.5 font-medium transition-all",
              {
                "bg-primary text-primary-foreground disabled:opacity-40":
                  isPending,
                "border border-border/60": !isPending,
              }
            )}
          >
            {isPending ? t("check") : t("next")}
          </button>
        </div>
      </Container>
    </main>
  )
}
