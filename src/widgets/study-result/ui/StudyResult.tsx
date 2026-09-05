import type { ReactNode } from "react"
import { Container } from "@/shared/client/ui"

type StudyResultProps = {
  title: string
  description: string
  badge?: ReactNode
  children: ReactNode
}

export function StudyResult({
  title,
  description,
  badge,
  children,
}: StudyResultProps) {
  return (
    <main className="mx-auto max-w-xl space-y-6 py-16 text-center">
      <Container>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
          {badge}
        </div>
        <div>{children}</div>
      </Container>
    </main>
  )
}
