"use client"

import { useQuery } from "@tanstack/react-query"

import { getCircleAction } from "@/features/circles/actions"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useCircle(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.circles.detail(id),
    queryFn: () => getCircleAction(id),
  })
}
