"use client"

import { useQuery } from "@tanstack/react-query"

import { listTeamLeadsAction } from "@/features/cgas/actions"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useTeamLeads() {
  return useQuery({
    queryKey: QUERY_KEYS.cgas.teamLeads,
    queryFn: () => listTeamLeadsAction(),
  })
}
