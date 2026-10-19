"use client"

import * as React from "react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTable } from "@gorro/ui/components/data-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gorro/ui/components/ui/tabs"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { USER_ROLE } from "@/features/users/constants"
import { listWalletCreditsAction } from "@/features/wallet-credits/actions"
import { walletCreditsColumns } from "@/features/wallet-credits/columns/wallet-credits.columns"
import { walletCreditsTableFilters } from "@/features/wallet-credits/table-filters"
import { CreditWalletForm } from "@/features/wallet-credits/ui/credit-wallet-form"
import { CreditWalletResultCard } from "@/features/wallet-credits/ui/credit-wallet-result-card"
import { WalletCreditWalletPicker } from "@/features/wallet-credits/ui/wallet-credit-wallet-picker"
import type {
  CreditableWallet,
  CreditWalletResult,
} from "@/features/wallet-credits/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function WalletCreditsPage() {
  const { data: profile } = useGetProfile()
  const isSuperAdmin =
    profile?.roles?.includes(USER_ROLE.super_admin) === true

  const [selectedWallet, setSelectedWallet] =
    React.useState<CreditableWallet | null>(null)
  const [lastResult, setLastResult] = React.useState<CreditWalletResult | null>(
    null
  )

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
        <AdminPageHeader
          title="Wallet credits"
          description="Manual credits into customer wallets."
        />
        <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
          <CardHeader>
            <CardTitle className="font-heading text-base">Restricted</CardTitle>
            <CardDescription>
              Only super admins can search wallets, post credits, or reverse
              them.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Wallet credits"
        description="Credit main wallets, Ajo wallets, savings plans, or clusters. Every credit is categorized for finance reconciliation."
      />

      <Tabs defaultValue="credit" className="gap-6">
        <TabsList className="h-9 w-fit justify-start">
          <TabsTrigger value="credit" className="flex-none text-xs sm:text-sm">
            New credit
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-none text-xs sm:text-sm">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="credit" className="mt-0">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,40rem)]">
            <WalletCreditWalletPicker
              selectedWallet={selectedWallet}
              onSelectWallet={(wallet) => {
                setSelectedWallet(wallet)
                if (wallet) setLastResult(null)
              }}
            />
            <div className="lg:sticky lg:top-4">
              {lastResult ? (
                <CreditWalletResultCard
                  result={lastResult}
                  onCreditAnother={() => setLastResult(null)}
                />
              ) : selectedWallet ? (
                <CreditWalletForm
                  wallet={selectedWallet}
                  onCredited={(result) => {
                    setLastResult(result)
                    setSelectedWallet(null)
                  }}
                />
              ) : (
                <Card className="border-dashed border-border/80">
                  <CardHeader>
                    <CardTitle className="font-heading text-base">
                      Credit
                    </CardTitle>
                    <CardDescription>
                      Pick a wallet on the left. The amount, category, and
                      confirmation stay here so you can see who receives the
                      money.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      No wallet selected.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <DataTable
            columns={walletCreditsColumns}
            fetchData={listWalletCreditsAction}
            queryKey={QUERY_KEYS.walletCredits.list}
            filters={walletCreditsTableFilters}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
