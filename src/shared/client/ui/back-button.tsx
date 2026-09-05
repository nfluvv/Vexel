"use client"

import { useRouter } from "next/navigation"

type BackButtonProps = {
  label: string
}

export function BackButton({ label }: BackButtonProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="group mb-10 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="transition-transform group-hover:-translate-x-0.5">
        ←
      </span>
      {label}
    </button>
  )
}
