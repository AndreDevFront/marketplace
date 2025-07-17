import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

import { tradesService } from '@/services/trades.service'
import type {
  Trade,
  CreateTradeRequest,
  TradesFilters
} from '@/types/trades.types'


export const useTradesStore = defineStore('trades', () => {
  const trades = ref<ReadonlyArray<Trade>>([])
  const userTrades = ref<ReadonlyArray<Trade>>([])
  const pagination = ref({
    page: 1,
    rpp: 10,
    more: false
  })
  const isLoading = ref(false)
  const error     = ref<string | null>(null)

  const cacheTimeout  = 2 * 60 * 1000
  const lastFetch     = ref<number | null>(null)

  const tradesCount     = computed(() => trades.value.length)
  const userTradesCount = computed(() => userTrades.value.length)
  const hasMoreTrades   = computed(() => pagination.value.more)

  const isCacheValid    = computed(() => {
    if (!lastFetch.value) return false
    return (Date.now() - lastFetch.value) < cacheTimeout
  })


  const fetchAllTrades = async (filters: TradesFilters = {}): Promise<void> => {

    if (isCacheValid.value && !filters.page && trades.value.length > 0) {
      return
    }

    try {
      isLoading.value = true
      error.value = null

      const response = await tradesService.getAllTrades(filters)

      if (filters.page === 1 || !filters.page) {
        trades.value = response.list
      } else {
        trades.value = [...trades.value, ...response.list]
      }

      pagination.value = {
        page: response.page,
        rpp: response.rpp,
        more: response.more
      }

    } catch (err) {
      const errorMessage = (err as Error).message
      error.value = errorMessage
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserTrades = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const trades = await tradesService.getUserTrades()
      userTrades.value = trades

    } catch (err) {
      const errorMessage = (err as Error).message
      error.value = errorMessage

    } finally {
      isLoading.value = false
    }
  }


  const createTrade = async (request: CreateTradeRequest): Promise<string> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await tradesService.createTrade(request)

      await Promise.all([
        fetchAllTrades(),
        fetchUserTrades()
      ])


      return response.tradeId

    } catch (err) {
      const errorMessage = (err as Error).message
      error.value = errorMessage

      throw err
    } finally {
      isLoading.value = false
    }
  }


  const deleteTrade = async (tradeId: string): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      await tradesService.deleteTrade(tradeId)

      trades.value = trades.value.filter(trade => trade.id !== tradeId)
      userTrades.value = userTrades.value.filter(trade => trade.id !== tradeId)



    } catch (err) {
      const errorMessage = (err as Error).message
      error.value = errorMessage

      throw err
    } finally {
      isLoading.value = false
    }
  }


  const loadMoreTrades = async (filters: TradesFilters = {}): Promise<void> => {
    if (!hasMoreTrades.value || isLoading.value) return

    const nextPage = pagination.value.page + 1
    await fetchAllTrades({ ...filters, page: nextPage })
  }


  const clearError = (): void => {
    error.value = null
  }


  const resetState = (): void => {
    trades.value = []
    userTrades.value = []
    pagination.value = { page: 1, rpp: 10, more: false }
    error.value = null
  }


  return {
    trades: readonly(trades),
    userTrades: readonly(userTrades),
    pagination: readonly(pagination),
    isLoading: readonly(isLoading),
    error: readonly(error),

    tradesCount,
    userTradesCount,
    hasMoreTrades,


    fetchAllTrades,
    fetchUserTrades,
    createTrade,
    deleteTrade,
    loadMoreTrades,
    clearError,
    resetState
  }
})

export type TradesStore = ReturnType<typeof useTradesStore>
