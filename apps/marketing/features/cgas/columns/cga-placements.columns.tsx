"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@gorro/ui/components/ui/dropdown-menu"
import { formatUtcDate } from "@gorro/ui/utils"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import type { CgaActionSubject, CgaPlacement } from "@/features/cgas/types"

export function createCgaPlacementsColumns(options: {
  onAssign: (cga: CgaActionSubject) => void
}): ColumnDef<CgaPlacement>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <SortHeader label="CGA" column={column} />,
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "cgaSince",
      header: "CGA since",
      cell: ({ row }) =>
        row.original.cgaSince
          ? formatUtcDate(row.original.cgaSince)
          : "—",
    },
    {
      id: "teamLead",
      header: "Team lead",
      cell: ({ row }) => row.original.teamLead?.name ?? "Unassigned",
    },
    {
      id: "territory",
      header: "Territory",
      cell: ({ row }) =>
        row.original.territory
          ? `${row.original.territory.name} (${row.original.territory.code})`
          : "Unassigned",
    },
    {
      accessorKey: "customersAttributed",
      header: ({ column }) => (
        <SortHeader label="Customers attributed" column={column} />
      ),
      cell: ({ row }) => row.original.customersAttributed.toLocaleString(),
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
                options.onAssign({
                  userId: row.original.userId,
                  name: row.original.name,
                  teamLead: row.original.teamLead,
                  territory: row.original.territory,
                })
              }}
            >
              Assign team lead & territory
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
