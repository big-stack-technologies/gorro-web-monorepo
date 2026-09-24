"use client"

import Link from "next/link"
import { BanknoteIcon } from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTable } from "@gorro/ui/components/data-table"
import { Button } from "@gorro/ui/components/ui/button"
import { listClustersAction } from "@/features/clusters/actions"
import { clustersColumns } from "@/features/clusters/columns"
import { clustersTableFilters } from "@/features/clusters/table-filters"
import { ClustersAnalyticsSection } from "@/features/clusters/ui/clusters-analytics-section"
import { QUERY_KEYS } from "@/lib/query-keys"
import { routes } from "@/lib/routes"

export function ClustersPage() {
  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title="Clusters"
          description="Monitor cluster balances, membership, withdrawals, and platform activity."
        />
        <Button variant="outline" size="sm" asChild>
          <Link href={`${routes.protected.clusters.withdrawals}?from=clusters`}>
            <BanknoteIcon data-icon="inline-start" />
            Withdrawal queue
          </Link>
        </Button>
      </div>
      <ClustersAnalyticsSection />
      <section
        className="flex flex-col gap-4"
        aria-labelledby="cluster-directory-title"
      >
        <div>
          <h2
            id="cluster-directory-title"
            className="font-heading text-lg font-semibold"
          >
            Cluster directory
          </h2>
          <p className="text-sm text-muted-foreground">
            Search by cluster name or code and filter by operating status.
          </p>
        </div>
        <DataTable
          columns={clustersColumns}
          fetchData={listClustersAction}
          queryKey={QUERY_KEYS.clusters.list}
          filters={clustersTableFilters}
          emptyMessage="No clusters match these filters."
        />
      </section>
    </div>
  )
}
