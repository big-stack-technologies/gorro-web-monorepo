"use client"

import { useState } from "react"
import { Loader2Icon } from "lucide-react"

import { useGetProfile } from "@gorro/auth/use-get-profile"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@gorro/ui/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import { isSuperAdmin } from "@/features/auth/access"
import type { ContributorBackfillResult } from "@/features/clusters/types"
import { useBackfillClusterContributors } from "@/features/clusters/usecases"

function Summary({ result }: { result: ContributorBackfillResult }) {
  const stats = [
    ["Virtual accounts", result.virtualAccountsFound],
    ["Contributors", result.distinctContributors],
    [result.dryRun ? "To create" : "Created", result.toCreate],
    [result.dryRun ? "To reuse" : "Reused", result.toReuse],
    ["Linked to existing users", result.willLinkToExistingUsers],
  ] as const

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {stats.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="text-lg font-semibold tabular-nums">
            {value.toLocaleString()}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function ContributorBackfillCard() {
  const { data: profile } = useGetProfile()
  const mutation = useBackfillClusterContributors()
  const [result, setResult] = useState<ContributorBackfillResult | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!isSuperAdmin(profile?.roles)) return null

  function run(dryRun: boolean) {
    mutation.mutate(dryRun, {
      onSuccess: (data) => {
        setResult(data)
        if (!dryRun) setConfirmOpen(false)
      },
    })
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Contributor backfill</CardTitle>
        <CardDescription>
          One-time job. It turns historical external deposits into contributor
          records. Preview first. After it runs, some admin totals drop because
          those deposits move to the person who actually paid.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={mutation.isPending}
            onClick={() => run(true)}
          >
            {mutation.isPending && mutation.variables === true ? (
              <Loader2Icon data-icon="inline-start" className="animate-spin" />
            ) : null}
            Preview dry run
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={mutation.isPending || result?.dryRun !== true}
            onClick={() => setConfirmOpen(true)}
          >
            Run backfill
          </Button>
        </div>

        {result ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium">
              {result.dryRun ? "Dry run" : "Completed run"}
            </p>
            <Summary result={result} />

            {result.plan.length > 0 ? (
              <div className="max-h-72 overflow-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cluster</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Accounts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.plan.map((item, index) => (
                      <TableRow
                        key={`${item.clusterId ?? "cluster"}-${item.phoneNumber ?? index}`}
                      >
                        <TableCell>{item.clusterName ?? "—"}</TableCell>
                        <TableCell>{item.name ?? "—"}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {item.phoneNumber ?? "—"}
                        </TableCell>
                        <TableCell className="capitalize">
                          {item.outcome ?? "—"}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {item.virtualAccountCount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : null}

            {result.unparseable.length > 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">
                  Skipped phone numbers ({result.unparseable.length})
                </p>
                <ul className="max-h-40 space-y-1 overflow-auto text-sm text-muted-foreground">
                  {result.unparseable.map((item, index) => (
                    <li key={`${item.raw ?? item.phoneNumber ?? index}`}>
                      {item.phoneNumber ?? item.raw ?? "Unknown number"}
                      {item.clusterName ? ` · ${item.clusterName}` : ""}
                      {item.name ? ` · ${item.name}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {result.failures.length > 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-destructive">
                  Record failures ({result.failures.length})
                </p>
                <ul className="max-h-40 space-y-1 overflow-auto text-sm text-destructive">
                  {result.failures.map((item, index) => (
                    <li key={`${item.phoneNumber ?? index}`}>
                      {item.phoneNumber ?? "Unknown number"}
                      {item.message ? ` — ${item.message}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Run the contributor backfill?</AlertDialogTitle>
            <AlertDialogDescription>
              This writes contributor records and re-attributes past external
              deposits. Admin contribution totals will drop. The job is safe to
              repeat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={mutation.isPending}
              onClick={(event) => {
                event.preventDefault()
                run(false)
              }}
            >
              {mutation.isPending && mutation.variables === false ? (
                <Loader2Icon data-icon="inline-start" className="animate-spin" />
              ) : null}
              Run backfill
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
