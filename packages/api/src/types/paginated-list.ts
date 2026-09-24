/** Standard list API envelope (page, limit, meta). */
export type PaginatedListMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type PaginatedListResponse<TData> = {
  data: TData[]
  meta: PaginatedListMeta
}

export type PaginatedListParams = {
  page: number
  limit: number
}

/**
 * Pagination plus optional string filters as query params.
 * Index signature allows `page` / `limit` (numbers) and filter strings.
 */
export type PaginatedListQueryParams = PaginatedListParams & {
  [key: string]: string | number | undefined
}
