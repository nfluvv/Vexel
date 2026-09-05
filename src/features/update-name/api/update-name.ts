"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"
import { createNameSchema } from "@/entities/user"
import { checkRateLimit } from "@/shared/server/security/rate-limit"

type UpdateNameResult = { success: true } | { success: false; error: string }

export const updateName = async (raw: unknown): Promise<UpdateNameResult> => {
  const session = await auth()

  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  const allowed = await checkRateLimit(`update-name:${session.user.id}`, {
    limit: 5,
    windowMs: 60_000,
  })

  if (!allowed) {
    return { success: false, error: "Too many attempts, try again later" }
  }

  const t = await getTranslations("validation")
  const parsed = createNameSchema(t).safeParse(raw)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid data",
    }
  }

  const trimmedName = parsed.data.name.trim()

  if (!trimmedName) {
    return { success: false, error: "Invalid data" }
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  })

  if (currentUser?.name === trimmedName) {
    return { success: true }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: trimmedName },
  })

  revalidatePath("/settings")

  return { success: true }
}
