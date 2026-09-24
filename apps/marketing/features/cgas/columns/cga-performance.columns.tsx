"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@gorro/ui/components/ui/dropdown-menu"
import { formatNgn, formatSnakeCaseWords } from "@gorro/ui/utils"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import { CGA_STATUS_LABELS } from "@/features/cgas/constants"
import type { CgaActionSubject, CgaPerformanceRow } from "@/features/cgas/types"

function statusVariant(status: string) {
  if (status === "ON_TRACK") return "success" as const
  if (status === "AT_RISK") return "destructive" as const
  return "secondary" as const
}

export function createCgaPerformanceColumns(options: {
  onSetTarget: (cga: CgaActionSubject) => void
}): ColumnDef<CgaPerformanceRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <SortHeader label="CGA" column={column} />,
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "signups",
      header: ({ column }) => <SortHeader label="Sign-ups" column={column} />,
      cell: ({ row }) => row.original.signups.toLocaleString(),
    },
    {
      accessorKey: "firstDepositRate",
      header: ({ column }) => (
        <SortHeader label="First deposit %" column={column} />
      ),
      cell: ({ row }) => `${row.original.firstDepositRate}%`,
    },
    {
      accessorKey: "gtv",
      header: ({ column }) => <SortHeader label="GTV" column={column} />,
      cell: ({ row }) => formatNgn(row.original.gtv),
    },
    {
      accessorKey: "productAdoption",
      header: ({ column }) => (
        <SortHeader label="Product adoption %" column={column} />
      ),
      cell: ({ row }) => `${row.original.productAdoption}%`,
    },
    {
      accessorKey: "totalCustomers",
      header: ({ column }) => (
        <SortHeader label="Total customers" column={column} />
      ),
      cell: ({ row }) => row.original.totalCustomers.toLocaleString(),
    },
    {
      accessorKey: "target",
      header: "Target",
      cell: ({ row }) =>
        row.original.target == null
          ? "—"
          : row.original.target.toLocaleString(),
    },
    {
      accessorKey: "achievementPct",
      header: ({ column }) => (
        <SortHeader label="Achievement %" column={column} />
      ),
      cell: ({ row }) =>
        row.original.achievementPct == null
          ? "—"
          : `${row.original.achievementPct}%`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={statusVariant(status)}>
            {CGA_STATUS_LABELS[status] ?? formatSnakeCaseWords(status)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "fieldActivity",
      header: "Field activity",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.fieldActivity == null
            ? "Not available"
            : row.original.fieldActivity.toLocaleString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <MoreHorizontalIcon className="size-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <DropdownMenuItem
              onClick={(event) => event.stopPropagation()}
              onSelect={() => {
                options.onSetTarget({
                  userId: row.original.userId,
                  name: row.original.name,
                })
              }}
            >
              Set monthly target
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
