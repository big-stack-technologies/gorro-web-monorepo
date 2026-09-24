"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { listAlertRulesAction } from "@/features/targets-and-alerts/actions"
import type { MarketingAlertRule } from "@/features/targets-and-alerts/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useAlertRules(): UseQueryResult<MarketingAlertRule[], Error> {
  return useQuery({
    queryKey: QUERY_KEYS.targets.alertRules,
    queryFn: () => listAlertRulesAction(),
  })
}
