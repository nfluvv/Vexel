import { franc } from "franc-min"

const FRANC_TO_BCP47: Record<string, string> = {
  eng: "en-US",
  rus: "ru-RU",
  spa: "es-ES",
  fra: "fr-FR",
  deu: "de-DE",
  ita: "it-IT",
  por: "pt-PT",
  jpn: "ja-JP",
  kor: "ko-KR",
  cmn: "zh-CN",
  arb: "ar-SA",
  hin: "hi-IN",
  nld: "nl-NL",
  pol: "pl-PL",
  tur: "tr-TR",
  ukr: "uk-UA",
  swe: "sv-SE",
  fin: "fi-FI",
  nob: "nb-NO",
  dan: "da-DK",
  ces: "cs-CZ",
  ell: "el-GR",
  heb: "he-IL",
  tha: "th-TH",
  vie: "vi-VN",
  ind: "id-ID",
}

function detectByScript(text: string): string | null {
  if (/[\u0400-\u04FF]/.test(text)) return "ru-RU"
  if (/[\u3040-\u30FF\uFF66-\uFF9F]/.test(text)) return "ja-JP"
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko-KR"
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh-CN"
  if (/[\u0600-\u06FF]/.test(text)) return "ar-SA"
  if (/[\u0590-\u05FF]/.test(text)) return "he-IL"
  if (/[\u0E00-\u0E7F]/.test(text)) return "th-TH"
  return null
}

export function detectSpeechLang(text: string, fallback = "en-US"): string {
  const trimmed = text.trim()
  if (!trimmed) return fallback

  const byScript = detectByScript(trimmed)
  if (byScript) return byScript

  const francCode = franc(trimmed, { minLength: 3 })
  if (francCode !== "und" && FRANC_TO_BCP47[francCode]) {
    return FRANC_TO_BCP47[francCode]
  }

  return fallback
}
