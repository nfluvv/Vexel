"use client"

import type { PropsWithChildren } from "react"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import { TimezoneSync } from "./sync-timezone"

import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <SessionProvider refetchOnWindowFocus={false}>
        <QueryProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              className: "toast",
              duration: 3000,
            }}
          />
          <TimezoneSync />
        </QueryProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
