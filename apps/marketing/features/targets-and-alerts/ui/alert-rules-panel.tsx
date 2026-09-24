"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import { Label } from "@gorro/ui/components/ui/label"
import { Switch } from "@gorro/ui/components/ui/switch"
import { cn } from "@gorro/ui/utils"

import { CgaSortableTable } from "@/features/cgas/ui/cga-sortable-table"
import {
  alertRuleSeverityLabel,
  formatAlertRuleThreshold,
} from "@/features/targets-and-alerts/constants"
import type { MarketingAlertRule } from "@/features/targets-and-alerts/types"
import { AlertRuleEditDialog } from "@/features/targets-and-alerts/ui/alert-rule-edit-dialog"
import {
  useAlertRules,
  useUpdateAlertRule,
} from "@/features/targets-and-alerts/usecases"
import { SectionError } from "@/features/overview/ui/section"

function severityBadgeVariant(severity: string) {
  if (severity === "HIGH") return "destructive" as const
  if (severity === "LOW") return "secondary" as const
  return "outline" as const
}

function AlertRuleEnabledSwitch({ rule }: { rule: MarketingAlertRule }) {
  const mutation = useUpdateAlertRule(rule.code)

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={`alert-rule-${rule.code}-enabled`}
        checked={rule.enabled}
        disabled={mutation.isPending}
        onCheckedChange={(checked) => mutation.mutate({ enabled: checked })}
        aria-label={`Enable ${rule.label}`}
      />
      <Label
        htmlFor={`alert-rule-${rule.code}-enabled`}
        className="font-normal text-muted-foreground"
      >
        {rule.enabled ? "On" : "Off"}
      </Label>
    </div>
  )
}

export function AlertRulesPanel() {
  const rulesQuery = useAlertRules()
  const [editRule, setEditRule] = React.useState<MarketingAlertRule | null>(
    null
  )
  const [editOpen, setEditOpen] = React.useState(false)

  const columns = React.useMemo<ColumnDef<MarketingAlertRule>[]>(
    () => [
      {
        accessorKey: "label",
        header: "Rule",
        cell: ({ row }) => {
          const rule = row.original
          return (
            <div className="space-y-1">
              <p
                className={cn(
                  "font-medium",
                  !rule.enabled && "text-muted-foreground line-through"
                )}
              >
                {rule.label}
              </p>
              <p className="text-xs text-muted-foreground">{rule.code}</p>
            </div>
          )
        },
      },
      {
        accessorKey: "severity",
        header: "Severity",
        cell: ({ row }) => (
          <Badge variant={severityBadgeVariant(row.original.severity)}>
            {alertRuleSeverityLabel(row.original.severity)}
          </Badge>
        ),
      },
      {
        id: "threshold",
        header: "Threshold",
        cell: ({ row }) =>
          formatAlertRuleThreshold(
            row.original.unit,
            row.original.threshold
          ),
      },
      {
        id: "flags",
        header: "Flags",
        cell: ({ row }) =>
          row.original.isDefault ? (
            <Badge variant="secondary">Default</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        id: "enabled",
        header: "Enabled",
        cell: ({ row }) => <AlertRuleEnabledSwitch rule={row.original} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setEditRule(row.original)
              setEditOpen(true)
            }}
          >
            Edit
          </Button>
        ),
      },
    ],
    []
  )

  return (
    <section aria-label="Alert rules" className="flex flex-col gap-4">
      <div>
        <h2 className="font-heading text-base font-semibold tracking-tight">
          Alert rules
        </h2>
        <p className="text-sm text-muted-foreground">
          Tune thresholds or disable rules. Disabled rules remain visible here
          but won&apos;t appear in the overview alerts panel.
        </p>
      </div>

      {rulesQuery.error ? (
        <SectionError
          error={rulesQuery.error}
          onRetry={() => void rulesQuery.refetch()}
        />
      ) : (
        <CgaSortableTable
          data={rulesQuery.data ?? []}
          columns={columns}
          isLoading={rulesQuery.isLoading}
          emptyMessage="No alert rules returned from the API."
          defaultSorting={[{ id: "label", desc: false }]}
        />
      )}

      <AlertRuleEditDialog
        rule={editRule}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </section>
  )
}
