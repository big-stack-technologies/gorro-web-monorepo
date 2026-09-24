"use client"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTable } from "@gorro/ui/components/data-table"
import { listWithdrawalRequestsAction } from "@/features/withdrawal-requests/actions"
import { withdrawalRequestsColumns } from "@/features/withdrawal-requests/columns"
import { withdrawalRequestsTableFilters } from "@/features/withdrawal-requests/table-filters"
import { QUERY_KEYS } from "@/lib/query-keys"

export function WithdrawalRequestsPage() {
  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Withdrawal requests"
        description="Review and approve pending withdrawal requests from users."
      />
      <DataTable
        columns={withdrawalRequestsColumns}
        fetchData={listWithdrawalRequestsAction}
        queryKey={QUERY_KEYS.withdrawalRequests.list}
        filters={withdrawalRequestsTableFilters}
      />
    </div>
  )
}
