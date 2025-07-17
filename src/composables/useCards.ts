import { storeToRefs } from 'pinia'
import { useCardsStore } from '@/stores/cards.store'

export const useCards = () => {
  const cardsStore = useCardsStore()

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
    resetState
  }
}
