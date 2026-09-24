"use client"

import { ArrowUpDownIcon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"

export function SortHeader({
  label,
  column,
}: {
  label: string
  column: {
    toggleSorting: (desc?: boolean) => void
    getIsSorted: () => false | "asc" | "desc"
  }
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2 h-8"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDownIcon className="size-3.5 opacity-60" />
    </Button>
  )
}
