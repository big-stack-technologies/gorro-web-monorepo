"use client"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTable } from "@gorro/ui/components/data-table"
import { listCirclesAction } from "@/features/circles/actions"
import { circlesColumns } from "@/features/circles/columns"
import { circlesTableFilters } from "@/features/circles/table-filters"
import { CirclesAnalyticsSection } from "@/features/circles/ui/circles-analytics-section"
import { QUERY_KEYS } from "@/lib/query-keys"

export function CirclesPage() {
  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Circles"
        description="See how people join and fund savings circles, and browse every circle."
      />
      <CirclesAnalyticsSection />
      <section
        className="flex flex-col gap-4"
        aria-labelledby="circle-directory-title"
      >
        <div>
          <h2
            id="circle-directory-title"
            className="font-heading text-lg font-semibold"
          >
            Circle directory
          </h2>
          <p className="text-sm text-muted-foreground">
            Search by circle name, invite code or owner and filter by status or
            visibility.
          </p>
        </div>
        <DataTable
          columns={circlesColumns}
          fetchData={listCirclesAction}
          queryKey={QUERY_KEYS.circles.list}
          filters={circlesTableFilters}
          emptyMessage="No circles match these filters."
        />
      </section>
    </div>
  )
}
