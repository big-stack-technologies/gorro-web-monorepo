"use client"

import * as React from "react"
import { CheckIcon, Loader2Icon, SearchIcon } from "lucide-react"

import { getApiErrorMessage } from "@gorro/api/api-error"
import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { Input } from "@gorro/ui/components/ui/input"
import { Label } from "@gorro/ui/components/ui/label"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@gorro/ui/components/ui/toggle-group"
import { cn, formatNgn } from "@gorro/ui/utils"
import { listUsersAction } from "@/features/users/actions"
import type { User } from "@/features/users/types"
import type { FindCreditableWalletsParams } from "@/features/wallet-credits/actions"
import { WALLET_ACCOUNT_STATUS_LABELS } from "@/features/wallet-credits/constants"
import type { CreditableWallet } from "@/features/wallet-credits/types"
import { useCreditableWallets } from "@/features/wallet-credits/usecases"

type SearchMode = "customer" | "account"

type WalletCreditWalletPickerProps = {
  selectedWallet: CreditableWallet | null
  onSelectWallet: (wallet: CreditableWallet | null) => void
}

function userLabel(user: User) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ")
  return name || user.email || user.phoneNumber
}

function statusVariant(status: string) {
  if (status === "ACTIVE") return "success" as const
  if (status === "FROZEN") return "destructive" as const
  return "secondary" as const
}

