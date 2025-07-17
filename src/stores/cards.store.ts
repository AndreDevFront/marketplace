import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { toast } from 'vue-sonner'

import { cardsService } from '@/services/cards.service'
import type {
  Card,
  CardsFilters,
  PaginationData
} from '@/types/cards.types'


export const useCardsStore = defineStore('cards', () => {
  const userCards = ref<ReadonlyArray<Card>>([])
  const allCards = ref<ReadonlyArray<Card>>([])

  const pagination = ref<PaginationData>({
    page: 1,
    rpp: 10,
    more: false
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const userCardsCount  = computed(() => userCards.value.length)
  const allCardsCount   = computed(() => allCards.value.length)
  const hasUserCards    = computed(() => userCardsCount.value > 0)
  const hasMoreCards    = computed(() => pagination.value.more)


  const fetchUserCards = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const cards = await cardsService.getUserCards()
      userCards.value = cards

    } catch (err) {
      const errorMessage = (err as Error).message
      error.value = errorMessage
      toast.error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }


  const fetchAllCards = async (filters: CardsFilters = {}): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await cardsService.getAllCards(filters)

      if (filters.page === 1 || !filters.page) {
        allCards.value = response.list
      } else {
        allCards.value = [...allCards.value, ...response.list]
      }

      pagination.value = {
        page: response.page,
        rpp: response.rpp,
        more: response.more
      }

    } catch (err) {
      const errorMessage = (err as Error).message
      error.value = errorMessage
      toast.error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  const addCardsToCollection = async (cardIds: ReadonlyArray<string>): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      await cardsService.addCardsToUser(cardIds)

      await fetchUserCards()

      toast.success('Cartas adicionadas à sua coleção!')

    } catch (err) {
      const errorMessage = (err as Error).message
      error.value = errorMessage
      toast.error(errorMessage)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadMoreCards = async (filters: CardsFilters = {}): Promise<void> => {
    if (!hasMoreCards.value || isLoading.value) return

    const nextPage = pagination.value.page + 1
    await fetchAllCards({ ...filters, page: nextPage })
  }


  const clearError = (): void => {
    error.value = null
  }


  const resetState = (): void => {
    userCards.value = []
    allCards.value = []
    pagination.value = { page: 1, rpp: 10, more: false }
    error.value = null
  }


  return {
    userCards: readonly(userCards),
    allCards: readonly(allCards),
    pagination: readonly(pagination),
    isLoading: readonly(isLoading),
    error: readonly(error),

    userCardsCount,
    allCardsCount,
    hasUserCards,
    hasMoreCards,

    fetchUserCards,
    fetchAllCards,
    addCardsToCollection,
    loadMoreCards,
    clearError,
    resetState
  }
})


export type CardsStore = ReturnType<typeof useCardsStore>
