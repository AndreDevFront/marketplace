<template>
  <Card
    class="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 bg-white/95 backdrop-blur-md border border-slate-200/80 hover:border-slate-300 overflow-hidden"
  >
    <div class="relative overflow-hidden">
      <img
        :src="card.imageUrl"
        :alt="card.name"
        loading="lazy"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        @error="onImageError"
        @load="onImageLoad"
      />

      <div
        v-if="imageLoading"
        class="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center"
      >
        <span class="text-slate-400 text-xl">🃏</span>
      </div>

      <div
        class="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>

      <div class="absolute top-4 right-4">
        <Button
          v-if="showAddButton"
          size="sm"
          @click.stop="handleAdd"
          :disabled="isLoading"
          class="bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-slate-900 hover:text-white shadow-md border border-slate-200 font-semibold transition-all duration-300 hover:scale-105"
        >
          {{ isLoading ? '···' : '+' }}
        </Button>
      </div>

      <div
        class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
      ></div>
    </div>

    <div class="p-6">
      <h3
        class="font-semibold text-xl mb-3 truncate text-slate-800 group-hover:text-slate-900 transition-colors duration-300"
      >
        {{ card.name }}
      </h3>

      <p class="text-sm text-slate-600 mb-4 overflow-hidden h-10 leading-relaxed">
        {{ card.description }}
      </p>

      <div class="flex items-center justify-between pt-2 border-t border-slate-100">
        <span class="text-xs text-slate-500 font-medium">
          {{ formatDate(card.createdAt) }}
        </span>

        <Badge
          v-if="isInCollection"
          variant="secondary"
          class="bg-slate-100 text-slate-700 border-slate-200 font-medium"
        >
          Na coleção
        </Badge>
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
