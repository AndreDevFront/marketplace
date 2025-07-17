import { httpClient } from '@/lib/http.client'
import type {
  Trade,
  TradesResponse,
  CreateTradeRequest,
  CreateTradeResponse,
  TradesFilters
} from '@/types/trades.types'


class TradesService {
  async getAllTrades(filters: TradesFilters = {}): Promise<TradesResponse> {
    const params = {
      page: filters.page ?? 1,
      rpp: filters.rpp ?? 10
    }

    return httpClient.get('/trades', { params }) as Promise<TradesResponse>
  }


  async createTrade(request: CreateTradeRequest): Promise<CreateTradeResponse> {
    const payload = {
      cards: request.cards.map(card => ({
        cardId: card.cardId,
        type: card.type
      }))
    }

    return httpClient.post('/trades', payload) as Promise<CreateTradeResponse>
  }


  async deleteTrade(tradeId: string): Promise<void> {
    await httpClient.delete(`/trades/${tradeId}`)
  }


  async getUserTrades(): Promise<Trade[]> {
    const response = await this.getAllTrades({ rpp: 100 })

    return [...response.list]
  }
}


export const tradesService = new TradesService()
