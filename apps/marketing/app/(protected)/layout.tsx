import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { connection } from "next/server"
import { redirect, unstable_rethrow } from "next/navigation"

import { isApiError } from "@gorro/api/api-error"
import { getProfileAction } from "@gorro/auth/get-profile"
import { SESSION_QUERY_KEY } from "@gorro/auth/query-keys"
import { AppShell } from "@gorro/ui/components/app-shell"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { createQueryClient } from "@/lib/query/query-client"
import { routes } from "@/lib/routes"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await connection()

  const queryClient = createQueryClient()
  try {
    await queryClient.fetchQuery({
      queryKey: SESSION_QUERY_KEY,
      queryFn: getProfileAction,
    })
  } catch (e) {
    unstable_rethrow(e)
    if (isApiError(e) && e.status === 401) {
      redirect(routes.api.sessionClear)
    }
    console.error("Failed to load marketing session:", e)
    throw e
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppShell
        sidebar={<AppSidebar variant="inset" />}
        header={<SiteHeader />}
      >
        {children}
      </AppShell>
    </HydrationBoundary>
  )
}
