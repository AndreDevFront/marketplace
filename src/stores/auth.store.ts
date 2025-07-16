import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { getUserData, getAuthToken } from '@/lib/auth.utils'

import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthError
} from '@/types/auth.types'

import { toast } from 'vue-sonner'


interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: RegisterData) => Promise<string>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
  refreshUser: () => Promise<void>
}


export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed<boolean>(() => {
    return Boolean(user.value && token.value)
  })

  const userDisplayName = computed<string>(() => {
    return user.value?.name || 'Usuário'
  })

  const userInitials = computed<string>(() => {
    if (!user.value?.name) return 'U'

    const names = user.value.name.split(' ')
    const firstInitial = names[0]?.[0] || ''
    const lastInitial = names[names.length - 1]?.[0] || ''

    return (firstInitial + lastInitial).toUpperCase()
  })

  const hasError = computed<boolean>(() => {
    return Boolean(error.value)
  })


  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const authResponse = await authService.login(credentials)

      user.value = authResponse.user
      token.value = authResponse.token

    } catch (err) {
      const authError = err as AuthError
      error.value = authError.message

      toast.error(authError.message)

      user.value = null
      token.value = null

      throw authError
    } finally {
      isLoading.value = false
    }
  }


  const register = async (userData: RegisterData): Promise<string> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await authService.register(userData)
      return response.userId

    } catch (err) {
      const authError = err as AuthError
      error.value = authError.message

      toast.error(authError.message)

      throw authError
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      isLoading.value = true

      await authService.logout()

    } catch (err) {
      const authError = err as AuthError
      console.error('Erro ao fazer logout:', authError.message)

    } finally {
      user.value = null
      token.value = null
      error.value = null
      isLoading.value = false
    }
  }


  const checkAuth = async (): Promise<void> => {
    try {
      isLoading.value = true

      const localUser = getUserData()
      const localToken = getAuthToken()

      if (!localUser || !localToken) {
        return
      }

      const currentUser = await authService.checkAuthStatus()

      if (currentUser) {
        user.value = currentUser
        token.value = localToken
      }

    } catch (err) {
      const authError = err as AuthError
      console.error('Erro ao verificar autenticação:', authError.message)

      user.value = null
      token.value = null

    } finally {
      isLoading.value = false
    }
  }

  const refreshUser = async (): Promise<void> => {
    if (!isAuthenticated.value) {
      throw new Error('Usuário não autenticado')
    }

    try {
      isLoading.value = true
      error.value = null

      const updatedUser = await authService.getCurrentUser()
      user.value = updatedUser

    } catch (err) {
      const authError = err as AuthError
      error.value = authError.message
      throw authError
    } finally {
      isLoading.value = false
    }
  }


  const clearError = (): void => {
    error.value = null
  }

  const actions: AuthActions = {
    login,
    register,
    logout,
    checkAuth,
    clearError,
    refreshUser
  }

  return {
    user,
    token,
    isLoading,
    error,

    isAuthenticated,
    userDisplayName,
    userInitials,
    hasError,

    ...actions
  }
})

export type AuthStore = ReturnType<typeof useAuthStore>
