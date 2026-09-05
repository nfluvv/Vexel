"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Pencil } from "lucide-react"

import { Button } from "@/shared/client/ui"

interface EditDeckButtonProps {
  deckId: string
}

export const EditDeckButton = ({ deckId }: EditDeckButtonProps) => {
  const t = useTranslations("deckCard")

  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="h-8 w-8 rounded-full border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
      onClick={(e) => e.stopPropagation()}
    >
      <Link href={`/dashboard/decks/${deckId}/edit`}>
        <Pencil className="h-4 w-4" />
        <span className="sr-only">{t("editAria")}</span>
      </Link>
    </Button>
  )
}
