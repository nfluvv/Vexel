"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Copy } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { WALLET_ADDRESS } from "@/shared/client/config/site"
import { useTranslations } from "next-intl"

export function DonateView() {
  const [copied, setCopied] = useState(false)

  const t = useTranslations("donate")
  const tc = useTranslations("common")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to copy address:", error)
    }
  }

  return (
    <main className="relative overflow-hidden bg-background text-foreground antialiased">
      <div className="relative mx-auto flex w-full max-w-5xl flex-col px-4 sm:px-6">
        <header className="py-5 sm:py-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />

            <span>{tc("back")}</span>
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-10 sm:py-16">
          <section className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mb-3 font-mono text-[9px] font-medium tracking-[0.18em] text-muted-foreground/60">
                {t("subtitle")}
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                {t("title")}
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {t("description")}
              </p>
            </div>

            {/* Donation card */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
              {/* QR */}
              <div className="flex justify-center">
                <div className="rounded-xl border border-border/60 bg-white p-3 shadow-sm">
                  <QRCodeSVG
                    value={WALLET_ADDRESS}
                    size={168}
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>

              {/* Network */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between gap-3 px-1">
                  <span className="font-mono text-[9px] font-medium tracking-[0.14em] text-muted-foreground/60">
                    {t("crypto")}
                  </span>

                  <span className="text-xs font-medium text-foreground">
                    TON / USDT
                  </span>
                </div>

                {/* Address */}
                <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border/70 bg-background p-1.5">
                  <input
                    type="text"
                    readOnly
                    value={WALLET_ADDRESS}
                    aria-label="Wallet address"
                    className="min-w-0 flex-1 bg-transparent px-2.5 py-2 font-mono text-[11px] text-muted-foreground outline-none selection:bg-muted"
                  />

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95"
                    title="Copy address"
                    aria-label="Copy wallet address"
                  >
                    {copied ? (
                      <Check className="size-4 text-foreground" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                </div>

                {/* Status */}
                <div className="mt-2 min-h-4 px-1">
                  {copied && (
                    <p className="text-xs text-muted-foreground">
                      Address copied.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground/60">
              {t("subdescription")}
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
