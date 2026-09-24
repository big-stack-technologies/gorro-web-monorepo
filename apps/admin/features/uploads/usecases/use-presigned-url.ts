"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getPresignedUrlAction } from "@/features/uploads/actions"
import { QUERY_KEYS } from "@/lib/query-keys"

export function usePresignedUrl(
  fileUrl: string | undefined
): UseQueryResult<string, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.uploads.presign(fileUrl ?? ""),
    queryFn: () => getPresignedUrlAction(fileUrl!),
    enabled: !!fileUrl?.trim(),
    staleTime: 1000 * 60 * 60 * 11,
  })
}
