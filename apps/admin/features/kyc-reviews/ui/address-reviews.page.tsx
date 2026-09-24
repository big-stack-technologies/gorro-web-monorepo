"use client"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTable } from "@gorro/ui/components/data-table"
import { listAddressReviewsAction } from "@/features/kyc-reviews/actions"
import { addressReviewsColumns } from "@/features/kyc-reviews/columns/address-reviews.columns"
import {
  addressReviewsDefaultFilters,
  addressReviewsTableFilters,
} from "@/features/kyc-reviews/table-filters"
import { QUERY_KEYS } from "@/lib/query-keys"

export function AddressReviewsPage() {
  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Address reviews"
        description="Oldest submissions first. Approve a matching utility bill to grant Tier 3, or reject it with a reason the customer can act on. Target is 24 hours."
      />
      <DataTable
        columns={addressReviewsColumns}
        fetchData={listAddressReviewsAction}
        queryKey={QUERY_KEYS.kycReviews.addressList}
        filters={addressReviewsTableFilters}
        defaultFilters={addressReviewsDefaultFilters}
      />
    </div>
  )
}
