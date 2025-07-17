import { httpClient } from '@/lib/http.client'
import type {
  Card,
  CardsResponse,
  AddCardsRequest,
  CardsFilters
} from '@/types/cards.types'


class CardsService {

  async getAllCards(filters: CardsFilters = {}): Promise<CardsResponse> {
    const params = {
      page: filters.page || 1,
      rpp: filters.rpp || 10,
      ...(filters.search && { search: filters.search })
    }

    return httpClient.get<CardsResponse>('/cards', { params })
  }


  async getUserCards(): Promise<ReadonlyArray<Card>> {
    return httpClient.get<ReadonlyArray<Card>>('/me/cards')
  }


  async getCardById(id: string): Promise<Card> {
    return httpClient.get<Card>(`/cards/${id}`)
  }


  async addCardsToUser(cardIds: ReadonlyArray<string>): Promise<void> {
    const payload: AddCardsRequest = { cardIds }
    return httpClient.post<void>('/me/cards', payload)
  }
}


export const cardsService = new CardsService()
