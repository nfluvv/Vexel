import { notFound } from "next/navigation"

import { getCurrentUser, getUserByUsername } from "@/entities/user/api/queries"
import { getPublicUserDecks } from "@/entities/deck/api/queries"
import { UserDecks } from "@/views/user-decks"

type UserProfilePageProps = {
  params: Promise<{ username: string }>
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { username } = await params
  const profile = await getUserByUsername(username)

  if (!profile) notFound()

  const [currentUser, decks] = await Promise.all([
    getCurrentUser(),
    getPublicUserDecks(profile.id),
  ])

  if (!decks) notFound()

  return <UserDecks profile={profile} decks={decks} currentUser={currentUser} />
}
