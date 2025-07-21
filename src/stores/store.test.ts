import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    checkAuthStatus: vi.fn(),
    getCurrentUser: vi.fn()
  }
}))

vi.mock('@/services/cards.service', () => ({
  cardsService: {
    getUserCards: vi.fn(),
    getAllCards: vi.fn(),
    addCardsToUser: vi.fn()
  }
}))

vi.mock('@/services/trades.service', () => ({
  tradesService: {
    getAllTrades: vi.fn(),
    getUserTrades: vi.fn(),
    createTrade: vi.fn(),
    deleteTrade: vi.fn()
  }
}))

vi.mock('@/lib/auth.utils', () => ({
  getUserData: vi.fn(),
  getAuthToken: vi.fn()
}))


import { useAuthStore } from '@/stores/auth.store'
import { useCardsStore } from '@/stores/cards.store'
import { useTradesStore } from '@/stores/trades.store'
import { authService } from '@/services/auth.service'
import { cardsService } from '@/services/cards.service'
import { tradesService } from '@/services/trades.service'


beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})


describe('useAuthStore', () => {
  describe('login()', () => {
    it('deve fazer login com sucesso', async () => {
      const store = useAuthStore()
      const credentials = { email: 'test@test.com', password: '123456' }
      const mockResponse = {
        user: { id: '1', name: 'Test User', email: 'test@test.com' },
        token: 'mock-token'
      }

      vi.mocked(authService.login).mockResolvedValue(mockResponse)

      await store.login(credentials)

      expect(authService.login).toHaveBeenCalledWith(credentials)
      expect(store.user).toEqual(mockResponse.user)
      expect(store.token).toBe(mockResponse.token)
      expect(store.isLoading).toBe(false)
    })

    it('deve tratar erro no login', async () => {
      const store = useAuthStore()
      const credentials = { email: 'test@test.com', password: 'wrong' }
      const mockError = { message: 'Credenciais inválidas' }

      vi.mocked(authService.login).mockRejectedValue(mockError)

      await expect(store.login(credentials)).rejects.toEqual(mockError)
      expect(store.user).toBe(null)
      expect(store.token).toBe(null)
      expect(store.error).toBe('Credenciais inválidas')
    })
  })

  describe('register()', () => {
    it('deve registrar usuário com sucesso', async () => {
      const store = useAuthStore()
      const userData = {
        name: 'Test User',
        email: 'test@test.com',
        password: '123456',
        confirmPassword: '123456'
      }
      const mockResponse = { userId: 'user-123' }

      vi.mocked(authService.register).mockResolvedValue(mockResponse)

      const result = await store.register(userData)

      expect(authService.register).toHaveBeenCalledWith(userData)
      expect(result).toBe('user-123')
      expect(store.error).toBe(null)
    })

    it('deve tratar erro no registro', async () => {
      const store = useAuthStore()
      const userData = {
        name: 'Test',
        email: 'invalid@test.com',
        password: '123456',
        confirmPassword: '123456'
      }
      const mockError = { message: 'Email já existe' }

      vi.mocked(authService.register).mockRejectedValue(mockError)

      await expect(store.register(userData)).rejects.toEqual(mockError)
      expect(store.error).toBe('Email já existe')
    })
  })

  describe('logout()', () => {
    it('deve fazer logout com sucesso', async () => {
      const store = useAuthStore()
      store.user = { id: '1', name: 'Test', email: 'test@test.com' }
      store.token = 'mock-token'

      vi.mocked(authService.logout).mockResolvedValue(undefined)

      await store.logout()

      expect(authService.logout).toHaveBeenCalledTimes(1)
      expect(store.user).toBe(null)
      expect(store.token).toBe(null)
      expect(store.error).toBe(null)
    })
  })

  describe('computed properties', () => {
    it('deve calcular isAuthenticated corretamente', () => {
      const store = useAuthStore()

      expect(store.isAuthenticated).toBe(false)

      store.user = { id: '1', name: 'Test', email: 'test@test.com' }
      store.token = 'mock-token'

      expect(store.isAuthenticated).toBe(true)
    })

    it('deve calcular userDisplayName corretamente', () => {
      const store = useAuthStore()
      expect(store.userDisplayName).toBe('Usuário')
      store.user = { id: '1', name: 'João Silva', email: 'joao@test.com' }
      expect(store.userDisplayName).toBe('João Silva')
    })
  })
})

