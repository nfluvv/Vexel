"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, X, Loader2 } from "lucide-react"

import { Button, Input } from "@/shared/client/ui"
import { updateCardAction } from "../api/edit-card"
import { editCardSchema, EditCardInput } from "../model/schema"
import type { CardItem } from "@/entities/card"

type EditCardFormProps = {
  card: CardItem
  deckId: string
  onSaved: (card: CardItem) => void
  onCancel: () => void
}

export function EditCardForm({
  card,
  deckId,
  onSaved,
  onCancel,
}: EditCardFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EditCardInput>({
    resolver: zodResolver(editCardSchema),
    defaultValues: { term: card.term, definition: card.definition },
  })

  const onSubmit = async (values: EditCardInput) => {
    const result = await updateCardAction(card.id, deckId, values)
    if (result.success && result.card) onSaved(result.card)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 items-center gap-2"
    >
      <Input {...register("term")} className="h-8 text-sm" autoFocus />
      <Input {...register("definition")} className="h-8 text-sm" />

      <Button
        type="submit"
        size="icon"
        variant="ghost"
        disabled={isSubmitting}
        className="size-7 shrink-0"
      >
        {isSubmitting ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Check className="size-3.5 text-primary" />
        )}
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={onCancel}
        className="size-7 shrink-0"
      >
        <X className="size-3.5 text-muted-foreground" />
      </Button>
    </form>
  )
}
