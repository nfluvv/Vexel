"use client"

import { useRef } from "react"

type UseSwipeOptions = {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  threshold?: number
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 60,
}: UseSwipeOptions) {
  const touchStartX = useRef<number | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current

    if (Math.abs(deltaX) > threshold) {
      if (deltaX < 0) onSwipeLeft()
      else onSwipeRight()
    }
    touchStartX.current = null
  }

  return { onTouchStart, onTouchEnd }
}