describe('useCardsStore', () => {
  describe('fetchUserCards()', () => {
    it('deve buscar cartas do usuário com sucesso', async () => {
      const store = useCardsStore()
      const mockCards = [
        { id: '1', name: 'Card 1', description: 'Desc 1', imageUrl: 'url1', createdAt: '2024-01-01' }
      ]

      vi.mocked(cardsService.getUserCards).mockResolvedValue(mockCards)

      await store.fetchUserCards()

      expect(cardsService.getUserCards).toHaveBeenCalledTimes(1)
      expect(store.userCards).toEqual(mockCards)
      expect(store.error).toBe(null)
    })

    it('deve tratar erro ao buscar cartas', async () => {
      const store = useCardsStore()
      const mockError = new Error('Erro ao buscar cartas')

      vi.mocked(cardsService.getUserCards).mockRejectedValue(mockError)

      await store.fetchUserCards()

      expect(store.userCards).toEqual([])
      expect(store.error).toBe('Erro ao buscar cartas')
    })
  })

  describe('addCardsToCollection()', () => {
    it('deve adicionar cartas à coleção com sucesso', async () => {
      const store = useCardsStore()
      const cardIds = ['card1', 'card2']
      const updatedCards = [
        { id: 'card1', name: 'Card 1', description: 'Desc 1', imageUrl: 'url1', createdAt: '2024-01-01' }
      ]

      vi.mocked(cardsService.addCardsToUser).mockResolvedValue(undefined)
      vi.mocked(cardsService.getUserCards).mockResolvedValue(updatedCards)

      await store.addCardsToCollection(cardIds)

      expect(cardsService.addCardsToUser).toHaveBeenCalledWith(cardIds)
      expect(store.userCards).toEqual(updatedCards)
      expect(store.error).toBe(null)
    })

    it('deve tratar erro ao adicionar cartas', async () => {
      const store = useCardsStore()
      const cardIds = ['card1']
      const mockError = new Error('Erro ao adicionar cartas')

      vi.mocked(cardsService.addCardsToUser).mockRejectedValue(mockError)

      await expect(store.addCardsToCollection(cardIds)).rejects.toEqual(mockError)
      expect(store.error).toBe('Erro ao adicionar cartas')
    })
  })

  describe('computed properties', () => {
    it('deve calcular userCardsCount corretamente', async () => {
      const store = useCardsStore()
      const mockCards = [
        { id: '1', name: 'Card 1', description: 'Desc', imageUrl: 'url', createdAt: '2024-01-01' }
      ]

      expect(store.userCardsCount).toBe(0)

      vi.mocked(cardsService.getUserCards).mockResolvedValue(mockCards)
      await store.fetchUserCards()

      expect(store.userCardsCount).toBe(1)
    })

    it('deve calcular hasUserCards corretamente', async () => {
      const store = useCardsStore()
      const mockCards = [
        { id: '1', name: 'Card 1', description: 'Desc', imageUrl: 'url', createdAt: '2024-01-01' }
      ]

      expect(store.hasUserCards).toBe(false)

      vi.mocked(cardsService.getUserCards).mockResolvedValue(mockCards)
      await store.fetchUserCards()

      expect(store.hasUserCards).toBe(true)
    })
  })
})

