"use client"

import type { ReactNode } from "react"
import { useState } from "react"

import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@gorro/ui/components/ui/dialog"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { canCreateVirtualAccount, canVerifyBvn } from "@/features/auth/access"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import type { User } from "@/features/users/types"
import { UserBvnVerificationPanel } from "@/features/users/ui/user-bvn-verification-panel"
import { UserCreateVirtualAccountDialog } from "@/features/users/ui/user-create-virtual-account-dialog"
import { UserWalletBalancePopover } from "@/features/users/ui/user-wallet-balance-popover"
import { getVirtualAccountEligibility } from "@/features/users/virtual-account-eligibility"
import { useGetUser } from "@/features/users/usecases"
import { isApiError } from "@gorro/api/api-error"
import {
  cn,
  formatCurrencyFromMinorUnits,
  formatDateTime,
  formatSnakeCaseWords,
  joinPartsOrEmDash,
} from "@gorro/ui/utils"

type UserDetailsDialogProps = {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

function DetailRow({
  label,
  value,
  className,
}: {
  label: string
  value: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-x-4 gap-y-1 border-b border-border/60 py-2.5 last:border-b-0 sm:grid-cols-[140px_1fr]",
        className
      )}
    >
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 wrap-break-word font-medium">{value}</dd>
    </div>
  )
}

function VerificationBadge({ verified }: { verified: boolean }) {
  return (
    <Badge variant={verified ? "outline" : "secondary"}>
      {verified ? "Verified" : "Not verified"}
    </Badge>
  )
}

export function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  const { data: profile } = useGetProfile()
  const canVerify = canVerifyBvn(profile?.roles)
  const canCreate = canCreateVirtualAccount(profile?.roles)
  const [createVirtualAccountOpen, setCreateVirtualAccountOpen] = useState(false)
  const { eligible, missingFields } = getVirtualAccountEligibility(user)

  const userQuery = useGetUser(user.id, open)
  const {
    data: userDetail,
    isPending: isUserLoading,
    isError: isUserError,
  } = userQuery

  const displayUser = userDetail ?? user

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>User details</DialogTitle>
          <DialogDescription className="truncate">{user.email}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[min(70vh,520px)] overflow-y-auto px-4">
          <dl className="py-2">
            <DetailRow label="Email" value={user.email ?? "—"} />
            <DetailRow
              label="Email verified"
              value={
                <VerificationBadge verified={displayUser.emailVerified} />
              }
            />
            <DetailRow label="Phone" value={user.phoneNumber ?? "—"} />
            <DetailRow
              label="Phone verified"
              value={
                <VerificationBadge verified={displayUser.phoneNumberVerified} />
              }
            />
            <DetailRow
              label="Name"
              value={joinPartsOrEmDash([
                user.firstName,
                user.middleName,
                user.lastName,
              ])}
            />
            <DetailRow
              label="Gender"
              value={user.gender === "unknown" ? "Unknown" : user.gender}
            />
            <DetailRow label="Role" value={formatSnakeCaseWords(user.role)} />
            <DetailRow label="NIN" value={user.nin ?? "—"} />
            <DetailRow label="BVN" value={user.bvn ?? "—"} />
          </dl>

          <div className="border-t border-border/60 py-4">
            <h3 className="mb-3 text-sm font-semibold">Identity verification</h3>
            <UserBvnVerificationPanel user={user} canVerify={canVerify} />
          </div>

          {canCreate ? (
            <div className="border-t border-border/60 py-4">
              <h3 className="mb-3 text-sm font-semibold">Virtual account</h3>
              {eligible ? (
                <p className="mb-3 text-sm text-muted-foreground">
                  Provision a funding account when automatic creation at KYC Tier
                  1 failed. Safe to retry — existing accounts return the same
                  details.
                </p>
              ) : (
                <p className="mb-3 text-sm text-muted-foreground">
                  Add {missingFields.join(", ")} before creating a virtual
                  account.
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!eligible}
                onClick={() => setCreateVirtualAccountOpen(true)}
              >
                Create virtual account
              </Button>
            </div>
          ) : null}

          <dl className="py-2">
            <DetailRow
              label="Accounts"
              value={
                isUserLoading ? (
                  <Skeleton className="inline-block h-4 w-12" />
                ) : isUserError || userDetail == null ? (
                  "—"
                ) : (
                  String(userDetail.accountCount)
                )
              }
            />
            <DetailRow
              label="Total balance"
              value={
                isUserLoading ? (
                  <Skeleton className="inline-block h-4 w-28" />
                ) : isUserError || userDetail == null ? (
                  "—"
                ) : (
                  formatCurrencyFromMinorUnits(userDetail.totalBalance)
                )
              }
            />
            <DetailRow label="Created" value={formatDateTime(user.createdAt)} />
            <DetailRow label="Updated" value={formatDateTime(user.updatedAt)} />
          </dl>

          {isUserError ? (
            <div className="flex flex-col gap-2 border-t border-border/60 py-4">
              <p className="text-sm text-destructive">
                {isApiError(userQuery.error)
                  ? userQuery.error.message
                  : "Could not load user details."}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => userQuery.refetch()}
              >
                Retry
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 border-t bg-muted/50 p-4">
          <UserWalletBalancePopover userId={user.id} />
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
      </Dialog>
      {canCreate ? (
        <UserCreateVirtualAccountDialog
          user={user}
          open={createVirtualAccountOpen}
          onOpenChange={setCreateVirtualAccountOpen}
        />
      ) : null}
    </>
  )
}
