<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
    <AppNavigation />

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">🔄 Minhas Trocas</h1>
        <p class="text-gray-300 text-lg">Gerencie suas solicitações de troca</p>

        <div class="mt-6">
          <Button @click="openCreateTradeModal" size="lg"> ➕ Criar Nova Troca </Button>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <Card class="p-6 text-center">
          <h3 class="text-2xl font-bold text-primary">{{ userTradesCount }}</h3>
          <p class="text-muted-foreground">Minhas Trocas Ativas</p>
        </Card>

        <Card class="p-6 text-center">
          <Button @click="fetchUserTrades" :disabled="isLoading" class="w-full">
            {{ isLoading ? 'Carregando...' : 'Atualizar' }}
          </Button>
        </Card>
      </div>

      <div v-if="userTrades.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold text-white mb-6">Suas Solicitações</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TradeItem v-for="trade in userTrades" :key="trade.id" :trade="trade" show-delete />
        </div>
      </div>

      <div v-else-if="!isLoading" class="text-center py-12">
        <Card class="p-8 max-w-md mx-auto">
          <h3 class="text-xl font-semibold mb-4">Você ainda não criou nenhuma troca</h3>
          <p class="text-muted-foreground mb-6">
            Crie sua primeira solicitação de troca e encontre as cartas que procura!
          </p>
          <Button @click="openCreateTradeModal">Criar Primeira Troca</Button>
        </Card>
      </div>

      <div
        v-if="isLoading"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <Card class="p-8 max-w-md w-full mx-auto bg-white shadow-2xl">
          <div class="text-center">
            <div
              class="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
            ></div>
            <p class="text-muted-foreground text-lg font-medium">Carregando suas trocas...</p>
            <p class="text-muted-foreground/70 text-sm mt-2">Por favor, aguarde...</p>
          </div>
        </Card>
      </div>
    </div>

    <CreateTradeModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="onTradeCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTrades } from '@/composables/useTrades'

import AppNavigation from '@/components/AppNavigation.vue'
import TradeItem from '@/components/trades/TradeItem.vue'
import CreateTradeModal from '@/components/trades/CreateTradeModal.vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const showCreateModal = ref(false)

const { userTrades, isLoading, userTradesCount, fetchUserTrades } = useTrades()

const openCreateTradeModal = () => {
  showCreateModal.value = true
}

const onTradeCreated = () => {
  showCreateModal.value = false
  fetchUserTrades()
}

onMounted(() => {
  fetchUserTrades()
})
</script>
