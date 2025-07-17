<template>
  <div>
    <HeroSection />

    <div class="bg-white py-20">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">🔥 Trocas em Destaque</h2>
          <p class="text-gray-600 text-lg">Veja as últimas solicitações de troca da comunidade</p>
        </div>

        <div
          v-if="recentTrades.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <TradeItem v-for="trade in recentTrades" :key="trade.id" :trade="trade" />
        </div>

        <div class="text-center">
          <Button as-child size="lg">
            <router-link to="/marketplace">Ver Todas as Trocas</router-link>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useTrades } from '@/composables/useTrades'

import HeroSection from '@/components/HeroSection.vue'
import TradeItem from '@/components/trades/TradeItem.vue'
import { Button } from '@/components/ui/button'

const { trades, fetchAllTrades } = useTrades()

const recentTrades = computed(() => trades.value.slice(0, 6))

onMounted(() => {
  fetchAllTrades({ rpp: 6 })
})
</script>
