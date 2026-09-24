"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type Updater,
} from "@tanstack/react-table"
import { keepPreviousData, useQuery, type QueryKey } from "@tanstack/react-query"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Skeleton } from "../ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { cn } from "../../lib/utils"
import type {
  PaginatedListQueryParams,
  PaginatedListResponse,
} from "@gorro/api/types/paginated-list"

import {
  DataTableFilterBar,
  type DataTableFilterField,
} from "./data-table-filters"

export type FetchPaginatedData<TData> = (
  params: PaginatedListQueryParams
) => Promise<PaginatedListResponse<TData>>

export type DataTableFilterContext = {
  /** Non-empty filter values from the URL. */
  activeFilters: Record<string, string>
  /** Merge filter query params; empty string or undefined removes the key. Resets page to 1. */
  setFilters: (patch: Record<string, string | undefined>) => void
  /** Remove all `filterKeys` from the URL. Resets page to 1. */
  clearFilters: () => void
}

export type DataTableProps<TData> = {
  columns: ColumnDef<TData>[]
  fetchData: FetchPaginatedData<TData>
  /** Base query key; page index, page size, and filters are appended automatically. */
  queryKey: QueryKey
  initialPageSize?: number
  /** Page size options for the footer selector. */
  pageSizeOptions?: number[]
  /**
   * Declarative URL-backed filters (compact toolbar above the table).
   * Query param names match `param` on each field.
   */
  filters?: readonly DataTableFilterField[]
  /**
   * Fallback filter values when a param is absent from the URL.
   * Used for fetch params and filter bar display; `clearFilters` resets here.
   */
  defaultFilters?: Record<string, string>
  /**
   * Optional namespace for URL pagination params (`{namespace}_page`, `{namespace}_limit`).
   * Use when multiple DataTables share one route.
   */
  paginationNamespace?: string
  emptyMessage?: string
  className?: string
}

const DEFAULT_PAGE_SIZE = 20
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100]

const PAGE_PARAM = "page"
const LIMIT_PARAM = "limit"

function getPaginationParamNames(namespace?: string) {
  if (!namespace) {
    return { page: PAGE_PARAM, limit: LIMIT_PARAM }
  }
  return {
    page: `${namespace}_page`,
    limit: `${namespace}_limit`,
  }
}

