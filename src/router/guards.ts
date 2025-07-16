import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'


export const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
    return
  }

  next()
}


export const requireGuest = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }

  next()
}


export const getRedirectPath = (query: Record<string, string | string[]>): string => {
  const redirect = query.redirect as string

  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }

  return '/'
}