describe('useTradesStore', () => {
  describe('fetchAllTrades()', () => {
    it('deve buscar todas as trocas com sucesso', async () => {
      const store = useTradesStore()
      const mockTrades = [
        { id: 'trade1', userId: 'user1', createdAt: '2024-01-01', user: { name: 'User' }, tradeCards: [] }
      ]
      const mockResponse = { list: mockTrades, page: 1, rpp: 10, more: false }

      vi.mocked(tradesService.getAllTrades).mockResolvedValue(mockResponse)

      await store.fetchAllTrades()

      expect(tradesService.getAllTrades).toHaveBeenCalledTimes(1)
      expect(store.trades).toEqual(mockTrades)
      expect(store.error).toBe(null)
    })
  })

  describe('createTrade()', () => {
    it('deve criar troca com sucesso', async () => {
      const store = useTradesStore()
      const request = {
        cards: [
          { cardId: 'card1', type: 'OFFERING' as const },
          { cardId: 'card2', type: 'RECEIVING' as const }
        ]
      }
      const mockResponse = { tradeId: 'trade-123' }
      const mockTradesResponse = { list: [], page: 1, rpp: 10, more: false }

      vi.mocked(tradesService.createTrade).mockResolvedValue(mockResponse)
      vi.mocked(tradesService.getAllTrades).mockResolvedValue(mockTradesResponse)
      vi.mocked(tradesService.getUserTrades).mockResolvedValue([])

      const result = await store.createTrade(request)

      expect(tradesService.createTrade).toHaveBeenCalledWith(request)
      expect(tradesService.getAllTrades).toHaveBeenCalledTimes(1)
      expect(tradesService.getUserTrades).toHaveBeenCalledTimes(1)
      expect(result).toBe('trade-123')
      expect(store.error).toBe(null)
    })

    it('deve tratar erro ao criar troca', async () => {
      const store = useTradesStore()
      const request = {
        cards: [{ cardId: 'card1', type: 'OFFERING' as const }]
      }
      const mockError = new Error('Erro ao criar troca')

      vi.mocked(tradesService.createTrade).mockRejectedValue(mockError)

      await expect(store.createTrade(request)).rejects.toEqual(mockError)
      expect(store.error).toBe('Erro ao criar troca')
    })
  })

  describe('deleteTrade()', () => {
    it('deve deletar troca com sucesso', async () => {
      const store = useTradesStore()
      const tradeId = 'trade-123'
      const initialTrades = [
        { id: 'trade-123', userId: 'user1', createdAt: '2024-01-01', user: { name: 'User' }, tradeCards: [] },
        { id: 'trade-456', userId: 'user1', createdAt: '2024-01-02', user: { name: 'User' }, tradeCards: [] }
      ]

      const mockTradesResponse = { list: initialTrades, page: 1, rpp: 10, more: false }
      vi.mocked(tradesService.getAllTrades).mockResolvedValue(mockTradesResponse)
      vi.mocked(tradesService.getUserTrades).mockResolvedValue(initialTrades)

      await store.fetchAllTrades()
      await store.fetchUserTrades()

      vi.mocked(tradesService.deleteTrade).mockResolvedValue(undefined)

      await store.deleteTrade(tradeId)

      expect(tradesService.deleteTrade).toHaveBeenCalledWith(tradeId)
      expect(store.trades).toHaveLength(1)
      expect(store.trades[0].id).toBe('trade-456')
      expect(store.error).toBe(null)
    })
  })

  describe('computed properties', () => {
    it('deve calcular tradesCount corretamente', async () => {

      const store = useTradesStore()
      const mockTrades = [
        { id: 'trade1', userId: 'user1', createdAt: '2024-01-01', user: { name: 'User' }, tradeCards: [] }
      ]
      const mockTradesResponse = { list: mockTrades, page: 1, rpp: 10, more: false }

      expect(store.tradesCount).toBe(0)

      vi.mocked(tradesService.getAllTrades).mockResolvedValue(mockTradesResponse)
      await store.fetchAllTrades()

      expect(store.tradesCount).toBe(1)
    })
  })

  describe('utility methods', () => {
    it('deve limpar erro com clearError', async () => {
      const store = useTradesStore()

      const mockError = new Error('Algum erro')
      vi.mocked(tradesService.getAllTrades).mockRejectedValue(mockError)

      await store.fetchAllTrades()
      expect(store.error).toBe('Algum erro')

      store.clearError()

      expect(store.error).toBe(null)
    })

    it('deve resetar estado com resetState', async () => {
      const store = useTradesStore()
      const mockTrades = [{ id: 'trade1', userId: 'user1', createdAt: '2024-01-01', user: { name: 'User' }, tradeCards: [] }]
      const mockTradesResponse = { list: mockTrades, page: 1, rpp: 10, more: false }

      vi.mocked(tradesService.getAllTrades).mockResolvedValue(mockTradesResponse)
      vi.mocked(tradesService.getUserTrades).mockResolvedValue(mockTrades)

      await store.fetchAllTrades()
      await store.fetchUserTrades()

      expect(store.trades).toHaveLength(1)
      expect(store.userTrades).toHaveLength(1)

      store.resetState()

      expect(store.trades).toEqual([])
      expect(store.userTrades).toEqual([])
      expect(store.error).toBe(null)
      expect(store.pagination).toEqual({ page: 1, rpp: 10, more: false })
    })
  })
})
