import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requireGuest } from './guards'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      beforeEnter: requireGuest
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      beforeEnter: requireGuest
    },
    {
      path: '/cards',
      name: 'cards',
      component: () => import('@/views/CardsView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/trades',
      name: 'trades',
      component: () => import('@/views/TradesView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      beforeEnter: requireAuth
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()


  if (!authStore.user && !authStore.isLoading) {
    await authStore.checkAuth()
  }

  next()
})

export default router
