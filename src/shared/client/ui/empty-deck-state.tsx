import { Container } from "@/shared/client/ui"

type EmptyDeckStateProps = {
  message: string
}

export function EmptyDeckState({ message }: EmptyDeckStateProps) {
  return (
    <main>
      <Container>
        <p className="py-10 text-center text-muted-foreground">{message}</p>
      </Container>
    </main>
  )
}
