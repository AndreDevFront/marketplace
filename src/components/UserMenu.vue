<template>
  <div class="relative">
    <Button
      variant="ghost"
      size="sm"
      class="text-white hover:bg-white/20"
      @click="menuOpen = !menuOpen"
    >
      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-medium"
        >
          {{ userInitials }}
        </div>
        <span class="hidden sm:block">{{ userDisplayName }}</span>
      </div>
    </Button>

    <div
      v-if="menuOpen"
      class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
    >
      <router-link
        to="/profile"
        @click="menuOpen = false"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        👤 Perfil
      </router-link>

      <router-link
        to="/cards"
        @click="menuOpen = false"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        🃏 Minhas Cartas
      </router-link>

      <router-link
        to="/trades"
        @click="menuOpen = false"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        🔄 Minhas Trocas
      </router-link>

      <hr class="my-1" />

      <button
        @click="handleLogout"
        class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        🚪 Sair
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

import { Button } from '@/components/ui/button'

const menuOpen = ref(false)

const router = useRouter()
const { userDisplayName, userInitials, logout } = useAuth()
const toast = useToast()

const handleLogout = async () => {
  try {
    await logout()
    toast.success('Logout realizado!')
    router.push('/')
    menuOpen.value = false
  } catch (error) {
    console.log(error)
    toast.error('Erro ao sair')
  }
}

document.addEventListener('click', (e) => {
  const target = e.target
  if (target instanceof HTMLElement) {
    if (!target.closest('.relative')) {
      menuOpen.value = false
    }
  }
})
</script>
