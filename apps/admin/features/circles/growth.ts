import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  format,
  isValid,
  parseISO,
} from "date-fns"

import type {
  CircleGrowth,
  CircleGrowthBucket,
  CircleGrowthGroup,
} from "@/features/circles/types"

/** `period` has a different shape per `groupBy`, matching what the API emits. */
function periodKey(date: Date, groupBy: CircleGrowthGroup): string {
  if (groupBy === "month") return format(date, "yyyy-MM")
  if (groupBy === "week") return format(date, "RRRR-'W'II")
  return format(date, "yyyy-MM-dd")
}

/**
 * The API omits empty buckets, so charting `series` directly would squeeze gaps
 * out of the x-axis. Fill every period in `from..to` with zeros instead.
 */
export function fillGrowthSeries(data: CircleGrowth): CircleGrowthBucket[] {
  const start = parseISO(data.from)
  const end = parseISO(data.to)
  if (!isValid(start) || !isValid(end) || start > end) return data.series

  const dates =
    data.groupBy === "month"
      ? eachMonthOfInterval({ start, end })
      : data.groupBy === "week"
        ? eachWeekOfInterval({ start, end }, { weekStartsOn: 1 })
        : eachDayOfInterval({ start, end })
  const byPeriod = new Map(data.series.map((bucket) => [bucket.period, bucket]))

  const filled = dates.map((date) => {
    const period = periodKey(date, data.groupBy)
    return (
      byPeriod.get(period) ?? {
        period,
        circlesCreated: 0,
        joins: 0,
        firstContributions: 0,
      }
    )
  })

  // If our period keys ever disagree with the API's, show its data as-is
  // rather than silently dropping buckets.
  const matched = filled.filter((bucket) => byPeriod.has(bucket.period)).length
  return matched < data.series.length ? data.series : filled
}
