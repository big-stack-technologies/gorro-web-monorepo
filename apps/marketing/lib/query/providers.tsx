"use client"

import { QueryProvider as GorroQueryProvider } from "@gorro/api/query/providers"

import { routes } from "@/lib/routes"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <GorroQueryProvider
      sessionClearPath={routes.api.sessionClear}
      protectedPathPrefix={routes.protected.base}
    >
      {children}
    </GorroQueryProvider>
  )
}
