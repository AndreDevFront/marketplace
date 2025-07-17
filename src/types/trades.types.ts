import type { Card } from './cards.types'

export interface Trade {
  readonly id: string
  readonly userId: string
  readonly createdAt: string
  readonly user: {
    readonly name: string
  }
  readonly tradeCards: ReadonlyArray<TradeCard>
}

export interface TradeCard {
  readonly id: string
  readonly cardId: string
  readonly tradeId: string
  readonly type: TradeCardType
  readonly card: Card
}


export type TradeCardType = 'OFFERING' | 'RECEIVING'

export interface CreateTradeCard {
  cardId: string
  type: TradeCardType
}

export interface CreateTradeRequest {
  cards: CreateTradeCard[]
}

export interface CreateTradeResponse {
  readonly tradeId: string
}

export interface TradesResponse {
  readonly list: ReadonlyArray<Trade>
  readonly page: number
  readonly rpp: number
  readonly more: boolean
}

export interface TradesState {
  trades: Trade[]
  userTrades: Trade[]
  pagination: {
    page: number
    rpp: number
    more: boolean
  }
  isLoading: boolean
  error: string | null
}


export interface TradesFilters {
  readonly page?: number
  readonly rpp?: number
  readonly userId?: string
}


export function isValidTrade(trade: unknown): trade is Trade {
  return (
    typeof trade === 'object' &&
    trade !== null &&
    'id' in trade &&
    'userId' in trade &&
    'tradeCards' in trade
  )
}


export function createTradeRequest(cards: CreateTradeCard[]): CreateTradeRequest {
  return { cards }
}
