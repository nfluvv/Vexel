import { Container } from "@/shared/client/ui"
import { HeroSection } from "@/widgets/hero-section"
// import { PopularDecksList } from "@/widgets/popular-decks"
// import { redirect } from "next/navigation";
// import { auth } from "@/auth";

export async function HomePage() {
  // const session = await auth();

  // if (session?.user) {
  //   redirect("/dashboard");
  // }

  return (
    <main>
      <Container className="container flex min-h-[calc(100vh-8.5rem)] flex-col justify-center gap-12 pb-20">
        <HeroSection />
        {/*         
        <div className="w-full border-t border-border/40" />

        <PopularDecksList /> */}
      </Container>
    </main>
  )
}
