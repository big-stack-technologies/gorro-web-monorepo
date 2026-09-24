"use client"

import { useQuery } from "@tanstack/react-query"

import { getAjoGroupAction } from "@/features/ajo/actions"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useAjoGroup(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ajo.groups.detail(id),
    queryFn: () => getAjoGroupAction(id),
  })
}
