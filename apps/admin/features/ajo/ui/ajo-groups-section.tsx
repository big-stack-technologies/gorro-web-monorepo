"use client"

import { DataTable } from "@gorro/ui/components/data-table"
import { listAjoGroupsAction } from "@/features/ajo/actions"
import { ajoGroupsColumns } from "@/features/ajo/columns"
import { ajoGroupsTableFilters } from "@/features/ajo/table-filters"
import { QUERY_KEYS } from "@/lib/query-keys"

export function AjoGroupsSection() {
  return (
    <section
      className="flex flex-col gap-4"
      aria-labelledby="ajo-groups-title"
    >
      <div>
        <h2
          id="ajo-groups-title"
          className="font-heading text-lg font-semibold"
        >
          Groups
        </h2>
        <p className="text-sm text-muted-foreground">
          Filter by type, status, or creator. Search by group name or invite
          code.
        </p>
      </div>
      <DataTable
        columns={ajoGroupsColumns}
        fetchData={listAjoGroupsAction}
        queryKey={QUERY_KEYS.ajo.groups.list}
        filters={ajoGroupsTableFilters}
        emptyMessage="No Ajo groups match your filters."
      />
    </section>
  )
}
