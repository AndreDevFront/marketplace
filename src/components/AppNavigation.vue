<template>
  <nav class="bg-white/10 backdrop-blur-sm border-b border-white/20">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center gap-2">
          <div
            class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
          >
            <span class="text-white text-lg">🃏</span>
          </div>
          <span class="text-xl font-bold text-white">CardTrade</span>
        </router-link>

        <div class="hidden md:flex items-center gap-8">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/marketplace" class="nav-link">Marketplace</router-link>

          <template v-if="isAuthenticated">
            <router-link to="/cards" class="nav-link">Minhas Cartas</router-link>
            <router-link to="/my-trades" class="nav-link">Minhas Trocas</router-link>
            <UserMenu />
          </template>

          <template v-else>
            <router-link to="/auth/login" class="nav-link">Login</router-link>
            <Button as-child variant="outline" class="border-white/20 text-black hover:bg-white/20">
              <router-link to="/auth/register">Registrar</router-link>
            </Button>
          </template>
        </div>

        <Button
          variant="ghost"
          size="sm"
          class="md:hidden text-white"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="text-xl">☰</span>
        </Button>
      </div>

      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-white/20">
        <div class="space-y-2">
          <router-link to="/" @click="mobileMenuOpen = false" class="mobile-nav-link">
            Home
          </router-link>
          <router-link to="/marketplace" @click="mobileMenuOpen = false" class="mobile-nav-link">
            Marketplace
          </router-link>

          <template v-if="isAuthenticated">
            <router-link to="/cards" @click="mobileMenuOpen = false" class="mobile-nav-link">
              Minhas Cartas
            </router-link>
            <router-link to="/my-trades" @click="mobileMenuOpen = false" class="mobile-nav-link">
              Minhas Trocas
            </router-link>
            <router-link to="/profile" @click="mobileMenuOpen = false" class="mobile-nav-link">
              Perfil
            </router-link>
            <button @click="handleLogout" class="mobile-nav-link text-left w-full">Sair</button>
          </template>

          <template v-else>
            <router-link to="/auth/login" @click="mobileMenuOpen = false" class="mobile-nav-link">
              Login
            </router-link>
            <router-link
              to="/auth/register"
              @click="mobileMenuOpen = false"
              class="mobile-nav-link"
            >
              Registrar
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

import { Button } from '@/components/ui/button'
import UserMenu from '@/components/UserMenu.vue'

const mobileMenuOpen = ref(false)

const router = useRouter()
const { isAuthenticated, logout } = useAuth()
const toast = useToast()

const handleLogout = async () => {
  try {
    await logout()
    toast.success('Logout realizado com sucesso!')
    router.push('/')
    mobileMenuOpen.value = false
  } catch (error) {
    console.log(error)
    toast.error('Erro ao fazer logout')
  }
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-300 hover:text-white transition-colors;
}

.mobile-nav-link {
  @apply block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors;
}
</style>
