import type { QueryClient } from "@tanstack/react-query"

import { QUERY_KEYS } from "@/lib/query-keys"

export function invalidateOrgTerritories(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.org.all })
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cgas.territories })
}

export function invalidateOrgTeamLeads(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.org.all })
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cgas.teamLeads })
}
