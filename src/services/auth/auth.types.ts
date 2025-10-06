export type LoginArgs = {
  email: string
  password: string
  rememberMe?: boolean
}

export type AuthMeResponseType = {
  avatar: string
  created: string
  email: string
  id: string
  isEmailVerified: true
  name: string
  updated: string
}

export type UpdateUser = {
  avatar?: File | null
  name?: string
}

export type VerifyUserEmailRequest = {
  code: string
}
