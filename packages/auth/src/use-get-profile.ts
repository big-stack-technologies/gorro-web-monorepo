"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getProfileAction } from "./get-profile"
import { SESSION_QUERY_KEY } from "./query-keys"
import type { AuthProfile } from "./types"

export function useGetProfile(): UseQueryResult<AuthProfile, Error> {
  return useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: getProfileAction,
  })
}
