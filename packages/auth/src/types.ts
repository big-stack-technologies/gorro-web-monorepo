export type AuthProfile = {
  id: string
  email: string
  phoneNumber: string
  firstName: string | null
  middleName: string | null
  lastName: string | null
  gender: string
  hasTransactionPin: boolean
  dateOfBirth: string | null
  address: string | null
  roles: string[]
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  /** Access token lifetime in seconds */
  expiresIn: number
}

export type LogoutResponse = {
  status: "ok"
}

export type LoginActionState = {
  error?: string
  fieldErrors?: {
    email?: string
    password?: string
  }
}

export type LoginAction = (
  prevState: LoginActionState,
  formData: FormData
) => Promise<LoginActionState>
