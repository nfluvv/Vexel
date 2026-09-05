"use client"

import { useCallback, useEffect, useState } from "react"
import { detectSpeechLang } from "./detect-speech-lang"

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return

    const updateVoices = () => setVoices(window.speechSynthesis.getVoices())
    updateVoices()
    window.speechSynthesis.onvoiceschanged = updateVoices

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis || !text)
        return
      window.speechSynthesis.cancel()

      const targetLang = detectSpeechLang(text)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = targetLang

      const systemVoice =
        voices.find(
          (v) => v.lang.startsWith(targetLang) && v.name.includes("Google")
        ) ||
        voices.find(
          (v) => v.lang.startsWith(targetLang) && v.name.includes("Microsoft")
        ) ||
        voices.find((v) =>
          v.lang.toLowerCase().startsWith(targetLang.split("-")[0])
        )

      if (systemVoice) utterance.voice = systemVoice
      utterance.rate = 0.9

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    },
    [voices]
  )

  return { speak, isSpeaking }
}
