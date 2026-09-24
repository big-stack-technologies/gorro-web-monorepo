import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { isApiError } from "@gorro/api/api-error"
import { getProfileAction } from "@gorro/auth/get-profile"
import type { AuthProfile } from "@gorro/auth/types"
import { AppShell } from "@gorro/ui/components/app-shell"

import { AppSidebar } from "@/components/partials/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { canAccessAdminRoute } from "@/features/auth/access"
import { PartnerRouteGuard } from "@/features/auth/ui/partner-route-guard"
import { createQueryClient } from "@/lib/query/query-client"
import { QUERY_KEYS } from "@/lib/query-keys"
import { routes } from "@/lib/routes"

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = createQueryClient()
  try {
    await queryClient.fetchQuery({
      queryKey: QUERY_KEYS.session,
      queryFn: getProfileAction,
    })
  } catch (e) {
    if (isApiError(e) && e.status === 401) {
      redirect(routes.api.sessionClear)
    }
    throw e
  }

  const profile = queryClient.getQueryData<AuthProfile>(QUERY_KEYS.session)
  const pathname = (await headers()).get("x-pathname") ?? ""

  if (!canAccessAdminRoute(profile?.roles, pathname)) {
    redirect(routes.protected.admin.base)
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppShell
        sidebar={<AppSidebar variant="inset" />}
        header={<SiteHeader />}
      >
        <PartnerRouteGuard>{children}</PartnerRouteGuard>
      </AppShell>
    </HydrationBoundary>
  )
}
