<template>
  <Card class="p-6 max-w-md mx-auto">
    <h3 class="text-lg font-semibold mb-4">🧪 Teste de Autenticação</h3>

    <div class="space-y-4">
      <!-- Status -->
      <div class="p-3 bg-gray-50 rounded">
        <p><strong>Autenticado:</strong> {{ isAuthenticated ? '✅' : '❌' }}</p>
        <p><strong>Loading:</strong> {{ isLoading ? '⏳' : '✅' }}</p>
        <p><strong>Usuário:</strong> {{ user?.name || 'Nenhum' }}</p>
        <p><strong>Erro:</strong> {{ error || 'Nenhum' }}</p>
      </div>

      <!-- Actions -->
      <div class="space-y-2">
        <Button @click="testCheckAuth" :disabled="isLoading" class="w-full">
          Verificar Auth
        </Button>
        <Button @click="clearError" variant="outline" class="w-full"> Limpar Erro </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const { user, isLoading, error, isAuthenticated, checkAuth, clearError } = useAuth()

const testCheckAuth = async () => {
  try {
    await checkAuth()
    console.log('✅ CheckAuth executado com sucesso')
  } catch (err) {
    console.error('❌ Erro no checkAuth:', err)
  }
}
</script>
