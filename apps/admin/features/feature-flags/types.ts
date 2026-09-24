export type FeatureFlag = {
  id: string
  key: string
  description: string
  androidEnabled: boolean
  iosEnabled: boolean
  updatedAt: string
}

export type UpdateFeatureFlagPayload = {
  androidEnabled?: boolean
  iosEnabled?: boolean
}
