import { notFound } from "next/navigation"

import { getUserByUsername } from "@/entities/user/api/queries"
import { getRecentPublicUserDecks } from "@/entities/deck/api/queries"
import { UserProfile } from "@/widgets/user-profile-card"
import { UserProfileDecks } from "@/widgets/user-profile-decks"
import { Container } from "@/shared/client/ui"

type CurrentUser =
  | {
      id: string
    }
  | null
  | undefined

type UserProfileViewProps = {
  username: string
  currentUser: CurrentUser
}

export async function UserProfileView({
  username,
  currentUser,
}: UserProfileViewProps) {
  const profile = await getUserByUsername(username)

  if (!profile) notFound()

  const [decks] = await Promise.all([getRecentPublicUserDecks(profile.id)])

  const isOwnProfile = profile.id === currentUser?.id
  const canSaveDecks = Boolean(currentUser) && !isOwnProfile

  return (
    <main className="min-h-screen pb-10">
      <Container className="py-6 sm:py-8">
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-background">
          <UserProfile profile={profile} isOwnProfile={isOwnProfile} />

          <UserProfileDecks
            decks={decks}
            canSaveDecks={canSaveDecks}
            username={profile.username}
          />
        </div>
      </Container>
    </main>
  )
}
