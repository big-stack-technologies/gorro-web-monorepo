"use client"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTable } from "@gorro/ui/components/data-table"
import { QUERY_KEYS } from "@/lib/query-keys"
import { listUsersAction } from "@/features/users/actions"
import { usersColumns } from "@/features/users/columns"
import { usersTableFilters } from "@/features/users/table-filters"
import { UsersAnalyticsSection } from "@/features/users/ui/users-analytics-summary"
import { UsersKycTierSection } from "@/features/users/ui/users-kyc-tier-section"

export function UsersPage() {
  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Users"
        description="View and manage user accounts. Analytics reflect the latest summary from the server."
      />
      <UsersAnalyticsSection />
      <UsersKycTierSection />
      <DataTable
        columns={usersColumns}
        fetchData={listUsersAction}
        queryKey={QUERY_KEYS.users.list}
        filters={usersTableFilters}
      />
    </div>
  )
}
