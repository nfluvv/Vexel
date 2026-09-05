"use client"

import { cn } from "@/shared/client/lib/utils"

type SpeakButtonProps = {
  onSpeak: () => void
  isSpeaking: boolean
  className?: string
}

export function SpeakButton({
  onSpeak,
  isSpeaking,
  className,
}: SpeakButtonProps) {
  return (
    <button
      type="button"
      onClick={onSpeak}
      className={cn(
        "rounded-full border border-border/60 p-2 transition-colors hover:bg-muted",
        isSpeaking
          ? "animate-pulse border-primary text-primary"
          : "text-muted-foreground",
        className
      )}
    >
      🔊
    </button>
  )
}
