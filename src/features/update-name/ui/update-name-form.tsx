"use client"

import { useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/client/ui"
import { createNameSchema, type NameValues } from "@/entities/user"

import { updateName } from "../api/update-name"

type UpdateNameFormProps = { defaultName: string }

export const UpdateNameForm = ({ defaultName }: UpdateNameFormProps) => {
  const router = useRouter()

  const t = useTranslations("updateName")
  const tc = useTranslations("common")
  const tValidation = useTranslations("validation")

  const schema = useMemo(() => createNameSchema(tValidation), [tValidation])

  const form = useForm<NameValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: defaultName },
  })

  const watchedName = useWatch({
    control: form.control,
    name: "name",
  })

  const onSubmit = async (values: NameValues) => {
    if (values.name === defaultName) return

    const result = await updateName(values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success(t("success"))
    router.refresh()
  }

  const isSubmitting = form.formState.isSubmitting
  const isUnchanged = watchedName === defaultName

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("label")}</FormLabel>
              <div className="flex items-start gap-2">
                <FormControl className="flex-1">
                  <Input {...field} />
                </FormControl>

                <Button
                  type="submit"
                  disabled={isSubmitting || isUnchanged}
                  className="disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
                >
                  {isSubmitting ? t("saving") : tc("save")}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
