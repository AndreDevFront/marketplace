<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
    <AppNavigation />

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">🃏 Minhas Cartas</h1>
        <p class="text-gray-300 text-lg">Gerencie sua coleção de cartas</p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <Card class="p-6 text-center">
          <h3 class="text-2xl font-bold text-primary">{{ userCardsCount }}</h3>
          <p class="text-muted-foreground">Cartas na Coleção</p>
        </Card>

        <Card class="p-6 text-center">
          <h3 class="text-2xl font-bold text-primary">{{ allCardsCount }}</h3>
          <p class="text-muted-foreground">Cartas Disponíveis</p>
        </Card>

        <Card class="p-6 text-center">
          <Button @click="fetchAllCards" :disabled="isLoading" class="w-full">
            {{ isLoading ? 'Carregando...' : 'Explorar Cartas' }}
          </Button>
        </Card>
      </div>

      <div v-if="hasUserCards" class="mb-12">
        <h2 class="text-2xl font-bold text-white mb-6">Sua Coleção</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <CardItem v-for="card in userCards" :key="card.id" :card="card" />
        </div>
      </div>

      <div v-else-if="!isLoading" class="text-center py-12">
        <Card class="p-8 max-w-md mx-auto">
          <h3 class="text-xl font-semibold mb-4">Sua coleção está vazia</h3>
          <p class="text-muted-foreground mb-6">
            Explore as cartas disponíveis e adicione à sua coleção
          </p>
          <Button @click="fetchAllCards">Explorar Cartas</Button>
        </Card>
      </div>

      <div v-if="allCards.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold text-white mb-6">Cartas Disponíveis</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <CardItem v-for="card in allCards" :key="card.id" :card="card" show-add-button />
        </div>

        <div v-if="hasMoreCards" class="text-center mt-8">
          <Button
            @click="loadMoreCards"
            :disabled="isLoading"
            variant="outline"
            class="border-white/20 text-white hover:bg-white/20"
          >
            {{ isLoading ? 'Carregando...' : 'Carregar Mais' }}
          </Button>
        </div>
      </div>

      <div v-if="isLoading && allCards.length === 0" class="text-center py-12">
        <Card class="p-8 max-w-md mx-auto">
          <div
            class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
          ></div>
          <p class="text-muted-foreground">Carregando cartas...</p>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCards } from '@/composables/useCards'

import AppNavigation from '@/components/AppNavigation.vue'
import CardItem from '@/components/cards/CardItem.vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const {
  userCards,
  allCards,
  isLoading,
  userCardsCount,
  allCardsCount,
  hasUserCards,
  hasMoreCards,
  fetchUserCards,
  fetchAllCards,
  loadMoreCards,
} = useCards()

onMounted(() => {
  fetchUserCards()
})
</script>
