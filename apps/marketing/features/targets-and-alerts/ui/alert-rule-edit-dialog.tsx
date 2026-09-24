"use client"

import { useEffect, useState } from "react"
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
import { Switch } from "@gorro/ui/components/ui/switch"

import {
  alertRuleSeverityLabel,
  formatAlertRuleThreshold,
} from "@/features/targets-and-alerts/constants"
import type { MarketingAlertRule } from "@/features/targets-and-alerts/types"
import { useUpdateAlertRule } from "@/features/targets-and-alerts/usecases"

type AlertRuleEditDialogProps = {
  rule: MarketingAlertRule | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AlertRuleEditDialog({
  rule,
  open,
  onOpenChange,
}: AlertRuleEditDialogProps) {
  const mutation = useUpdateAlertRule(rule?.code ?? "")
  const [threshold, setThreshold] = useState("")
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (!rule) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThreshold(String(rule.threshold))
    setEnabled(rule.enabled)
  }, [rule])

  if (!rule) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>{rule.label}</DialogTitle>
          <DialogDescription>
            {alertRuleSeverityLabel(rule.severity)} severity · Unit: {rule.unit}
            {rule.isDefault ? " · Default threshold" : ""}
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col"
          onSubmit={(event) => {
            event.preventDefault()
            const value = Number(threshold)
            if (!Number.isFinite(value)) return
            mutation.mutate(
              { threshold: value, enabled },
              { onSuccess: () => onOpenChange(false) }
            )
          }}
        >
          <div className="space-y-4 px-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="alert-rule-threshold">
              Threshold ({formatAlertRuleThreshold(rule.unit, rule.threshold)}{" "}
              current)
            </Label>
            <Input
              id="alert-rule-threshold"
              type="number"
              step="any"
              value={threshold}
              onChange={(event) => setThreshold(event.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
            <div className="space-y-0.5">
              <Label htmlFor="alert-rule-enabled">Enabled</Label>
              <p className="text-xs text-muted-foreground">
                Disabled rules stay listed but do not trigger overview alerts.
              </p>
            </div>
            <Switch
              id="alert-rule-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
              disabled={mutation.isPending}
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
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
