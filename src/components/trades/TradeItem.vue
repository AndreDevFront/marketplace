<template>
  <Card class="group hover:shadow-lg transition-all duration-300">
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium"
          >
            {{ getUserInitials(trade.user.name) }}
          </div>
          <div>
            <h3 class="font-semibold">{{ trade.user.name }}</h3>
            <p class="text-sm text-muted-foreground">{{ formatDate(trade.createdAt) }}</p>
          </div>
        </div>

        <Button
          v-if="showDelete"
          variant="ghost"
          size="sm"
          @click="handleDelete"
          :disabled="isLoading"
          class="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          🗑️
        </Button>
      </div>

      <div class="space-y-4">
        <div>
          <h4 class="text-sm font-medium text-green-600 mb-2">🎁 Oferecendo:</h4>
          <div class="flex gap-2 flex-wrap">
            <Badge
              v-for="card in offeringCards"
              :key="card.id"
              variant="outline"
              class="border-green-200 text-green-700"
            >
              {{ card.card.name }}
            </Badge>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-medium text-blue-600 mb-2">🎯 Procurando:</h4>
          <div class="flex gap-2 flex-wrap">
            <Badge
              v-for="card in receivingCards"
              :key="card.id"
              variant="outline"
              class="border-blue-200 text-blue-700"
            >
              {{ card.card.name }}
            </Badge>
          </div>
        </div>
      </div>

      <div v-if="showContact" class="mt-4 pt-4 border-t">
        <Button variant="outline" size="sm" class="w-full" disabled>
          💬 Entrar em contato (em breve)
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrades } from '@/composables/useTrades'

import type { Trade } from '@/types/trades.types'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  trade: Trade
  showContact?: boolean
  showDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showContact: false,
  showDelete: false,
})

const { deleteTrade, isLoading } = useTrades()

const offeringCards = computed(() => props.trade.tradeCards.filter((tc) => tc.type === 'OFFERING'))

const receivingCards = computed(() =>
  props.trade.tradeCards.filter((tc) => tc.type === 'RECEIVING'),
)

const handleDelete = async () => {
  if (!confirm('Tem certeza que deseja deletar esta troca?')) return

  try {
    await deleteTrade(props.trade.id)
  } catch (error) {
    console.error(error)
  }
}

const getUserInitials = (name: string): string => {
  const names = name.split(' ')
  const firstInitial = names[0]?.[0] || ''
  const lastInitial = names[names.length - 1]?.[0] || ''
  return (firstInitial + lastInitial).toUpperCase()
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>
