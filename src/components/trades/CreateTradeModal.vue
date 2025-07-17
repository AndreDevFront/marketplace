<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <Card class="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">Criar Nova Troca</h2>
          <Button variant="ghost" size="sm" @click="$emit('close')">✕</Button>
        </div>

        <form @submit="onSubmit" class="space-y-8">
          <div>
            <h3 class="text-lg font-semibold mb-4 text-green-600">🎁 Cartas que você oferece:</h3>

            <div v-if="userCards.length === 0" class="text-center p-8 bg-gray-50 rounded-lg">
              <p class="text-muted-foreground mb-4">
                Você precisa ter cartas na sua coleção para criar trocas
              </p>
              <Button as-child variant="outline">
                <router-link to="/cards">Adicionar Cartas</router-link>
              </Button>
            </div>

            <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="card in userCards"
                :key="card.id"
                @click="toggleOfferingCard(card.id)"
                class="cursor-pointer border-2 rounded-lg p-3 transition-all"
                :class="
                  offeringCardIds.includes(card.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                "
              >
                <img
                  :src="card.imageUrl"
                  :alt="card.name"
                  class="w-full h-24 object-cover rounded mb-2"
                />
                <h4 class="text-sm font-medium line-clamp-1">{{ card.name }}</h4>
                <div v-if="offeringCardIds.includes(card.id)" class="text-green-600 text-xs mt-1">
                  ✓ Selecionada
                </div>
              </div>
            </div>

            <p v-if="errors.offering" class="text-sm text-red-500 mt-2">{{ errors.offering }}</p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4 text-blue-600">🎯 Cartas que você procura:</h3>

            <div class="mb-4">
              <Input v-model="searchQuery" placeholder="Buscar cartas..." @input="searchCards" />
            </div>

            <div v-if="filteredCards.length === 0" class="text-center p-8 bg-gray-50 rounded-lg">
              <p class="text-muted-foreground">
                {{ searchQuery ? 'Nenhuma carta encontrada' : 'Carregando cartas...' }}
              </p>
            </div>

            <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
              <div
                v-for="card in filteredCards"
                :key="card.id"
                @click="toggleReceivingCard(card.id)"
                class="cursor-pointer border-2 rounded-lg p-3 transition-all"
                :class="
                  receivingCardIds.includes(card.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                "
              >
                <img
                  :src="card.imageUrl"
                  :alt="card.name"
                  class="w-full h-24 object-cover rounded mb-2"
                />
                <h4 class="text-sm font-medium line-clamp-1">{{ card.name }}</h4>
                <div v-if="receivingCardIds.includes(card.id)" class="text-blue-600 text-xs mt-1">
                  ✓ Selecionada
                </div>
              </div>
            </div>

            <p v-if="errors.receiving" class="text-sm text-red-500 mt-2">{{ errors.receiving }}</p>
          </div>

          <div class="flex gap-4 pt-6 border-t">
            <Button type="button" variant="outline" @click="$emit('close')" class="flex-1">
              Cancelar
            </Button>
            <Button type="submit" :disabled="isLoading || !canSubmit" class="flex-1">
              {{ isLoading ? 'Criando...' : 'Criar Troca' }}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCards } from '@/composables/useCards'
import { useTrades } from '@/composables/useTrades'
import type { CreateTradeRequest } from '@/types/trades.types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

const emit = defineEmits<{
  close: []
  created: []
}>()

const offeringCardIds = ref<string[]>([])
const receivingCardIds = ref<string[]>([])
const searchQuery = ref('')
const errors = ref<Record<string, string>>({})

const { userCards, allCards, fetchUserCards, fetchAllCards } = useCards()
const { createTrade, isLoading } = useTrades()

const filteredCards = computed(() => {
  if (!searchQuery.value) return allCards.value.slice(0, 20)

  return allCards.value
    .filter((card) => card.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .slice(0, 20)
})

const canSubmit = computed(
  () => offeringCardIds.value.length > 0 && receivingCardIds.value.length > 0,
)

const toggleOfferingCard = (cardId: string) => {
  const index = offeringCardIds.value.indexOf(cardId)
  if (index === -1) {
    offeringCardIds.value.push(cardId)
  } else {
    offeringCardIds.value.splice(index, 1)
  }
  errors.value.offering = ''
}

const toggleReceivingCard = (cardId: string) => {
  const index = receivingCardIds.value.indexOf(cardId)
  if (index === -1) {
    receivingCardIds.value.push(cardId)
  } else {
    receivingCardIds.value.splice(index, 1)
  }
  errors.value.receiving = ''
}

const searchCards = () => {
  if (allCards.value.length < 50) {
    fetchAllCards({ rpp: 50 })
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  if (offeringCardIds.value.length === 0) {
    errors.value.offering = 'Selecione pelo menos uma carta para oferecer'
  }

  if (receivingCardIds.value.length === 0) {
    errors.value.receiving = 'Selecione pelo menos uma carta que você quer receber'
  }

  return Object.keys(errors.value).length === 0
}

const onSubmit = async (event: Event) => {
  event.preventDefault()

  if (!validateForm()) return

  try {
    const request: CreateTradeRequest = {
      cards: [
        ...offeringCardIds.value.map((cardId) => ({
          cardId,
          type: 'OFFERING' as const,
        })),
        ...receivingCardIds.value.map((cardId) => ({
          cardId,
          type: 'RECEIVING' as const,
        })),
      ],
    }

    await createTrade(request)
    emit('created')
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  Promise.all([fetchUserCards(), fetchAllCards({ rpp: 20 })])
})
</script>
