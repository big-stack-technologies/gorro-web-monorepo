"use client"

import { useQuery } from "@tanstack/react-query"

import { listOrgTerritoriesAction } from "@/features/org/actions"
import type { OrgListOptions } from "@/features/org/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useOrgTerritories(options: OrgListOptions = {}) {
  const keyOptions = {
    includeInactive: options.includeInactive ? "true" : "false",
  }
  return useQuery({
    queryKey: QUERY_KEYS.org.territories(keyOptions),
    queryFn: () => listOrgTerritoriesAction(options),
  })
}
