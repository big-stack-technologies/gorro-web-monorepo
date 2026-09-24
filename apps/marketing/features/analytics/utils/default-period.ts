/** Matches API default: 1st of current month through end of today. */
export function defaultAnalyticsPeriodIso() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  )
  return {
    from: start.toISOString(),
    to: end.toISOString(),
  }
}
