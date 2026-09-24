"use client"

import { Loader2Icon } from "lucide-react"

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
import type { User } from "@/features/users/types"
import { useResetUserPin } from "@/features/users/usecases"

type UserResetPinAlertDialogProps = {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserResetPinAlertDialog({
  user,
  open,
  onOpenChange,
}: UserResetPinAlertDialogProps) {
  const mutation = useResetUserPin(user.id)
  const pending = mutation.isPending

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset PIN?</AlertDialogTitle>
          <AlertDialogDescription>
            This will reset the transaction PIN for{" "}
            <span className="font-medium text-foreground">{user.email}</span>.
            The user will receive a temporary PIN. This action cannot be undone
            from here without another admin flow.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={(e) => {
              e.preventDefault()
              mutation.mutate(undefined, {
                onSuccess: () => onOpenChange(false),
              })
            }}
          >
            {pending ? (
              <Loader2Icon className="animate-spin" data-icon="inline-start" />
            ) : null}
            Reset PIN
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