function parsePositiveInt(value: string | null, fallback: number): number {
  const n = parseInt(value ?? "", 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function snapToAllowedLimit(n: number, options: number[]): number {
  if (options.length === 0) return n
  if (options.includes(n)) return n
  return options.reduce((best, curr) =>
    Math.abs(curr - n) < Math.abs(best - n) ? curr : best
  )
}

function getPaginationFromSearchParams(
  searchParams: URLSearchParams,
  allowedLimits: number[],
  initialPageSize: number,
  paginationNamespace?: string
): PaginationState {
  const { page: pageParam, limit: limitParam } =
    getPaginationParamNames(paginationNamespace)
  const page = Math.max(1, parsePositiveInt(searchParams.get(pageParam), 1))
  const rawLimit = parsePositiveInt(
    searchParams.get(limitParam),
    initialPageSize
  )
  const pageSize = snapToAllowedLimit(rawLimit, allowedLimits)
  return { pageIndex: page - 1, pageSize }
}

function getActiveFiltersFromSearchParams(
  searchParams: URLSearchParams,
  filterKeys: readonly string[] | undefined,
  defaultFilters?: Record<string, string>
): Record<string, string> {
  if (!filterKeys?.length) return {}
  const out: Record<string, string> = {}
  for (const key of filterKeys) {
    const raw = searchParams.get(key)
    if (raw != null && raw.trim() !== "") {
      out[key] = raw.trim()
    } else if (defaultFilters?.[key]?.trim()) {
      out[key] = defaultFilters[key].trim()
    }
  }
  return out
}

function stableFiltersKey(filters: Record<string, string>): string {
  const keys = Object.keys(filters).sort()
  return JSON.stringify(
    keys.reduce(
      (acc, k) => {
        acc[k] = filters[k]
        return acc
      },
      {} as Record<string, string>
    )
  )
}

function DataTableUrlFallback<TData>({
  columns,
  className,
}: Pick<DataTableProps<TData>, "columns" | "className">) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="overflow-hidden rounded-xl border border-border ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((_, j) => (
                <TableHead key={j}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-8 w-full max-w-[16rem]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function DataTableInner<TData>({
  columns,
  fetchData,
  queryKey,
  initialPageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  filters,
  defaultFilters,
  paginationNamespace,
  emptyMessage = "No results.",
  className,
}: DataTableProps<TData>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filterKeys = React.useMemo(
    () => filters?.map((f) => f.param) ?? [],
    [filters]
  )

  const resolvedPageSizeOptions = React.useMemo(() => {
    const merged = new Set([...pageSizeOptions, initialPageSize])
    return Array.from(merged).sort((a, b) => a - b)
  }, [pageSizeOptions, initialPageSize])

  const paginationParams = React.useMemo(
    () => getPaginationParamNames(paginationNamespace),
    [paginationNamespace]
  )

  const pagination = React.useMemo(
    () =>
      getPaginationFromSearchParams(
        searchParams,
        resolvedPageSizeOptions,
        initialPageSize,
        paginationNamespace
      ),
    [searchParams, resolvedPageSizeOptions, initialPageSize, paginationNamespace]
  )

  const activeFilters = React.useMemo(
    () =>
      getActiveFiltersFromSearchParams(
        searchParams,
        filterKeys,
        defaultFilters
      ),
    [searchParams, filterKeys, defaultFilters]
  )

  const filtersKey = React.useMemo(
    () => stableFiltersKey(activeFilters),
    [activeFilters]
  )

  const replacePagination = React.useCallback(
    (next: PaginationState) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(paginationParams.page, String(next.pageIndex + 1))
      params.set(paginationParams.limit, String(next.pageSize))
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams, paginationParams]
  )

  const setPagination = React.useCallback(
    (updater: Updater<PaginationState>) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater
      let final = next
      if (next.pageSize !== pagination.pageSize) {
        final = { pageIndex: 0, pageSize: next.pageSize }
      }
      replacePagination(final)
    },
    [pagination, replacePagination]
  )

  const setFilters = React.useCallback(
    (patch: Record<string, string | undefined>) => {
      if (filterKeys.length === 0) return
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(patch)) {
        if (!filterKeys.includes(key)) continue
        if (value === undefined || value === "") {
          params.delete(key)
        } else {
          params.set(key, value.trim())
        }
      }
      params.set(paginationParams.page, "1")
      params.set(paginationParams.limit, String(pagination.pageSize))
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [filterKeys, pathname, pagination.pageSize, router, searchParams, paginationParams]
  )

  const clearFilters = React.useCallback(() => {
    if (filterKeys.length === 0) return
    const params = new URLSearchParams(searchParams.toString())
    for (const key of filterKeys) {
      const fallback = defaultFilters?.[key]?.trim()
      if (fallback) {
        params.set(key, fallback)
      } else {
        params.delete(key)
      }
    }
    params.set(paginationParams.page, "1")
    params.set(paginationParams.limit, String(pagination.pageSize))
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [
    defaultFilters,
    filterKeys,
    pathname,
    pagination.pageSize,
    router,
    searchParams,
    paginationParams,
  ])

  const { pageIndex, pageSize } = pagination

  const query = useQuery({
    queryKey: [...queryKey, pageIndex, pageSize, filtersKey],
    queryFn: () => {
      const params: PaginatedListQueryParams = {
        page: pageIndex + 1,
        limit: pageSize,
        ...activeFilters,
      }
      return fetchData(params)
    },
    placeholderData: keepPreviousData,
  })

  const { data, isLoading, isFetching, isError, error, refetch } = query

  const rows = data?.data ?? []
  const meta = data?.meta

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns,
    pageCount: meta?.totalPages ?? -1,
    state: { pagination },
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  })

  const showSkeleton = isLoading && !data
  const total = meta?.total ?? 0
  const from = total === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min((pageIndex + 1) * pageSize, total)

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-border ring-1 ring-foreground/10",
          isFetching && !isLoading && "opacity-80"
        )}
      >
        {filters?.length ? (
          <DataTableFilterBar
            fields={filters}
            activeFilters={activeFilters}
            setFilters={setFilters}
            clearFilters={clearFilters}
          />
        ) : null}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {showSkeleton ? (
              Array.from({ length: Math.min(pageSize, 8) }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-8 w-full max-w-[16rem]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-destructive"
                >
                  {error instanceof Error ? error.message : "Something went wrong."}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="ml-3"
                    onClick={() => void refetch()}
                  >
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!showSkeleton && !isError && meta && total > 0 && (
        <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">{from}</span>
            {"–"}
            <span className="font-medium text-foreground">{to}</span>
            {" of "}
            <span className="font-medium text-foreground">{total}</span>
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  const next = Number(v)
                  replacePagination({ pageIndex: 0, pageSize: next })
                }}
              >
                <SelectTrigger size="sm" className="w-18">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {resolvedPageSizeOptions.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {meta.page} of {Math.max(meta.totalPages, 1)}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => table.previousPage()}
                  disabled={!meta.hasPreviousPage}
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => table.nextPage()}
                  disabled={!meta.hasNextPage}
                  aria-label="Next page"
                >
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function DataTable<TData>(props: DataTableProps<TData>) {
  return (
    <React.Suspense
      fallback={
        <DataTableUrlFallback columns={props.columns} className={props.className} />
      }
    >
      <DataTableInner {...props} />
    </React.Suspense>
  )
}

export type { DataTableFilterField } from "./data-table-filters"
