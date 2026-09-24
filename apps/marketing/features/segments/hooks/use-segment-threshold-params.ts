"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
  DEFAULT_SEGMENT_THRESHOLDS,
  SEGMENT_THRESHOLD_PARAM_KEYS,
} from "@/features/segments/constants"
import type { SegmentThresholdOptions } from "@/features/segments/types"

export function useSegmentThresholdParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const options = useMemo<SegmentThresholdOptions>(() => {
    const next = { ...DEFAULT_SEGMENT_THRESHOLDS }
    for (const key of SEGMENT_THRESHOLD_PARAM_KEYS) {
      const value = searchParams.get(key)
      if (value != null && value !== "") next[key] = value
    }
    return next
  }, [searchParams])

  const setOptions = useCallback(
    (patch: Partial<SegmentThresholdOptions>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(patch)) {
        if (!value) params.delete(key)
        else params.set(key, value)
      }
      params.delete("page")
      router.replace(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  return { options, setOptions }
}
