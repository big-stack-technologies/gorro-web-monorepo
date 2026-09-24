"use client"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTable } from "@gorro/ui/components/data-table"
import { listTransactionsAction } from "@/features/transactions/actions"
import { transactionsColumns } from "@/features/transactions/columns"
import { transactionsTableFilters } from "@/features/transactions/table-filters"
import { AmlFlagsAnalyticsSection } from "@/features/transactions/ui/aml-flags-analytics-section"
import { TransactionsAnalyticsSection } from "@/features/transactions/ui/transactions-analytics-summary"
import { QUERY_KEYS } from "@/lib/query-keys"

export function TransactionsPage() {
  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Transactions"
        description="View ledger transactions and filter by status, type, and more. Analytics reflect the latest summary from the server."
      />
      <TransactionsAnalyticsSection />
      <AmlFlagsAnalyticsSection />
      <DataTable
        columns={transactionsColumns}
        fetchData={listTransactionsAction}
        queryKey={QUERY_KEYS.transactions.list}
        filters={transactionsTableFilters}
      />
    </div>
  )
}
