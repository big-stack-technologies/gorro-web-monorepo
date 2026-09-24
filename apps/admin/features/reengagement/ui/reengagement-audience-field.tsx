"use client"

import { useEffect, useMemo, useState } from "react"
import { CircleAlertIcon, RefreshCwIcon } from "lucide-react"
import type { FieldError as RHFFieldError } from "react-hook-form"

import { Button } from "@gorro/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@gorro/ui/components/ui/field"
import { Input } from "@gorro/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gorro/ui/components/ui/select"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  formatAudienceOptionLabel,
  findAudienceOption,
  getAudienceReachCount,
  getBalanceBelowParam,
  getDefaultBalanceBelow,
  type ReengagementAudienceChannel,
} from "@/features/reengagement/audience-utils"
import { useReengagementAudiences } from "@/features/reengagement/usecases"

type ReengagementAudienceFieldProps = {
  id: string
  channel: ReengagementAudienceChannel
  value: string | undefined
  onValueChange: (value: string) => void
  balanceBelow: number | undefined
  onBalanceBelowChange: (value: number | undefined) => void
  disabled?: boolean
  error?: RHFFieldError
}

export function ReengagementAudienceField({
  id,
  channel,
  value,
  onValueChange,
  balanceBelow,
  onBalanceBelowChange,
  disabled = false,
  error,
}: ReengagementAudienceFieldProps) {
  const [debouncedBalanceBelow, setDebouncedBalanceBelow] = useState<
    number | undefined
  >(balanceBelow)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedBalanceBelow(balanceBelow)
    }, 300)

    return () => window.clearTimeout(timer)
  }, [balanceBelow])

  const audiencesQuery = useReengagementAudiences(
    value === "LOW_BALANCE" && debouncedBalanceBelow != null
      ? { balanceBelow: debouncedBalanceBelow }
      : {},
    true
  )

  const { data, isLoading, isFetching, isError, error: queryError, refetch } =
    audiencesQuery

  const selectedAudience = useMemo(
    () => findAudienceOption(data?.audiences, value),
    [data?.audiences, value]
  )

  const balanceBelowParam = getBalanceBelowParam(selectedAudience)
  const showBalanceBelowInput = balanceBelowParam != null

  useEffect(() => {
    if (!data?.audiences.length) return

    const hasCurrentValue = value
      ? data.audiences.some((audience) => audience.value === value)
      : false

    if (!hasCurrentValue) {
      onValueChange(data.audiences[0]?.value ?? "")
    }
  }, [data?.audiences, onValueChange, value])

  useEffect(() => {
    if (!showBalanceBelowInput) return
    if (balanceBelow != null) return

    const defaultValue = getDefaultBalanceBelow(selectedAudience)
    if (defaultValue != null) {
      onBalanceBelowChange(defaultValue)
    }
  }, [
    balanceBelow,
    onBalanceBelowChange,
    selectedAudience,
    showBalanceBelowInput,
  ])

  const loading = isLoading || (isFetching && !data)
  const reachLabel = channel === "push" ? "push notifications" : "emails"

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>Audience</FieldLabel>

      {isError ? (
        <div role="alert" className="mb-3 space-y-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5">
          <div className="flex gap-2">
            <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div className="space-y-1 text-sm">
              <p className="font-medium text-destructive">
                Could not load audiences
              </p>
              <p className="text-muted-foreground">
                {queryError instanceof Error
                  ? queryError.message
                  : "Unknown error"}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => refetch()}
          >
            <RefreshCwIcon />
            Try again
          </Button>
        </div>
      ) : loading ? (
        <Skeleton className="h-9 w-full" />
      ) : (
        <Select
          value={value}
          onValueChange={onValueChange}
          disabled={disabled || !data?.audiences.length}
        >
          <SelectTrigger
            id={id}
            className="w-full min-w-0"
            aria-invalid={!!error}
          >
            <SelectValue placeholder="Select audience" />
          </SelectTrigger>
          <SelectContent>
            {data?.audiences.map((audience) => (
              <SelectItem key={audience.value} value={audience.value}>
                {formatAudienceOptionLabel(audience, channel)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedAudience ? (
        <FieldDescription className="space-y-1">
          <span>{selectedAudience.description}</span>
          <span className="block">
            {selectedAudience.matching.toLocaleString()} in audience ·{" "}
            {selectedAudience.withPushToken.toLocaleString()} push ·{" "}
            {selectedAudience.withEmail.toLocaleString()} email ·{" "}
            {Number.isInteger(selectedAudience.percentOfAllUsers)
              ? selectedAudience.percentOfAllUsers
              : selectedAudience.percentOfAllUsers.toFixed(1)}
            % of active users
          </span>
          <span className="block text-foreground/80">
            Sending will reach{" "}
            {getAudienceReachCount(selectedAudience, channel).toLocaleString()}{" "}
            {reachLabel}.
          </span>
        </FieldDescription>
      ) : null}

      {showBalanceBelowInput ? (
        <div className="mt-3 space-y-2">
          <FieldLabel htmlFor={`${id}-balance-below`}>
            Wallet threshold (₦)
          </FieldLabel>
          <Input
            id={`${id}-balance-below`}
            type="number"
            min={1}
            step={1}
            value={balanceBelow ?? ""}
            disabled={disabled}
            onChange={(event) => {
              const next = event.target.value
              onBalanceBelowChange(
                next === "" ? undefined : Number.parseInt(next, 10)
              )
            }}
          />
          {balanceBelowParam?.description ? (
            <FieldDescription>{balanceBelowParam.description}</FieldDescription>
          ) : null}
        </div>
      ) : null}

      <FieldError errors={[error]} />
    </Field>
  )
}
