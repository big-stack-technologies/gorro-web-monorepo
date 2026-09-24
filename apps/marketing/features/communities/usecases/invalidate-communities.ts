import type { QueryClient } from "@tanstack/react-query"

import { QUERY_KEYS } from "@/lib/query-keys"

export function invalidateCommunities(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.communities.all })
  void queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.campaigns.communities,
  })
}
