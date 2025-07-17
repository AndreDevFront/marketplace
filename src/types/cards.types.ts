export interface Card {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly imageUrl: string
  readonly createdAt: string
}


export interface PaginationData {
  readonly page: number
  readonly rpp: number
  readonly more: boolean
}


export interface CardsResponse {
  readonly list: ReadonlyArray<Card>
  readonly page: number
  readonly rpp: number
  readonly more: boolean
}

export interface AddCardsRequest extends Record<string, unknown> {
  readonly cardIds: ReadonlyArray<string>
}


export interface CardsState {
  userCards: ReadonlyArray<Card>
  allCards: ReadonlyArray<Card>
  pagination: PaginationData
  isLoading: boolean
  error: string | null
}


export interface CardsFilters {
  readonly search?: string
  readonly page?: number
  readonly rpp?: number
}
