import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getUserAction } from "@/features/users/actions"
import { QUERY_KEYS } from "@/lib/query-keys"
import { UserDetails } from "@/features/users/types"

/**
 * Fetches `accountCount` and `totalBalance` for a user (detail endpoint).
 * Shares cache with full `getUserAction` via `QUERY_KEYS.users.detail`.
 */
export function useGetUser(
  userId: string,
  enabled: boolean
): UseQueryResult<UserDetails, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.users.detail(userId),
    queryFn: () => getUserAction(userId),
    enabled: enabled && Boolean(userId),
  })
}
