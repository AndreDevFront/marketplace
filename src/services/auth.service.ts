import { httpClient } from '@/lib/http.client'
import { saveAuthToken, saveUserData, removeAuthToken } from '@/lib/auth.utils'
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserResponse,
  User,
  AuthError
} from '@/types/auth.types'

interface ApiLoginResponse {
  readonly token: string
  readonly user: {
    readonly id: string
    readonly name: string
    readonly email: string
  }
}

interface ApiRegisterResponse {
  readonly userId: string
}

interface ApiUserResponse {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly cards?: ReadonlyArray<{
    readonly id: string
    readonly name: string
    readonly description: string
    readonly imageUrl: string
    readonly createdAt: string
  }>
}

interface EmailCheckResponse {
  readonly exists: boolean
}

class AuthService {
  private readonly baseEndpoint = ''

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<ApiLoginResponse>('/login',{ ...credentials })

      const authResponse: AuthResponse = {
        token: response.token,
        user: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email
        }
      }

      saveAuthToken(authResponse.token)
      saveUserData(authResponse.user)

      httpClient.setAuthToken(authResponse.token)

      return authResponse

    } catch (error) {
      throw error as AuthError
    }
  }

  async register(userData: RegisterData): Promise<UserResponse> {
    try {
      const response = await httpClient.post<ApiRegisterResponse>('/register',{ ...userData })

      return {
        userId: response.userId
      }

    } catch (error) {
      throw error as AuthError
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await httpClient.get<ApiUserResponse>('/me')

      const user: User = {
        id: response.id,
        name: response.name,
        email: response.email,
        createdAt: response.cards?.[0]?.createdAt
      }

      saveUserData(user)

      return user

    } catch (error) {
      throw error as AuthError
    }
  }


  async logout(): Promise<void> {
    try {
      removeAuthToken()
      httpClient.clearAuthToken()

    } catch (error) {
      removeAuthToken()
      httpClient.clearAuthToken()

      throw error as AuthError
    }
  }


  async checkAuthStatus(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token')

      if (!token) {
        return null
      }

      const user = await this.getCurrentUser()
      return user

    } catch {
      removeAuthToken()
      httpClient.clearAuthToken()
      return null
    }
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      await httpClient.post<EmailCheckResponse>('/check-email', { email })
      return false

    } catch (error) {
      const authError = error as AuthError

      if (authError.code === 'EMAIL_ALREADY_EXISTS') {
        return true
      }
      return false
    }
  }


  async validateToken(): Promise<boolean> {
    try {
      await this.getCurrentUser()
      return true
    } catch {
      return false
    }
  }


  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const response = await httpClient.post<ApiLoginResponse>('/refresh-token')

      const authResponse: AuthResponse = {
        token: response.token,
        user: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email
        }
      }

      saveAuthToken(authResponse.token)
      saveUserData(authResponse.user)
      httpClient.setAuthToken(authResponse.token)

      return authResponse

    } catch {
      return null
    }
  }
}


export const authService = new AuthService()


export const {
  login,
  register,
  getCurrentUser,
  logout,
  checkAuthStatus,
  checkEmailExists,
  validateToken,
  refreshToken
} = authService
