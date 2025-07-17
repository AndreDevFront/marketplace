<template>
  <Card
    class="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
  >
    <div class="relative overflow-hidden rounded-t-lg">
      <img
        :src="card.imageUrl"
        :alt="card.name"
        loading="lazy"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        @error="onImageError"
        @load="onImageLoad"
      />

      <div
        v-if="imageLoading"
        class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
      >
        <span class="text-gray-400 text-sm">🃏</span>
      </div>

      <div class="absolute top-2 right-2">
        <Button
          v-if="showAddButton"
          size="sm"
          @click.stop="handleAdd"
          :disabled="isLoading"
          class="bg-white/90 text-black hover:bg-white"
        >
          {{ isLoading ? '...' : '+' }}
        </Button>
      </div>
    </div>

    <div class="p-4">
      <h3 class="font-semibold text-lg mb-2 truncate">
        {{ card.name }}
      </h3>

      <p class="text-sm text-muted-foreground mb-3 overflow-hidden h-10">
        {{ card.description }}
      </p>

      <div class="flex items-center justify-between text-xs text-muted-foreground">
        <span>{{ formatDate(card.createdAt) }}</span>
        <Badge v-if="isInCollection" variant="secondary"> Na coleção </Badge>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCards } from '@/composables/useCards'
import type { Card } from '@/types/cards.types'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Image loading state
const imageLoading = ref(true)

interface Props {
  card: Card
  showAddButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAddButton: false,
})

const { userCards, addCardsToCollection, isLoading } = useCards()

const isInCollection = computed(() =>
  userCards.value.some((userCard) => userCard.id === props.card.id),
)

const handleAdd = async () => {
  if (isInCollection.value) return

  try {
    await addCardsToCollection([props.card.id])
  } catch (error) {
    console.error('Erro ao adicionar carta à coleção:', error)
  }
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-card.png'
}

const onImageLoad = () => {
  imageLoading.value = false
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>

<style scoped></style>
