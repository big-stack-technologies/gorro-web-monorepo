import type { QueryClient } from "@tanstack/react-query"

import { QUERY_KEYS } from "@/lib/query-keys"

/** Refetch overview alerts (and headline metrics) after target or rule changes. */
export function invalidateTargetsRelatedQueries(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.targets.all })
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.overview.alerts })
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.overview.summary })
  void queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.overview.management,
  })
}