export function WalletCreditWalletPicker({
  selectedWallet,
  onSelectWallet,
}: WalletCreditWalletPickerProps) {
  const [mode, setMode] = React.useState<SearchMode>("customer")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [accountNumber, setAccountNumber] = React.useState("")
  const [lookupParams, setLookupParams] =
    React.useState<FindCreditableWalletsParams | null>(null)
  const [userMatches, setUserMatches] = React.useState<User[]>([])
  const [pickedUserId, setPickedUserId] = React.useState<string | null>(null)
  const [lookupError, setLookupError] = React.useState<string | null>(null)
  const [findingUsers, setFindingUsers] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)

  const walletsQuery = useCreditableWallets(lookupParams)
  const wallets = walletsQuery.data ?? []
  const busy = findingUsers || walletsQuery.isLoading

  function resetResults() {
    onSelectWallet(null)
    setLookupError(null)
    setUserMatches([])
    setPickedUserId(null)
    setLookupParams(null)
    setHasSearched(false)
  }

  function changeMode(next: string) {
    if (next !== "customer" && next !== "account") return
    if (next === mode) return
    setMode(next)
    resetResults()
  }

  async function handleFind(event?: React.FormEvent) {
    event?.preventDefault()
    resetResults()

    if (mode === "account") {
      const account = accountNumber.trim()
      if (!account) {
        setLookupError("Enter an account number.")
        return
      }
      setHasSearched(true)
      setLookupParams({ accountNumber: account })
      return
    }

    const phoneValue = phone.trim()
    const emailValue = email.trim()
    if (!phoneValue && !emailValue) {
      setLookupError("Enter a phone number or email.")
      return
    }

    setFindingUsers(true)
    setHasSearched(true)
    try {
      const result = await listUsersAction({
        page: 1,
        limit: 10,
        ...(phoneValue ? { phoneNumber: phoneValue } : {}),
        ...(emailValue ? { email: emailValue } : {}),
      })
      if (result.data.length === 0) {
        setLookupError("No users matched that search.")
        return
      }
      if (result.data.length === 1) {
        const user = result.data[0]!
        setPickedUserId(user.id)
        setLookupParams({ userId: user.id })
        return
      }
      setUserMatches(result.data)
    } catch (error) {
      console.error("User search for wallet credit failed:", error)
      setLookupError(getApiErrorMessage(error))
    } finally {
      setFindingUsers(false)
    }
  }

  function pickUser(userId: string) {
    onSelectWallet(null)
    setPickedUserId(userId)
    setLookupParams({ userId })
    setHasSearched(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader>
          <CardTitle className="font-heading text-base">1. Find a wallet</CardTitle>
          <CardDescription>
            Search a customer, or paste the account number from their app or
            receipt. Ajo group pools are not listed — credit the member&apos;s
            Ajo wallet instead.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={(event) => void handleFind(event)}>
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={mode}
              onValueChange={changeMode}
              className="w-fit"
            >
              <ToggleGroupItem value="customer">Customer</ToggleGroupItem>
              <ToggleGroupItem value="account">Account number</ToggleGroupItem>
            </ToggleGroup>

            {mode === "customer" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="wc-phone">Phone</Label>
                  <Input
                    id="wc-phone"
                    inputMode="tel"
                    autoComplete="off"
                    placeholder="+234…"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="wc-email">Email</Label>
                  <Input
                    id="wc-email"
                    type="email"
                    autoComplete="off"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="wc-account">Account number</Label>
                <Input
                  id="wc-account"
                  autoComplete="off"
                  placeholder="8012345678"
                  value={accountNumber}
                  onChange={(event) => setAccountNumber(event.target.value)}
                />
              </div>
            )}

            {lookupError ? (
              <p className="text-sm text-destructive" role="alert">
                {lookupError}
              </p>
            ) : null}

            <div>
              <Button type="submit" disabled={busy}>
                {busy ? (
                  <Loader2Icon className="animate-spin" data-icon="inline-start" />
                ) : (
                  <SearchIcon data-icon="inline-start" />
                )}
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {userMatches.length > 1 ? (
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {userMatches.length} customers matched — pick one
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {userMatches.map((user) => {
              const active = pickedUserId === user.id
              return (
                <button
                  key={user.id}
                  type="button"
                  className={cn(
                    "flex flex-col gap-0.5 rounded-lg border px-3 py-2 text-left",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  )}
                  onClick={() => pickUser(user.id)}
                >
                  <span className="text-sm font-medium">{userLabel(user)}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.phoneNumber}
                    {user.email ? ` · ${user.email}` : ""}
                  </span>
                </button>
              )
            })}
          </CardContent>
        </Card>
      ) : null}

      {walletsQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(walletsQuery.error)}
        </p>
      ) : null}

      {walletsQuery.isLoading ? (
        <div className="flex flex-col gap-2" aria-busy="true">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      ) : null}

      {wallets.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">2. Choose where the money goes</p>
          <div className="flex flex-col gap-2" role="radiogroup" aria-label="Creditable wallets">
            {wallets.map((wallet) => {
              const selected =
                selectedWallet?.targetType === wallet.targetType &&
                selectedWallet.targetId === wallet.targetId
              return (
                <button
                  key={`${wallet.targetType}-${wallet.targetId}`}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border hover:bg-muted/40"
                  )}
                  onClick={() => onSelectWallet(wallet)}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input"
                    )}
                    aria-hidden
                  >
                    {selected ? <CheckIcon className="size-3" /> : null}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="font-medium">{wallet.label}</span>
                      <Badge variant={statusVariant(wallet.status)}>
                        {WALLET_ACCOUNT_STATUS_LABELS[wallet.status] ??
                          wallet.status}
                      </Badge>
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {wallet.accountNumber}
                    </span>
                    <span className="text-sm">
                      <span className="font-medium">{formatNgn(wallet.balance)}</span>
                      <span className="text-muted-foreground"> now</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {wallet.owner.name}
                      {wallet.owner.phoneNumber
                        ? ` · ${wallet.owner.phoneNumber}`
                        : ""}
                    </span>
                    {wallet.status === "FROZEN" ? (
                      <span className="text-xs text-destructive">
                        Frozen. The credit will land, but the customer cannot
                        move it until the wallet is unfrozen.
                      </span>
                    ) : null}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {hasSearched &&
      lookupParams &&
      !walletsQuery.isLoading &&
      !walletsQuery.isError &&
      wallets.length === 0 &&
      userMatches.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No creditable wallets for this search. Main wallets, Ajo wallets,
          active savings plans, and active clusters are the ones that can be
          credited.
        </p>
      ) : null}
    </div>
  )
}
