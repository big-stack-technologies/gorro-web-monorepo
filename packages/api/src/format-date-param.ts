const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/** API query dates as `YYYY-MM-DD` (filters may store ISO from the date picker). */
export function formatDateParam(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  if (DATE_ONLY.test(trimmed)) return trimmed

  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) return trimmed

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, "0")
  const day = String(parsed.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
