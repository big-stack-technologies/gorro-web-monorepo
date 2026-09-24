import { createQueryClient as createGorroQueryClient } from "@gorro/api/query/query-client"

import { routes } from "@/lib/routes"

export function createQueryClient() {
  return createGorroQueryClient({
    sessionClearPath: routes.api.sessionClear,
    protectedPathPrefix: routes.protected.admin.base,
  })
}
