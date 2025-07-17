import { storeToRefs } from 'pinia'
import { useTradesStore } from '@/stores/trades.store'
import type { CreateTradeRequest, TradesFilters, Trade } from '@/types/trades.types'
import type { Ref, ComputedRef } from 'vue'


interface UseTradesReturn {
  readonly trades: Ref<ReadonlyArray<Trade>>
  readonly userTrades: Ref<ReadonlyArray<Trade>>
  readonly pagination: Ref<{
    readonly page: number
    readonly rpp: number
    readonly more: boolean
  }>
  readonly isLoading: Ref<boolean>
  readonly error: Ref<string | null>
  readonly tradesCount: ComputedRef<number>
  readonly userTradesCount: ComputedRef<number>
  readonly hasMoreTrades: ComputedRef<boolean>

  readonly fetchAllTrades: (filters?: TradesFilters) => Promise<void>
  readonly fetchUserTrades: () => Promise<void>
  readonly createTrade: (request: CreateTradeRequest) => Promise<string>
  readonly deleteTrade: (tradeId: string) => Promise<void>
  readonly loadMoreTrades: (filters?: TradesFilters) => Promise<void>
  readonly clearError: () => void
  readonly resetState: () => void
}

export const useTrades = (): UseTradesReturn => {
  const tradesStore = useTradesStore()

  const {
    trades,
    userTrades,
    pagination,
    isLoading,
    error,
    tradesCount,
    userTradesCount,
    hasMoreTrades
  } = storeToRefs(tradesStore)

  const {
    fetchAllTrades,
    fetchUserTrades,
    createTrade,
    deleteTrade,
    loadMoreTrades,
    clearError,
    resetState
  } = tradesStore

  return {
    trades,
    userTrades,
    pagination,
    isLoading,
    error,
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
}
