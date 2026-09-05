"use server"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"

export async function saveTimezoneAction(timezone: string) {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.user.update({
    where: { id: session.user.id },
    data: { timezone },
  })
}
