import { isAuthResponse, isUser, type AuthError, type AuthResponse, type User } from '@/types/auth.types'

type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string
      code?: string
      field?: string
    }
    status?: number
  }
  code?: string
  message?: string
}

// ===== CONSTANTS =====
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  REFRESH_TOKEN: 'auth_refresh_token'
} as const

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NETWORK_ERROR: 'NETWORK_ERROR'
} as const


export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch {
    return true
  }
}


type JwtPayload = {
  exp?: number
  iat?: number
  sub?: string
  [key: string]: unknown
}

export const getTokenPayload = (token: string): JwtPayload | null => {
  try {
    const decoded: unknown = JSON.parse(atob(token.split('.')[1]))

    return decoded as JwtPayload

  } catch {
    return null
  }
}

export const getTokenTimeRemaining = (token: string): number => {
  const payload = getTokenPayload(token)

  if (!payload?.exp || typeof payload.exp !== 'number') {
    return 0
  }

  const currentTime   = Math.floor(Date.now() / 1000)
  const timeRemaining = payload.exp - currentTime
  return Math.max(0, Math.floor(timeRemaining / 60))
}

export const saveAuthToken = (token: string): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token)
  } catch (error) {
    console.error('Erro ao salvar token:', error)
  }
}

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN)
  } catch {
    return null
  }
}

export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN)
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER)
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
  } catch (error) {
    console.error('Erro ao remover token:', error)
  }
}

export const saveUserData = (user: User): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user))
  } catch (error) {
    console.error('Erro ao salvar dados do usuário:', error)
  }
}

export const getUserData = (): User | null => {
  try {
    const userData = localStorage.getItem(AUTH_STORAGE_KEYS.USER)
    return userData ? JSON.parse(userData) : null
  } catch {
    return null
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePasswordStrength = (password: string) => {
  const checks = {
    minLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }

  const score = Object.values(checks).filter(Boolean).length

  return {
    score,
    strength: score <= 2 ? 'weak' : score <= 3 ? 'medium' : 'strong',
    checks
  }
}

export const sanitizeName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' ')
}

export const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    [AUTH_ERRORS.INVALID_CREDENTIALS]: 'Email ou senha incorretos',
    [AUTH_ERRORS.USER_NOT_FOUND]: 'Usuário não encontrado',
    [AUTH_ERRORS.EMAIL_ALREADY_EXISTS]: 'Este email já está em uso',
    [AUTH_ERRORS.TOKEN_EXPIRED]: 'Sua sessão expirou. Faça login novamente',
    [AUTH_ERRORS.UNAUTHORIZED]: 'Acesso não autorizado',
    [AUTH_ERRORS.NETWORK_ERROR]: 'Erro de conexão. Tente novamente'
  }

  return errorMessages[errorCode] || 'Erro desconhecido. Tente novamente'
}


export const normalizeApiError = (error: unknown): AuthError => {
  const err = error as ApiErrorResponse

  if (err?.response?.data) {
    return {
      message: err.response.data.message || 'Erro desconhecido',
      code: err.response.data.code || 'UNKNOWN_ERROR',
      statusCode: err.response.status || 500,
      field: err.response.data.field
    }
  }

  if (err?.code === 'NETWORK_ERROR' || !err?.response) {
    return {
      message: 'Erro de conexão',
      code: AUTH_ERRORS.NETWORK_ERROR,
      statusCode: 0
    }
  }

  return {
    message: err?.message || 'Erro desconhecido',
    code: 'UNKNOWN_ERROR',
    statusCode: 500
  }
}

export const buildRedirectUrl = (basePath: string = '/', queryRedirect?: string): string => {
  if (queryRedirect && isValidPath(queryRedirect)) {
    return queryRedirect
  }
  return basePath
}

export const isValidPath = (path: string): boolean => {
  return path.startsWith('/') && !path.startsWith('//')
}

export const assertIsUser = (value: unknown): asserts value is User => {
  if (!isUser(value)) {
    throw new Error('Invalid user object')
  }
}

export const assertIsAuthResponse = (value: unknown): asserts value is AuthResponse => {
  if (!isAuthResponse(value)) {
    throw new Error('Invalid auth response')
  }
}
