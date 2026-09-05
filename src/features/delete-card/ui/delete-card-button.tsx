"use client"

import { useTransition } from "react"
import { useTranslations } from "next-intl"
import { Trash2, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/shared/client/ui"
import { DeleteCardAction } from "../api/delete-card"

type DeleteCardButtonProps = {
  cardId: string
  deckId: string
  isLastCard: boolean
  onDeleted: (cardId: string) => void
}

export function DeleteCardButton({
  cardId,
  deckId,
  isLastCard,
  onDeleted,
}: DeleteCardButtonProps) {
  const t = useTranslations("deckCreation")
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await DeleteCardAction(cardId, deckId)
      if (!result.success) {
        const message =
          result.reason === "last_card"
            ? t("errors.deleteLastCard")
            : t("errors.deleteCardFailed")
        toast.error(message)
        return
      }
      onDeleted(cardId)
    })
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      disabled={isPending || isLastCard}
      onClick={handleDelete}
      title={isLastCard ? t("errors.deleteLastCard") : undefined}
      className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
    </Button>
  )
}
