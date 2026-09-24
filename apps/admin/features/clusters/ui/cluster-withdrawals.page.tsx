"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTable } from "@gorro/ui/components/data-table"
import { Button } from "@gorro/ui/components/ui/button"
import { listAllClusterWithdrawalsAction } from "@/features/clusters/actions"
import { clusterWithdrawalsColumns } from "@/features/clusters/columns"
import { clusterWithdrawalsTableFilters } from "@/features/clusters/table-filters"
import { QUERY_KEYS } from "@/lib/query-keys"
import { routes } from "@/lib/routes"

export function ClusterWithdrawalsPage() {
  const searchParams = useSearchParams()
  const showBackToClusters = searchParams.get("from") === "clusters"

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 lg:px-6">
      {showBackToClusters ? (
        <Button variant="ghost" size="sm" className="w-fit px-0" asChild>
          <Link href={routes.protected.clusters.base}>
            <ArrowLeftIcon data-icon="inline-start" />
            Back to clusters
          </Link>
        </Button>
      ) : null}
      <AdminPageHeader
        title="Cluster withdrawals"
        description="Review withdrawal requests across every cluster and intervene when required."
      />
      <DataTable
        columns={clusterWithdrawalsColumns}
        fetchData={listAllClusterWithdrawalsAction}
        queryKey={QUERY_KEYS.clusters.withdrawals.global}
        filters={clusterWithdrawalsTableFilters}
        emptyMessage="No cluster withdrawals match this filter."
      />
    </div>
  )
}
