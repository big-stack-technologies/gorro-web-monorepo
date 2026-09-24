import type { PaginatedListQueryParams } from "./types/paginated-list"

/**
 * Builds axios query params for paginated list endpoints: `page`, `limit`, plus
 * optional non-empty string filters. Omits blank strings.
 */
export function buildPaginatedListQueryParams(
  params: PaginatedListQueryParams
): Record<string, string | number> {
  const { page, limit, ...rest } = params
  const axiosParams: Record<string, string | number> = { page, limit }
  for (const [key, value] of Object.entries(rest)) {
    if (value === undefined) continue
    if (typeof value === "number" && Number.isFinite(value)) {
      axiosParams[key] = value
    } else if (typeof value === "string" && value.trim() !== "") {
      axiosParams[key] = value.trim()
    }
  }
  return axiosParams
}
