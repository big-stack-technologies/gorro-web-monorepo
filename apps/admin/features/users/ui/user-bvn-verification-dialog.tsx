"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@gorro/ui/components/ui/dialog"
import type { User } from "@/features/users/types"
import { UserBvnVerificationPanel } from "@/features/users/ui/user-bvn-verification-panel"

type UserBvnVerificationDialogProps = {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  canVerify: boolean
}

export function UserBvnVerificationDialog({
  user,
  open,
  onOpenChange,
  canVerify,
}: UserBvnVerificationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Verify BVN</DialogTitle>
          <DialogDescription className="truncate">
            {user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[min(70vh,520px)] overflow-y-auto px-4 py-4">
          <UserBvnVerificationPanel user={user} canVerify={canVerify} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
