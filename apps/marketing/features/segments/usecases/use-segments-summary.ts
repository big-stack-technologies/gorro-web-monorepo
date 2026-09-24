"use client"

import { useQuery } from "@tanstack/react-query"

import { listSegmentsAction } from "@/features/segments/actions"
import type { SegmentThresholdOptions } from "@/features/segments/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useSegmentsSummary(options: SegmentThresholdOptions) {
  return useQuery({
    queryKey: QUERY_KEYS.segments.summary(options),
    queryFn: () => listSegmentsAction(options),
  })
}
