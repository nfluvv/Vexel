"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"

export async function DeleteDeckAction(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const result = await prisma.deck.deleteMany({
    where: { id, userId: session.user.id },
  })

  if (result.count === 0) {
    return { success: false }
  }

  revalidatePath("/dashboard")

  return { success: true, id }
}
