<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
    <AppNavigation />

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">🔄 Marketplace de Trocas</h1>
        <p class="text-gray-300 text-lg">Encontre as cartas que você procura</p>

        <div v-if="!isAuthenticated" class="mt-6">
          <p class="text-gray-400 mb-4">Faça login para criar suas próprias trocas</p>
          <div class="flex gap-4 justify-center">
            <Button as-child>
              <router-link to="/auth/login">Fazer Login</router-link>
            </Button>
            <Button as-child variant="outline" class="border-white/20 text-black hover:bg-white/20">
              <router-link to="/auth/register">Registrar</router-link>
            </Button>
          </div>
        </div>

        <div v-else class="mt-6">
          <Button @click="openCreateTradeModal" size="lg"> ➕ Criar Nova Troca </Button>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <Card class="p-6 text-center">
          <h3 class="text-2xl font-bold text-primary">{{ tradesCount }}</h3>
          <p class="text-muted-foreground">Trocas Ativas</p>
        </Card>

        <Card class="p-6 text-center">
          <h3 class="text-2xl font-bold text-primary">{{ uniqueUsers }}</h3>
          <p class="text-muted-foreground">Usuários Ativos</p>
        </Card>
      </div>

      <div>
        <h2 class="text-2xl font-bold text-white mb-6">Trocas Disponíveis</h2>

        <div v-if="trades.length > 0" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TradeItem
              v-for="trade in trades"
              :key="trade.id"
              :trade="trade"
              :show-contact="isAuthenticated"
            />
          </div>

          <div v-if="hasMoreTrades" class="text-center">
            <Button
              @click="loadMoreTrades"
              :disabled="isLoading"
              variant="outline"
              class="border-white/20 text-black hover:bg-white/20"
            >
              {{ isLoading ? 'Carregando...' : 'Carregar Mais' }}
            </Button>
          </div>
        </div>

        <div v-else-if="!isLoading" class="text-center py-12">
          <Card class="p-8 max-w-md mx-auto">
            <h3 class="text-xl font-semibold mb-4">Nenhuma troca encontrada</h3>
            <p class="text-muted-foreground mb-6">
              Seja o primeiro a criar uma solicitação de troca!
            </p>
            <Button v-if="isAuthenticated" @click="openCreateTradeModal">
              Criar Primeira Troca
            </Button>
            <Button v-else as-child>
              <router-link to="/auth/register">Registrar para Trocar</router-link>
            </Button>
          </Card>
        </div>

        <div v-if="isLoading && trades.length === 0" class="text-center py-12">
          <Card class="p-8 max-w-md mx-auto">
            <div
              class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
            ></div>
            <p class="text-muted-foreground">Carregando trocas...</p>
          </Card>
        </div>
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
import { onMounted, computed, ref } from 'vue'
import { useTrades } from '@/composables/useTrades'
import { useAuth } from '@/composables/useAuth'

import AppNavigation from '@/components/AppNavigation.vue'
import TradeItem from '@/components/trades/TradeItem.vue'
import CreateTradeModal from '@/components/trades/CreateTradeModal.vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const showCreateModal = ref(false)

const { isAuthenticated } = useAuth()
const { trades, isLoading, tradesCount, hasMoreTrades, fetchAllTrades, loadMoreTrades } =
  useTrades()

const uniqueUsers = computed(() => {
  const userIds = new Set(trades.value.map((trade) => trade.userId))
  return userIds.size
})

const openCreateTradeModal = () => {
  showCreateModal.value = true
}

const onTradeCreated = () => {
  showCreateModal.value = false
  fetchAllTrades()
}

onMounted(() => {
  fetchAllTrades()
})
</script>
