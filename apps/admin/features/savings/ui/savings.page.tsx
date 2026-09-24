"use client"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTable } from "@gorro/ui/components/data-table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gorro/ui/components/ui/tabs"
import { isPartnerOnly } from "@/features/auth/access"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { listSavingsAccountsAction } from "@/features/savings/actions"
import { savingsAccountsColumns } from "@/features/savings/columns"
import { savingsAccountsTableFilters } from "@/features/savings/table-filters"
import { SavingsMetricsSection } from "@/features/savings/ui/savings-metrics-section"
import { SavingsRatesSection } from "@/features/savings/ui/savings-rates-section"
import { QUERY_KEYS } from "@/lib/query-keys"

export function SavingsPage() {
  const { data: profile } = useGetProfile()
  const partnerOnly = isPartnerOnly(profile?.roles)

  if (partnerOnly) {
    return (
      <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
        <AdminPageHeader
          title="Savings"
          description="Monitor savings metrics and product performance."
        />
        <SavingsMetricsSection />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Savings"
        description="Monitor savings metrics, browse accounts, and manage interest rates and WHT."
      />

      <Tabs defaultValue="overview" className="gap-6">
        <TabsList className="h-9 w-fit justify-start">
          <TabsTrigger value="overview" className="flex-none text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex-none text-xs sm:text-sm">
            Accounts
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex-none text-xs sm:text-sm">
            Rates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <SavingsMetricsSection />
        </TabsContent>

        <TabsContent value="accounts" className="mt-0">
          <DataTable
            columns={savingsAccountsColumns}
            fetchData={listSavingsAccountsAction}
            queryKey={QUERY_KEYS.savings.accounts.list}
            filters={savingsAccountsTableFilters}
            emptyMessage="No savings accounts match your filters."
          />
        </TabsContent>

        <TabsContent value="rates" className="mt-0">
          <SavingsRatesSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
