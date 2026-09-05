"use client"

import { useEffect, useRef } from "react"
import { recordStudySessionAction } from "../api/actions"

export function useRecordStudySession(deckId: string, isFinished: boolean) {
  const hasRecordedRef = useRef(false)

  useEffect(() => {
    if (isFinished && !hasRecordedRef.current) {
      hasRecordedRef.current = true
      recordStudySessionAction(deckId).catch(() => {})
    }
  }, [isFinished, deckId])

  return {
    reset: () => {
      hasRecordedRef.current = false
    },
  }
}
