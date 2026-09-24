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
import { Textarea } from "@gorro/ui/components/ui/textarea"

import type {
  CommunityMemberSkippedItem,
  MarketingCommunity,
} from "@/features/communities/types"
import {
  useLinkCommunityMembers,
  useUnlinkCommunityMember,
} from "@/features/communities/usecases"

type CommunityMembersDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  community: MarketingCommunity | null
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function parseUserIds(raw: string): string[] {
  const tokens = raw
    .split(/[\s,;]+/)
    .map((part) => part.trim())
    .filter(Boolean)
  return [...new Set(tokens)]
}

function formatSkippedItem(item: CommunityMemberSkippedItem) {
  if (typeof item === "string") return item
  const label = item.name?.trim() || item.userId
  const reason = item.reason?.trim()
  return reason ? `${label} — ${reason}` : label
}

function skippedItemKey(item: CommunityMemberSkippedItem, index: number) {
  return typeof item === "string" ? item : item.userId || String(index)
}

export function CommunityMembersDialog({
  open,
  onOpenChange,
  community,
}: CommunityMembersDialogProps) {
  const communityId = community?.id ?? ""
  const linkMembers = useLinkCommunityMembers(communityId)
  const unlinkMember = useUnlinkCommunityMember(communityId)

  const [userIdsRaw, setUserIdsRaw] = useState("")
  const [unlinkUserId, setUnlinkUserId] = useState("")
  const [lastSkipped, setLastSkipped] = useState<CommunityMemberSkippedItem[]>(
    []
  )
  const [parseError, setParseError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserIdsRaw("")
      setUnlinkUserId("")
      setLastSkipped([])
      setParseError(null)
    }
  }, [open, community?.id])

  const pending = linkMembers.isPending || unlinkMember.isPending

  const handleLink = () => {
    setParseError(null)
    setLastSkipped([])
    const userIds = parseUserIds(userIdsRaw)
    if (userIds.length === 0) {
      setParseError("Enter at least one user ID.")
      return
    }
    const invalid = userIds.filter((id) => !UUID_PATTERN.test(id))
    if (invalid.length > 0) {
      setParseError(
        `Invalid UUID${invalid.length === 1 ? "" : "s"}: ${invalid.slice(0, 3).join(", ")}${invalid.length > 3 ? "…" : ""}`
      )
      return
    }
    linkMembers.mutate(
      { userIds },
      {
        onSuccess: (result) => {
          setLastSkipped(result.skipped)
          if (result.skipped.length === 0) {
            setUserIdsRaw("")
          }
        },
      }
    )
  }

  const handleUnlink = () => {
    setParseError(null)
    const userId = unlinkUserId.trim()
    if (!userId) {
      setParseError("Enter a user ID to unlink.")
      return
    }
    if (!UUID_PATTERN.test(userId)) {
      setParseError("Enter a valid user UUID to unlink.")
      return
    }
    unlinkMember.mutate(userId, {
      onSuccess: () => setUnlinkUserId(""),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage members</DialogTitle>
          <DialogDescription>
            {community ? (
              <>
                Link customers to <strong>{community.name}</strong>. Each
                customer can belong to at most one community; IDs already linked
                elsewhere are returned as skipped. There is no list-members API —
                unlink by user ID below.
              </>
            ) : (
              "Select a community."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="community-member-ids">User IDs to link</Label>
            <Textarea
              id="community-member-ids"
              rows={5}
              placeholder="One UUID per line or comma-separated"
              value={userIdsRaw}
              onChange={(event) => setUserIdsRaw(event.target.value)}
              disabled={pending || !community}
            />
            <Button
              type="button"
              onClick={handleLink}
              disabled={pending || !community}
            >
              {linkMembers.isPending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : null}
              Link members
            </Button>
          </div>

          {lastSkipped.length > 0 ? (
            <div className="rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
              <p className="font-medium text-amber-900 dark:text-amber-100">
                Skipped ({lastSkipped.length})
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                {lastSkipped.map((item, index) => (
                  <li key={skippedItemKey(item, index)}>
                    {formatSkippedItem(item)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 border-t pt-4">
            <Label htmlFor="community-unlink-user-id">Unlink user ID</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="community-unlink-user-id"
                placeholder="Customer UUID"
                value={unlinkUserId}
                onChange={(event) => setUnlinkUserId(event.target.value)}
                disabled={pending || !community}
                className="min-w-0 flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleUnlink}
                disabled={pending || !community}
              >
                {unlinkMember.isPending ? (
                  <Loader2Icon
                    className="animate-spin"
                    data-icon="inline-start"
                  />
                ) : null}
                Unlink
              </Button>
            </div>
          </div>

          {parseError ? (
            <p className="text-sm text-destructive" role="alert">
              {parseError}
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
