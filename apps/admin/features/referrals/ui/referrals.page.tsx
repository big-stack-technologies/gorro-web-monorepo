"use client"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTable } from "@gorro/ui/components/data-table"
import { listReferralsAction } from "@/features/referrals/actions"
import { referralsColumns } from "@/features/referrals/columns"
import { referralsTableFilters } from "@/features/referrals/table-filters"
import { ReferralsStatsSection } from "@/features/referrals/ui/referrals-stats-section"
import { QUERY_KEYS } from "@/lib/query-keys"

export function ReferralsPage() {
  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Referrals"
        description="View referral pairs, bonus status, and program statistics."
      />
      <ReferralsStatsSection />
      <DataTable
        columns={referralsColumns}
        fetchData={listReferralsAction}
        queryKey={QUERY_KEYS.referrals.list}
        filters={referralsTableFilters}
      />
    </div>
  )
}
