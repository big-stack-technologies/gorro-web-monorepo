import type { VirtualAccountData } from "@/features/users/types"
import { emptyAsNa } from "@gorro/ui/utils"

type VirtualAccountDetailsProps = {
  account: VirtualAccountData
}

export function VirtualAccountDetails({ account }: VirtualAccountDetailsProps) {
  const { nuban } = account

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-border/60 bg-muted/30 px-3 py-2.5 text-sm">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          NUBAN account
        </p>
        <p className="mt-1 font-mono font-medium">{nuban.accountNumber}</p>
        <p className="truncate text-muted-foreground">
          {emptyAsNa(nuban.accountName)}
        </p>
        <p className="text-muted-foreground">
          {nuban.bankName} ({nuban.bankCode})
        </p>
      </div>
      <div className="flex items-start justify-between gap-3 text-sm">
        <span className="text-muted-foreground">Internal account</span>
        <span className="font-mono text-xs font-medium">
          {account.internalAccountNumber}
        </span>
      </div>
    </div>
  )
}
