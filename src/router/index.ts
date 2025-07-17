import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { requireAuth, requireGuest } from './guards'

import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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
      path: '/marketplace',
      name: 'marketplace',
      component: () => import(
        /* webpackChunkName: "marketplace" */
        '@/views/MarketplaceView.vue'
      )
    },
    {
      path: '/cards',
      name: 'cards',
      component: () => import(
        /* webpackChunkName: "user-area" */
        '@/views/CardsView.vue'
      ),
      beforeEnter: requireAuth
    },
    {
      path: '/my-trades',
      name: 'my-trades',
      component: () => import(
        /* webpackChunkName: "user-area" */
        '@/views/MyTradesView.vue'
      ),
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
