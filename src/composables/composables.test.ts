import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'


const mockAuthStore = {
  user: ref(null),
  isLoading: ref(false),
  error: ref(null),
  isAuthenticated: ref(false),
  userDisplayName: computed(() => 'Usuário'),
  userInitials: computed(() => 'U'),
  hasError: computed(() => false),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  checkAuth: vi.fn(),
  clearError: vi.fn(),
  refreshUser: vi.fn()
}

const mockCardsStore = {
  userCards: ref([]),
  allCards: ref([]),
  pagination: ref({ page: 1, rpp: 10, more: false }),
  isLoading: ref(false),
  error: ref(null),
  userCardsCount: computed(() => 0),
  allCardsCount: computed(() => 0),
  hasUserCards: computed(() => false),
  hasMoreCards: computed(() => false),
  fetchUserCards: vi.fn(),
  fetchAllCards: vi.fn(),
  addCardsToCollection: vi.fn(),
  loadMoreCards: vi.fn(),
  clearError: vi.fn(),
  resetState: vi.fn()
}

const mockTradesStore = {
  trades: ref([]),
  userTrades: ref([]),
  pagination: ref({ page: 1, rpp: 10, more: false }),
  isLoading: ref(false),
  error: ref(null),
  tradesCount: computed(() => 0),
  userTradesCount: computed(() => 0),
  hasMoreTrades: computed(() => false),
  fetchAllTrades: vi.fn(),
  fetchUserTrades: vi.fn(),
  createTrade: vi.fn(),
  deleteTrade: vi.fn(),
  loadMoreTrades: vi.fn(),
  clearError: vi.fn(),
  resetState: vi.fn()
}

const mockCache = {
  clearCache: vi.fn()
}


vi.mock('pinia', () => ({
  storeToRefs: vi.fn((store) => store)
}))

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => mockAuthStore
}))

vi.mock('@/stores/cards.store', () => ({
  useCardsStore: () => mockCardsStore
}))

vi.mock('@/stores/trades.store', () => ({
  useTradesStore: () => mockTradesStore
}))

vi.mock('@/composables/useCache', () => ({
  useCache: () => mockCache
}))


import { useAuth } from '@/composables/useAuth'
import { useCards } from '@/composables/useCards'
import { useTrades } from '@/composables/useTrades'


describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Estado reativo', () => {
    it('deve expor todos os estados reativos', () => {
      const auth = useAuth()

      expect(auth.user).toBeDefined()
      expect(auth.isLoading).toBeDefined()
      expect(auth.error).toBeDefined()
      expect(auth.isAuthenticated).toBeDefined()
      expect(auth.userDisplayName).toBeDefined()
      expect(auth.userInitials).toBeDefined()
      expect(auth.hasError).toBeDefined()
    })

    it('deve expor valores corretos do store', () => {
      const auth = useAuth()

      expect(auth.user.value).toBe(null)
      expect(auth.isLoading.value).toBe(false)
      expect(auth.error.value).toBe(null)
      expect(auth.isAuthenticated.value).toBe(false)
    })
  })

  describe('Ações', () => {
    it('deve expor todas as ações', () => {
      const auth = useAuth()

      expect(typeof auth.login).toBe('function')
      expect(typeof auth.register).toBe('function')
      expect(typeof auth.logout).toBe('function')
      expect(typeof auth.checkAuth).toBe('function')
      expect(typeof auth.clearError).toBe('function')
      expect(typeof auth.refreshUser).toBe('function')
    })

    it('deve chamar login do store', async () => {
      const auth = useAuth()
      const credentials = { email: 'test@test.com', password: '123456' }

      await auth.login(credentials)

      expect(mockAuthStore.login).toHaveBeenCalledWith(credentials)
      expect(mockAuthStore.login).toHaveBeenCalledTimes(1)
    })

    it('deve chamar register do store', async () => {
      const auth = useAuth()
      const userData = {
        name: 'Test',
        email: 'test@test.com',
        password: '123456',
        confirmPassword: '123456'
      }

      await auth.register(userData)

      expect(mockAuthStore.register).toHaveBeenCalledWith(userData)
      expect(mockAuthStore.register).toHaveBeenCalledTimes(1)
    })

    it('deve chamar logout do store', async () => {
      const auth = useAuth()

      await auth.logout()

      expect(mockAuthStore.logout).toHaveBeenCalledTimes(1)
    })

    it('deve chamar clearError do store', () => {
      const auth = useAuth()

      auth.clearError()

      expect(mockAuthStore.clearError).toHaveBeenCalledTimes(1)
    })
  })
})

