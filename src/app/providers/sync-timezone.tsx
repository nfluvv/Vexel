"use client"

import { useEffect } from "react"
import { saveTimezoneAction } from "@/features/save-timezone/api/save-timezone"

export function TimezoneSync() {
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    saveTimezoneAction(timezone).catch(() => {})
  }, [])

  return null
}
