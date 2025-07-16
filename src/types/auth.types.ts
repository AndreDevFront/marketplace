export interface User {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly createdAt?: string
  readonly updatedAt?: string
}


export interface LoginCredentials {
  readonly email: string
  readonly password: string
}

export interface RegisterData {
  readonly name: string
  readonly email: string
  readonly password: string
}

export interface AuthResponse {
  readonly token: string
  readonly user: User
}

export interface UserResponse {
  readonly userId: string
}


export interface AuthError {
  readonly message: string
  readonly code: string
  readonly statusCode: number
  readonly field?: string
}


export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}


export interface ApiResponse<T> {
  data?: T
  error?: AuthError
  success: boolean
}

export interface ValidationError {
  readonly field: string
  readonly message: string
}

export interface FormValidationState {
  readonly isValid: boolean
  readonly errors: ValidationError[]
  readonly touched: Record<string, boolean>
}

export interface AuthRouteContext {
  readonly requiresAuth: boolean
  readonly redirectTo?: string
  readonly allowedRoles?: string[]
}

export interface AuthTokens {
  readonly accessToken: string
  readonly refreshToken?: string
  readonly expiresAt: number
}

export const isUser = (value: unknown): value is User => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value
  )
}

export const isAuthResponse = (value: unknown): value is AuthResponse => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'token' in value &&
    'user' in value &&
    isUser((value as AuthResponse).user)
  )
}

export const isAuthError = (value: unknown): value is AuthError => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    'code' in value &&
    'statusCode' in value
  )
}
