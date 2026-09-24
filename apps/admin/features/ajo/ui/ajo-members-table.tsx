"use client"

import { useState } from "react"
import { UserMinusIcon } from "lucide-react"

import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import { AJO_CURRENCY } from "@/features/ajo/constants"
import {
  canRemoveAjoMember,
  getAjoMemberRemovalBlockReason,
} from "@/features/ajo/member-removal"
import type { AjoGroupMember, AjoGroupStatus } from "@/features/ajo/types"
import { RemoveAjoGroupMemberDialog } from "@/features/ajo/ui/remove-ajo-group-member-dialog"
import { formatCurrencyAmount, emptyAsNa } from "@gorro/ui/utils"

type AjoMembersTableProps = {
  groupId: string
  groupStatus: AjoGroupStatus
  members: AjoGroupMember[]
  canRemove: boolean
}

export function AjoMembersTable({
  groupId,
  groupStatus,
  members,
  canRemove,
}: AjoMembersTableProps) {
  const [selectedMember, setSelectedMember] = useState<AjoGroupMember | null>(
    null
  )
  const [removeOpen, setRemoveOpen] = useState(false)

  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No members in this group.</p>
    )
  }

  function handleRemove(member: AjoGroupMember) {
    setSelectedMember(member)
    setRemoveOpen(true)
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Slots</TableHead>
              <TableHead>Contributed</TableHead>
              <TableHead>Defaults</TableHead>
              <TableHead>Outstanding</TableHead>
              <TableHead>Flags</TableHead>
              {canRemove ? (
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const removable = canRemoveAjoMember(member, groupStatus)
              const blockReason = getAjoMemberRemovalBlockReason(
                member,
                groupStatus
              )

              return (
                <TableRow key={member.memberId}>
                  <TableCell>
                    <div className="min-w-36">
                      <p className="font-medium">{member.name}</p>
                      {member.isRecipient ? (
                        <Badge variant="outline" className="mt-1">
                          Current recipient
                        </Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.slotsHeld}</TableCell>
                  <TableCell>
                    {formatCurrencyAmount(member.totalContributed, AJO_CURRENCY)}
                  </TableCell>
                  <TableCell>{member.defaultCount}</TableCell>
                  <TableCell>
                    {formatCurrencyAmount(member.outstandingOwed, AJO_CURRENCY)}
                  </TableCell>
                  <TableCell>
                    {member.flagged ? (
                      <Badge variant="destructive">Flagged</Badge>
                    ) : (
                      emptyAsNa(null)
                    )}
                  </TableCell>
                  {canRemove ? (
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={!removable}
                        onClick={() => handleRemove(member)}
                        aria-label={`Remove ${member.name}`}
                        title={blockReason ?? "Remove member"}
                      >
                        <UserMinusIcon />
                      </Button>
                    </TableCell>
                  ) : null}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <RemoveAjoGroupMemberDialog
        groupId={groupId}
        member={selectedMember}
        open={removeOpen}
        onOpenChange={setRemoveOpen}
      />
    </>
  )
}
