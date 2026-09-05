import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"

import { siteConfig } from "@/shared/client/config/site"
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/shared/client/ui"

import { ProfileCover } from "./ProfileCover"
import { ProfileIdentity } from "./ProfileIdentity"

type UserProfileProps = {
  profile: {
    id: string
    name: string | null
    username: string | null
    image: string | null
    createdAt: Date
  }
  isOwnProfile: boolean
}

export function UserProfile({ profile, isOwnProfile }: UserProfileProps) {
  const t = useTranslations("profile")
  const locale = useLocale()

  const initial = (profile.name ?? "?").charAt(0).toUpperCase()

  const joinedDate = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(profile.createdAt)

  return (
    <>
      <ProfileCover />

      <div className="px-5 pb-8 sm:px-8 sm:pb-9">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Avatar className="-mt-10 size-24 shrink-0 rounded-2xl border-4 border-background bg-background sm:-mt-12 sm:size-28">
            <AvatarImage
              src={profile.image ?? undefined}
              alt={profile.name ?? ""}
              className="rounded-xl object-cover"
            />

            <AvatarFallback className="rounded-xl bg-background text-3xl font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>

          {isOwnProfile && (
            <Link href={siteConfig.routes.settings}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-4xl px-4 font-medium"
              >
                {t("edit")}
              </Button>
            </Link>
          )}
        </div>

        <ProfileIdentity name={profile.name} username={profile.username} />

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span>
            {t("memberSince")}{" "}
            <span className="font-medium text-foreground/80">{joinedDate}</span>
          </span>

          <span className="hidden text-border sm:inline">•</span>

          <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground/50 uppercase">
            {siteConfig.name}
          </span>
        </div>
      </div>
    </>
  )
}
