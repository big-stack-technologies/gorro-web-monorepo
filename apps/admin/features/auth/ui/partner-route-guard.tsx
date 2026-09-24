"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { canAccessAdminRoute } from "@/features/auth/access"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { routes } from "@/lib/routes"

type PartnerRouteGuardProps = {
  children: React.ReactNode
}

export function PartnerRouteGuard({ children }: PartnerRouteGuardProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: profile, isPending } = useGetProfile()

  useEffect(() => {
    if (isPending || !profile) return
    if (!canAccessAdminRoute(profile.roles, pathname)) {
      router.replace(routes.protected.admin.base)
    }
  }, [isPending, pathname, profile, router])

  return children
}
