import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import type { LoginCredentials, RegisterData, User } from '@/types/auth.types'
import type { Ref, ComputedRef } from 'vue'


interface UseAuthReturn {
  readonly user: Ref<User | null>
  readonly isLoading: Ref<boolean>
  readonly error: Ref<string | null>
  readonly isAuthenticated: Ref<boolean>
  readonly userDisplayName: ComputedRef<string>
  readonly userInitials: ComputedRef<string>
  readonly hasError: ComputedRef<boolean>


  readonly login: (credentials: LoginCredentials) => Promise<void>
  readonly register: (userData: RegisterData) => Promise<string>
  readonly logout: () => Promise<void>
  readonly checkAuth: () => Promise<void>
  readonly clearError: () => void
  readonly refreshUser: () => Promise<void>
}

export const useAuth = (): UseAuthReturn => {
  const authStore = useAuthStore()

  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    userDisplayName,
    userInitials,
    hasError
  } = storeToRefs(authStore)


  const {
    login,
    register,
    logout,
    checkAuth,
    clearError,
    refreshUser
  } = authStore

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    userDisplayName,
    userInitials,
    hasError,


    login,
    register,
    logout,
    checkAuth,
    clearError,
    refreshUser
  }
}
