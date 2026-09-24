"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"

import {
  DataTableFilterBar,
  type DataTableFilterField,
} from "@gorro/ui/components/data-table"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import { cn } from "@gorro/ui/utils"

type CgaSortableTableProps<T> = {
  data: T[]
  columns: ColumnDef<T>[]
  isLoading: boolean
  emptyMessage?: string
  defaultSorting?: SortingState
  /** Rows matching this predicate stay at the bottom and are not reordered by column sort. */
  pinLast?: (row: T) => boolean
  onRowClick?: (row: T) => void
  filterFields?: readonly DataTableFilterField[]
  activeFilters?: Record<string, string>
  setFilters?: (patch: Record<string, string | undefined>) => void
  clearFilters?: () => void
}

export function CgaSortableTable<T>({
  data,
  columns,
  isLoading,
  emptyMessage = "No rows match these filters.",
  defaultSorting = [],
  pinLast,
  onRowClick,
  filterFields,
  activeFilters = {},
  setFilters,
  clearFilters,
}: CgaSortableTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting)

  const { sortableRows, pinnedRows } = React.useMemo(() => {
    if (!pinLast) return { sortableRows: data, pinnedRows: [] as T[] }
    return {
      sortableRows: data.filter((row) => !pinLast(row)),
      pinnedRows: data.filter((row) => pinLast(row)),
    }
  }, [data, pinLast])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: sortableRows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const pinnedTable = useReactTable({
    data: pinnedRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const sortableBodyRows = table.getRowModel().rows
  const pinnedBodyRows = pinnedTable.getRowModel().rows
  const bodyRows = [...sortableBodyRows, ...pinnedBodyRows]

  const showFilterBar =
    filterFields != null &&
    filterFields.length > 0 &&
    setFilters != null &&
    clearFilters != null

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border ring-1 ring-foreground/10"
      )}
    >
      {showFilterBar ? (
        <DataTableFilterBar
          fields={filterFields}
          activeFilters={activeFilters}
          setFilters={setFilters}
          clearFilters={clearFilters}
        />
      ) : null}
      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-none" />
      ) : (
        <div className="overflow-x-auto">
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
              {bodyRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                bodyRows.map((row, index) => (
                  <TableRow
                    key={
                      index < sortableBodyRows.length
                        ? `sortable-${row.id}`
                        : `pinned-${row.id}`
                    }
                    className={onRowClick ? "cursor-pointer" : undefined}
                    onClick={
                      onRowClick
                        ? () => onRowClick(row.original)
                        : undefined
                    }
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
      )}
    </div>
  )
}
