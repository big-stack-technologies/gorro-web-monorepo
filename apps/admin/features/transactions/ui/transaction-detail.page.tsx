"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { Button } from "@gorro/ui/components/ui/button"
import { routes } from "@/lib/routes"

import { TransactionDetailsView } from "./transaction-details-view"

type TransactionDetailPageProps = {
  transactionId: string
}

export function TransactionDetailPage({ transactionId }: TransactionDetailPageProps) {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit gap-1.5 px-0" asChild>
          <Link href={routes.protected.transactions.base}>
            <ArrowLeftIcon />
            Back to transactions
          </Link>
        </Button>
        <AdminPageHeader
          title="Transaction details"
          description="Ledger lines, parties, and metadata."
        />
        <p className="font-mono text-xs text-muted-foreground break-all">
          {transactionId}
        </p>
      </div>
      <TransactionDetailsView transactionId={transactionId} />
    </div>
  )
}
