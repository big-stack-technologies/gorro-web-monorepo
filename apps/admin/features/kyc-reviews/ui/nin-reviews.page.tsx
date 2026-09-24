"use client"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTable } from "@gorro/ui/components/data-table"
import { listNinReviewsAction } from "@/features/kyc-reviews/actions"
import { ninReviewsColumns } from "@/features/kyc-reviews/columns/nin-reviews.columns"
import {
  ninReviewsDefaultFilters,
  ninReviewsTableFilters,
} from "@/features/kyc-reviews/table-filters"
import { QUERY_KEYS } from "@/lib/query-keys"

export function NinReviewsPage() {
  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="NIN reviews"
        description="Review pending NIN submissions, compare identity sources, and approve or reject manual reviews."
      />
      <DataTable
        columns={ninReviewsColumns}
        fetchData={listNinReviewsAction}
        queryKey={QUERY_KEYS.kycReviews.ninList}
        filters={ninReviewsTableFilters}
        defaultFilters={ninReviewsDefaultFilters}
      />
    </div>
  )
}
