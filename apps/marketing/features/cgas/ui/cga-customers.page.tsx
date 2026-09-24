"use client"

import * as React from "react"
import Link from "next/link"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { Button } from "@gorro/ui/components/ui/button"
import { DataTable } from "@gorro/ui/components/data-table"

import {
  listCgaCustomersAction,
  listMarketingCgasAction,
} from "@/features/cgas/actions"
import { cgaCustomersColumns } from "@/features/cgas/columns/cga-customers.columns"
import { CgaAssignmentDialog } from "@/features/cgas/ui/cga-assignment-dialog"
import { CgaTargetDialog } from "@/features/cgas/ui/cga-target-dialog"
import type { CgaActionSubject } from "@/features/cgas/types"
import { QUERY_KEYS } from "@/lib/query-keys"
import { routes } from "@/lib/routes"
import { useQuery } from "@tanstack/react-query"

export function CgaCustomersPage({ userId }: { userId: string }) {
  const [targetOpen, setTargetOpen] = React.useState(false)
  const [assignOpen, setAssignOpen] = React.useState(false)

  const placement = useQuery({
    queryKey: [...QUERY_KEYS.cgas.list, userId],
    queryFn: async () => {
      const rows = await listMarketingCgasAction()
      return rows.find((row) => row.userId === userId) ?? null
    },
  })

  const cgaSubject: CgaActionSubject | null = placement.data
    ? {
        userId: placement.data.userId,
        name: placement.data.name,
        teamLead: placement.data.teamLead,
        territory: placement.data.territory,
      }
    : null

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title={placement.data?.name ?? "CGA customers"}
          description={`Attributed customers for this CGA. Total attributed: ${placement.data?.customersAttributed.toLocaleString() ?? "—"}.`}
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href={routes.cgas.list}>Back to CGAs</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!cgaSubject}
            onClick={() => setTargetOpen(true)}
          >
            Set target
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!cgaSubject}
            onClick={() => setAssignOpen(true)}
          >
            Assign
          </Button>
        </div>
      </div>

      <DataTable
        columns={cgaCustomersColumns}
        fetchData={(params) => listCgaCustomersAction(userId, params)}
        queryKey={QUERY_KEYS.cgas.customersList(userId)}
        emptyMessage="No attributed customers for this CGA."
      />

      <CgaTargetDialog
        cga={cgaSubject}
        open={targetOpen}
        onOpenChange={setTargetOpen}
      />
      <CgaAssignmentDialog
        cga={cgaSubject}
        open={assignOpen}
        onOpenChange={setAssignOpen}
      />
    </div>
  )
}
