"use client"

import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@gorro/ui/components/ui/sidebar"
import { NavUser } from "@gorro/ui/components/nav-user"

import { useGetProfile } from "./use-get-profile"
import type { AuthProfile } from "./types"

function authProfileToNavUser(profile: AuthProfile) {
  const parts = [profile.firstName, profile.middleName, profile.lastName].filter(
    (x): x is string => typeof x === "string" && x.length > 0
  )
  const name =
    parts.length > 0 ? parts.join(" ") : (profile.email.split("@")[0] ?? "User")
  return { name, email: profile.email, avatar: "" }
}

export function AuthNavUser({
  onLogout,
}: {
  onLogout: () => void | Promise<void>
}) {
  const { data, isPending, isError } = useGetProfile()

  if (isPending && !data) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="pointer-events-none">
            <Skeleton className="size-8 rounded-lg" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (isError || !data) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <span className="text-xs text-muted-foreground">
              Unable to load profile
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return <NavUser user={authProfileToNavUser(data)} onLogout={onLogout} />
}
