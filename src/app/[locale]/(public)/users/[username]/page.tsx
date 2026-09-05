import type { Metadata } from "next"

import { getCurrentUser, getUserByUsername } from "@/entities/user/api/queries"
import { UserNotFoundView } from "@/views/user-profile"
import { UserProfileView } from "@/views/user-profile"
import { getTranslations } from "next-intl/server"

type UserProfilePageProps = {
  params: Promise<{ username: string }>
}

async function getProfilePageData(username: string) {
  const [profile, currentUser] = await Promise.all([
    getUserByUsername(username),
    getCurrentUser(),
  ])

  return { profile, currentUser }
}

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const { profile } = await getProfilePageData(username)
  const t = await getTranslations("meta")

  return {
    title: profile ? username : t("userNotFound"),
  }
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { username } = await params
  const { profile, currentUser } = await getProfilePageData(username)

  if (!profile) {
    return <UserNotFoundView />
  }

  return <UserProfileView username={username} currentUser={currentUser} />
}
