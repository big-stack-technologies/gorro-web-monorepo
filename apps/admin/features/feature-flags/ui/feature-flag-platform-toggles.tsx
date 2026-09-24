"use client"

import { Label } from "@gorro/ui/components/ui/label"
import { Switch } from "@gorro/ui/components/ui/switch"
import type { FeatureFlag } from "@/features/feature-flags/types"
import { useUpdateFeatureFlag } from "@/features/feature-flags/usecases"

type FeatureFlagPlatformTogglesProps = {
  flag: FeatureFlag
  canEdit: boolean
}

export function FeatureFlagPlatformToggles({
  flag,
  canEdit,
}: FeatureFlagPlatformTogglesProps) {
  const mutation = useUpdateFeatureFlag(flag.key)
  const pending = mutation.isPending

  const handleAndroidChange = (checked: boolean) => {
    if (!canEdit || pending) return
    mutation.mutate({
      androidEnabled: checked,
      iosEnabled: flag.iosEnabled,
    })
  }

  const handleIosChange = (checked: boolean) => {
    if (!canEdit || pending) return
    mutation.mutate({
      androidEnabled: flag.androidEnabled,
      iosEnabled: checked,
    })
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex items-center gap-2">
        <Switch
          id={`${flag.key}-android`}
          checked={flag.androidEnabled}
          disabled={!canEdit || pending}
          onCheckedChange={handleAndroidChange}
          aria-label={`Android for ${flag.key}`}
        />
        <Label
          htmlFor={`${flag.key}-android`}
          className="font-normal text-muted-foreground"
        >
          Android
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id={`${flag.key}-ios`}
          checked={flag.iosEnabled}
          disabled={!canEdit || pending}
          onCheckedChange={handleIosChange}
          aria-label={`iOS for ${flag.key}`}
        />
        <Label
          htmlFor={`${flag.key}-ios`}
          className="font-normal text-muted-foreground"
        >
          iOS
        </Label>
      </div>
    </div>
  )
}
