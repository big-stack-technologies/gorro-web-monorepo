"use client"

import { CheckIcon } from "lucide-react"

import { CopyableTruncatedId } from "@gorro/ui/components/copyable-truncated-id"
import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { formatNgn } from "@gorro/ui/utils"
import type { CreditWalletResult } from "@/features/wallet-credits/types"

type CreditWalletResultCardProps = {
  result: CreditWalletResult
  onCreditAnother: () => void
}

export function CreditWalletResultCard({
  result,
  onCreditAnother,
}: CreditWalletResultCardProps) {
  return (
    <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="success">
            <CheckIcon data-icon="inline-start" />
            Posted
          </Badge>
        </div>
        <CardTitle className="font-heading text-2xl">
          {formatNgn(result.amount)} credited
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <p>
          {result.owner.name} · {result.label}
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          {result.accountNumber}
        </p>
        <p>
          New balance{" "}
          <span className="font-medium">{formatNgn(result.newBalance)}</span>
        </p>
        <p className="flex flex-wrap items-center gap-2 text-muted-foreground">
          Transaction <CopyableTruncatedId value={result.transactionId} />
        </p>
      </CardContent>
      <CardFooter className="border-t">
        <Button type="button" variant="outline" onClick={onCreditAnother}>
          Credit another wallet
        </Button>
      </CardFooter>
    </Card>
  )
}
