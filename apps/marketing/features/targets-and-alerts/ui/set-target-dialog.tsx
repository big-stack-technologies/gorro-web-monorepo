"use client"

import { useState } from "react"
import { Loader2Icon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@gorro/ui/components/ui/dialog"
import { Input } from "@gorro/ui/components/ui/input"
import { Label } from "@gorro/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gorro/ui/components/ui/select"

import { MARKETING_TARGET_METRICS } from "@/features/targets-and-alerts/constants"
import { useSetMarketingTarget } from "@/features/targets-and-alerts/usecases"

type SetTargetDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function defaultPeriodMonth() {
  const now = new Date()
  const month = String(now.getUTCMonth() + 1).padStart(2, "0")
  return `${now.getUTCFullYear()}-${month}`
}

export function SetTargetDialog({ open, onOpenChange }: SetTargetDialogProps) {
  const mutation = useSetMarketingTarget()
  const [metric, setMetric] = useState("registered_users")
  const [periodMonth, setPeriodMonth] = useState(defaultPeriodMonth())
  const [targetValue, setTargetValue] = useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Set monthly target</DialogTitle>
          <DialogDescription>
            Org-wide marketing targets. Rates are whole percentages; counts and
            GTV are absolute values. The month is pinned to the 1st in UTC.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col"
          onSubmit={(event) => {
            event.preventDefault()
            const value = Number(targetValue)
            if (!Number.isFinite(value)) return
            const [year, month] = periodMonth.split("-")
            mutation.mutate(
              {
                metric,
                periodMonth: `${year}-${month}-01`,
                targetValue: value,
              },
              {
                onSuccess: () => {
                  setTargetValue("")
                  onOpenChange(false)
                },
              }
            )
          }}
        >
          <div className="space-y-4 px-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="marketing-target-metric">Metric</Label>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger id="marketing-target-metric" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MARKETING_TARGET_METRICS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketing-target-month">Month</Label>
            <Input
              id="marketing-target-month"
              type="month"
              value={periodMonth}
              onChange={(event) => setPeriodMonth(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketing-target-value">Target value</Label>
            <Input
              id="marketing-target-value"
              type="number"
              min={0}
              step="any"
              value={targetValue}
              onChange={(event) => setTargetValue(event.target.value)}
              required
            />
          </div>
          </div>

          <div className="flex justify-end gap-2 border-t px-4 py-4">
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : null}
              Save target
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
