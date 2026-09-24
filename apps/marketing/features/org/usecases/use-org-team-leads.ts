"use client"

import { useQuery } from "@tanstack/react-query"

import { listOrgTeamLeadsAction } from "@/features/org/actions"
import type { OrgListOptions } from "@/features/org/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useOrgTeamLeads(options: OrgListOptions = {}) {
  const keyOptions = {
    includeInactive: options.includeInactive ? "true" : "false",
  }
  return useQuery({
    queryKey: QUERY_KEYS.org.teamLeads(keyOptions),
    queryFn: () => listOrgTeamLeadsAction(options),
  })
}
