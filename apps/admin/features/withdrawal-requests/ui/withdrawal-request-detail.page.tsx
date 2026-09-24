"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { Button } from "@gorro/ui/components/ui/button"
import { routes } from "@/lib/routes"

import { WithdrawalRequestDetailsView } from "./withdrawal-request-details-view"

type WithdrawalRequestDetailPageProps = {
  withdrawalRequestId: string
}

export function WithdrawalRequestDetailPage({
  withdrawalRequestId,
}: WithdrawalRequestDetailPageProps) {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit gap-1.5 px-0" asChild>
          <Link href={routes.protected.withdrawalRequests.base}>
            <ArrowLeftIcon />
            Back to withdrawal requests
          </Link>
        </Button>
        <AdminPageHeader
          title="Withdrawal request details"
          description="Amount, recipient, bank details, and moderation status."
        />
        <p className="font-mono text-xs text-muted-foreground break-all">
          {withdrawalRequestId}
        </p>
      </div>
      <WithdrawalRequestDetailsView
        withdrawalRequestId={withdrawalRequestId}
      />
    </div>
  )
}
