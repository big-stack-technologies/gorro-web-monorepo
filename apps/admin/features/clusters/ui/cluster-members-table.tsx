"use client"

import { useState } from "react"
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
  CLUSTER_MEMBER_ROLE_LABELS,
  CLUSTER_MEMBER_STATUS_LABELS,
} from "@/features/clusters/constants"
import type { ClusterMember } from "@/features/clusters/types"
import { useClusterMembers } from "@/features/clusters/usecases"
import { ClusterStatusBadge } from "@/features/clusters/ui/cluster-status-badge"
import { RemoveClusterMemberDialog } from "@/features/clusters/ui/remove-cluster-member-dialog"
import { formatDateTime } from "@gorro/ui/utils"

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

  const members = membersQuery.data ?? []

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
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
                      {CLUSTER_MEMBER_ROLE_LABELS[member.role]}
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
      </div>

      <RemoveClusterMemberDialog
        clusterId={clusterId}
        member={selected}
        open={removeOpen}
        onOpenChange={setRemoveOpen}
      />
    </>
  )
}
