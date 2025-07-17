import { storeToRefs } from 'pinia'
import { useCardsStore } from '@/stores/cards.store'
import { useCache } from '@/composables/useCache'


export const useCards = () => {
  const cardsStore = useCardsStore()
  const { clearCache } = useCache()

  const {
    userCards,
    allCards,
    pagination,
    isLoading,
    error,
    userCardsCount,
    allCardsCount,
    hasUserCards,
    hasMoreCards
  } = storeToRefs(cardsStore)


  const {
    fetchUserCards,
    fetchAllCards,
    addCardsToCollection,
    loadMoreCards,
    clearError,
    resetState
  } = cardsStore

  const refreshCache = () => {
    clearCache('cards-all')
    clearCache('cards-user')
    fetchAllCards()
    fetchUserCards()
  }

  return {
    userCards,
    allCards,
    pagination,
    isLoading,
    error,
    userCardsCount,
    allCardsCount,
    hasUserCards,
    hasMoreCards,

    fetchUserCards,
    fetchAllCards,
    addCardsToCollection,
    loadMoreCards,
    clearError,
    resetState,
    refreshCache
  }
}

export type UseCardsReturn = ReturnType<typeof useCards>
