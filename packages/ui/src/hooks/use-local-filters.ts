"use client"

import * as React from "react"

function mergeActiveFilters(
  filterKeys: readonly string[],
  appliedFilters: Record<string, string>,
  defaultFilters?: Record<string, string>
) {
  const out: Record<string, string> = {}
  for (const key of filterKeys) {
    const applied = appliedFilters[key]?.trim()
    if (applied) {
      out[key] = applied
      continue
    }
    const fallback = defaultFilters?.[key]?.trim()
    if (fallback) out[key] = fallback
  }
  return out
}

/** Apply/Clear filter bar state scoped to one section (not URL-backed). */
export function useLocalFilters(
  filterKeys: readonly string[],
  defaultFilters?: Record<string, string>
) {
  const [appliedFilters, setAppliedFilters] = React.useState<
    Record<string, string>
  >({})

  const activeFilters = React.useMemo(
    () => mergeActiveFilters(filterKeys, appliedFilters, defaultFilters),
    [appliedFilters, defaultFilters, filterKeys]
  )

  const setFilters = React.useCallback(
    (patch: Record<string, string | undefined>) => {
      setAppliedFilters((prev) => {
        const next = { ...prev }
        for (const [key, value] of Object.entries(patch)) {
          if (!filterKeys.includes(key)) continue
          if (value === undefined || value === "") {
            delete next[key]
          } else {
            next[key] = value.trim()
          }
        }
        return next
      })
    },
    [filterKeys]
  )

  const clearFilters = React.useCallback(() => {
    setAppliedFilters({})
  }, [])

  return { activeFilters, setFilters, clearFilters }
}