describe('useCards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Estado reativo', () => {
    it('deve expor todos os estados reativos', () => {
      const cards = useCards()

      expect(cards.userCards).toBeDefined()
      expect(cards.allCards).toBeDefined()
      expect(cards.pagination).toBeDefined()
      expect(cards.isLoading).toBeDefined()
      expect(cards.error).toBeDefined()
      expect(cards.userCardsCount).toBeDefined()
      expect(cards.allCardsCount).toBeDefined()
      expect(cards.hasUserCards).toBeDefined()
      expect(cards.hasMoreCards).toBeDefined()
    })

    it('deve expor valores corretos do store', () => {
      const cards = useCards()

      expect(cards.userCards.value).toEqual([])
      expect(cards.allCards.value).toEqual([])
      expect(cards.isLoading.value).toBe(false)
      expect(cards.error.value).toBe(null)
    })
  })

  describe('Ações', () => {
    it('deve expor todas as ações', () => {
      const cards = useCards()

      expect(typeof cards.fetchUserCards).toBe('function')
      expect(typeof cards.fetchAllCards).toBe('function')
      expect(typeof cards.addCardsToCollection).toBe('function')
      expect(typeof cards.loadMoreCards).toBe('function')
      expect(typeof cards.clearError).toBe('function')
      expect(typeof cards.resetState).toBe('function')
      expect(typeof cards.refreshCache).toBe('function')
    })

    it('deve chamar fetchUserCards do store', async () => {
      const cards = useCards()

      await cards.fetchUserCards()

      expect(mockCardsStore.fetchUserCards).toHaveBeenCalledTimes(1)
    })

    it('deve chamar fetchAllCards do store', async () => {
      const cards = useCards()
      const filters = { page: 1, rpp: 10 }

      await cards.fetchAllCards(filters)

      expect(mockCardsStore.fetchAllCards).toHaveBeenCalledWith(filters)
      expect(mockCardsStore.fetchAllCards).toHaveBeenCalledTimes(1)
    })

    it('deve chamar addCardsToCollection do store', async () => {
      const cards = useCards()
      const cardIds = ['card1', 'card2']

      await cards.addCardsToCollection(cardIds)

      expect(mockCardsStore.addCardsToCollection).toHaveBeenCalledWith(cardIds)
      expect(mockCardsStore.addCardsToCollection).toHaveBeenCalledTimes(1)
    })
  })

  describe('Cache', () => {
    it('deve limpar cache e buscar dados no refreshCache', () => {
      const cards = useCards()

      cards.refreshCache()

      expect(mockCache.clearCache).toHaveBeenCalledWith('cards-all')
      expect(mockCache.clearCache).toHaveBeenCalledWith('cards-user')
      expect(mockCardsStore.fetchAllCards).toHaveBeenCalledTimes(1)
      expect(mockCardsStore.fetchUserCards).toHaveBeenCalledTimes(1)
    })
  })
})

describe('useTrades', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Estado reativo', () => {
    it('deve expor todos os estados reativos', () => {
      const trades = useTrades()

      expect(trades.trades).toBeDefined()
      expect(trades.userTrades).toBeDefined()
      expect(trades.pagination).toBeDefined()
      expect(trades.isLoading).toBeDefined()
      expect(trades.error).toBeDefined()
      expect(trades.tradesCount).toBeDefined()
      expect(trades.userTradesCount).toBeDefined()
      expect(trades.hasMoreTrades).toBeDefined()
    })

    it('deve expor valores corretos do store', () => {
      const trades = useTrades()

      expect(trades.trades.value).toEqual([])
      expect(trades.userTrades.value).toEqual([])
      expect(trades.isLoading.value).toBe(false)
      expect(trades.error.value).toBe(null)
    })
  })

  describe('Ações', () => {
    it('deve expor todas as ações', () => {
      const trades = useTrades()

      expect(typeof trades.fetchAllTrades).toBe('function')
      expect(typeof trades.fetchUserTrades).toBe('function')
      expect(typeof trades.createTrade).toBe('function')
      expect(typeof trades.deleteTrade).toBe('function')
      expect(typeof trades.loadMoreTrades).toBe('function')
      expect(typeof trades.clearError).toBe('function')
      expect(typeof trades.resetState).toBe('function')
    })

    it('deve chamar fetchAllTrades do store', async () => {
      const trades = useTrades()
      const filters = { page: 1, rpp: 10 }

      await trades.fetchAllTrades(filters)

      expect(mockTradesStore.fetchAllTrades).toHaveBeenCalledWith(filters)
      expect(mockTradesStore.fetchAllTrades).toHaveBeenCalledTimes(1)
    })

    it('deve chamar createTrade do store', async () => {
      const trades = useTrades()
      const request = {
        cards: [
          { cardId: 'card1', type: 'OFFERING' as const },
          { cardId: 'card2', type: 'RECEIVING' as const }
        ]
      }

      await trades.createTrade(request)

      expect(mockTradesStore.createTrade).toHaveBeenCalledWith(request)
      expect(mockTradesStore.createTrade).toHaveBeenCalledTimes(1)
    })

    it('deve chamar deleteTrade do store', async () => {
      const trades = useTrades()
      const tradeId = 'trade123'

      await trades.deleteTrade(tradeId)

      expect(mockTradesStore.deleteTrade).toHaveBeenCalledWith(tradeId)
      expect(mockTradesStore.deleteTrade).toHaveBeenCalledTimes(1)
    })

    it('deve chamar clearError do store', () => {
      const trades = useTrades()

      trades.clearError()

      expect(mockTradesStore.clearError).toHaveBeenCalledTimes(1)
    })
  })
})


describe('Integração dos Composables', () => {
  it('deve funcionar em conjunto sem conflitos', () => {
    const auth = useAuth()
    const cards = useCards()
    const trades = useTrades()

    expect(auth).toBeDefined()
    expect(cards).toBeDefined()
    expect(trades).toBeDefined()

    expect(auth.isLoading).not.toBe(cards.isLoading)
    expect(cards.error).not.toBe(trades.error)
  })

  it('deve manter estados independentes', () => {
    const auth1 = useAuth()
    const auth2 = useAuth()

    expect(auth1.user).toBe(auth2.user)
    expect(auth1.login).toBe(auth2.login)
  })
})
