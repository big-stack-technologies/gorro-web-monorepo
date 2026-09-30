"use client"

import { useState, type ReactNode } from "react"
import { RefreshCwIcon, UserMinusIcon } from "lucide-react"

import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import {
  CLUSTER_CURRENCY,
  CLUSTER_MEMBER_ROLE_LABELS,
  CLUSTER_MEMBER_STATUS_LABELS,
  formatContributorStatus,
  formatInviteRole,
} from "@/features/clusters/constants"
import type { ClusterMember } from "@/features/clusters/types"
import { useClusterMembers } from "@/features/clusters/usecases"
import { ClusterStatusBadge } from "@/features/clusters/ui/cluster-status-badge"
import { RemoveClusterMemberDialog } from "@/features/clusters/ui/remove-cluster-member-dialog"
import { formatCurrencyAmount, formatDateTime, formatSnakeCaseWords } from "@gorro/ui/utils"

function SectionTable({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-2">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="overflow-hidden rounded-lg border">{children}</div>
    </section>
  )
}

function contributorVariant(status: string) {
  if (status === "LINKED") return "success" as const
  if (status === "REVOKED") return "destructive" as const
  return "outline" as const
}

export function ClusterMembersTable({ clusterId }: { clusterId: string }) {
  const membersQuery = useClusterMembers(clusterId)
  const [selected, setSelected] = useState<ClusterMember | null>(null)
  const [removeOpen, setRemoveOpen] = useState(false)

  if (membersQuery.isLoading && !membersQuery.data) {
    return <Skeleton className="h-72 w-full rounded-lg" />
  }

  if (membersQuery.isError) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-center">
        <p className="text-sm text-destructive">
          {membersQuery.error instanceof Error
            ? membersQuery.error.message
            : "Could not load members"}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => membersQuery.refetch()}
        >
          <RefreshCwIcon data-icon="inline-start" />
          Retry
        </Button>
      </div>
    )
  }

  function handleRemove(member: ClusterMember) {
    setSelected(member)
    setRemoveOpen(true)
  }

  const members = membersQuery.data?.items ?? []
  const contributors = membersQuery.data?.contributors ?? []
  const pendingInvites = membersQuery.data?.pendingInvites ?? []

  return (
    <div className="flex flex-col gap-6">
      <SectionTable
        title={`Members (${membersQuery.data?.totalMembers ?? members.length})`}
        description="People with a Gorro account in this cluster."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No members found.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <p className="font-medium">{member.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {member.phoneNumber}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {CLUSTER_MEMBER_ROLE_LABELS[member.role] ??
                        formatSnakeCaseWords(member.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ClusterStatusBadge status={member.status} />
                    <span className="sr-only">
                      {CLUSTER_MEMBER_STATUS_LABELS[member.status]}
                    </span>
                  </TableCell>
                  <TableCell>{formatDateTime(member.joinedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={
                        member.role === "OWNER" || member.status === "REMOVED"
                      }
                      onClick={() => handleRemove(member)}
                      aria-label={`Remove ${member.fullName}`}
                      title={
                        member.role === "OWNER"
                          ? "The owner cannot be removed"
                          : "Remove member"
                      }
                    >
                      <UserMinusIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </SectionTable>

      <PeopleByPhoneTable
        title={`Contributors (${membersQuery.data?.totalContributors ?? contributors.length})`}
        description="Phone numbers tracked without a Gorro account. Contributions stay with the number if they later sign up."
        emptyMessage="No contributors."
        rows={contributors.map((contributor) => ({
          id: contributor.contributorId,
          name: contributor.name,
          phoneNumber: contributor.phoneNumber,
          detail: contributor.userId ? "Linked to an account" : "No account yet",
          badge: formatContributorStatus(contributor.status),
          badgeVariant: contributorVariant(contributor.status),
          totalContributed: contributor.totalContributed,
        }))}
      />

      <PeopleByPhoneTable
        title={`Pending invites (${membersQuery.data?.totalPendingInvites ?? pendingInvites.length})`}
        description="Invited by phone. Admin or member rights start when they verify that number, not when they register."
        emptyMessage="No pending invites."
        rows={pendingInvites.map((invite) => ({
          id: invite.inviteId,
          name: invite.name,
          phoneNumber: invite.phoneNumber,
          detail: formatInviteRole(invite.pendingRole),
          badge: formatSnakeCaseWords(invite.status),
          badgeVariant: "outline" as const,
          totalContributed: invite.totalContributed,
        }))}
      />

      <RemoveClusterMemberDialog
        clusterId={clusterId}
        member={selected}
        open={removeOpen}
        onOpenChange={setRemoveOpen}
      />
    </div>
  )
}

function PeopleByPhoneTable({
  title,
  description,
  emptyMessage,
  rows,
}: {
  title: string
  description: string
  emptyMessage: string
  rows: {
    id: string
    name: string | null
    phoneNumber: string
    detail: string
    badge: string
    badgeVariant: "success" | "destructive" | "outline"
    totalContributed: number
  }[]
}) {
  return (
    <SectionTable title={title} description={description}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Contributed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-16 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <p className="font-medium">{row.name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{row.detail}</p>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {row.phoneNumber}
                </TableCell>
                <TableCell>
                  <Badge variant={row.badgeVariant}>{row.badge}</Badge>
                </TableCell>
                <TableCell>
                  {formatCurrencyAmount(row.totalContributed, CLUSTER_CURRENCY)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </SectionTable>
  )
}
