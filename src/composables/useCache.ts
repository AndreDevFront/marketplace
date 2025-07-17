
import { ref, readonly } from 'vue'

interface CacheEntry<T> {
  readonly data: T
  readonly timestamp: number
  readonly ttl: number
}

type CacheMap = Map<string, CacheEntry<unknown>>

const cache: CacheMap = new Map()

export const useCache = () => {
  const isLoading = ref(false)

  /**
   * Cache com TTL - Type Safe
   * @param key - Chave única do cache
   * @param fetcher - Função que busca os dados
   * @param ttlMinutes - Tempo de vida em minutos (padrão: 5)
   */
  const cached = async <T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMinutes: number = 5
  ): Promise<T> => {
    const now = Date.now()
    const cachedEntry = cache.get(key) as CacheEntry<T> | undefined

    // Cache hit - dados ainda válidos
    if (cachedEntry && (now - cachedEntry.timestamp) < cachedEntry.ttl) {
      return cachedEntry.data
    }

    // Cache miss - buscar dados novos
    try {
      isLoading.value = true
      const data = await fetcher()

      // Salvar no cache com tipagem correta
      const entry: CacheEntry<T> = {
        data,
        timestamp: now,
        ttl: ttlMinutes * 60 * 1000
      }

      cache.set(key, entry)

      return data
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Buscar dados do cache (sem fetch)
   * @param key - Chave do cache
   * @returns Dados ou null se não existir/expirado
   */
  const getCached = <T>(key: string): T | null => {
    const now = Date.now()
    const cachedEntry = cache.get(key) as CacheEntry<T> | undefined

    if (cachedEntry && (now - cachedEntry.timestamp) < cachedEntry.ttl) {
      return cachedEntry.data
    }

    return null
  }

  /**
   * Verificar se existe cache válido
   * @param key - Chave do cache
   */
  const hasCached = (key: string): boolean => {
    const now = Date.now()
    const cachedEntry = cache.get(key)

    return Boolean(
      cachedEntry && (now - cachedEntry.timestamp) < cachedEntry.ttl
    )
  }

  /**
   * Limpar cache específico
   * @param key - Chave do cache a ser removida
   */
  const clearCache = (key: string): boolean => {
    return cache.delete(key)
  }

  /**
   * Limpar todo o cache
   */
  const clearAllCache = (): void => {
    cache.clear()
  }

  /**
   * Obter estatísticas do cache
   */
  const getCacheStats = () => {
    const entries = Array.from(cache.entries())
    const now = Date.now()

    const valid = entries.filter(([, entry]) =>
      (now - entry.timestamp) < entry.ttl
    )

    const expired = entries.length - valid.length

    return {
      total: entries.length,
      valid: valid.length,
      expired,
      size: cache.size
    }
  }

  /**
   * Limpar apenas entradas expiradas
   */
  const clearExpired = (): number => {
    const now = Date.now()
    let removedCount = 0

    for (const [key, entry] of cache.entries()) {
      if ((now - entry.timestamp) >= entry.ttl) {
        cache.delete(key)
        removedCount++
      }
    }

    return removedCount
  }

  return {
    cached,
    getCached,
    hasCached,

    clearCache,
    clearAllCache,
    clearExpired,

    getCacheStats,

    isLoading: readonly(isLoading)
  }
}


export type CacheKey = string
export type CacheFetcher<T> = () => Promise<T>
export type CacheOptions = {
  ttl?: number
}


export const createCacheKey = (...parts: (string | number)[]): string => {
  return parts.join(':')
}


export const useApiCache = (baseKey: string = 'api') => {
  const cache = useCache()

  const cachedApiCall = <T>(
    endpoint: string,
    fetcher: () => Promise<T>,
    ttlMinutes: number = 5
  ): Promise<T> => {
    const key = createCacheKey(baseKey, endpoint)
    return cache.cached(key, fetcher, ttlMinutes)
  }

  return {
    ...cache,
    cachedApiCall
  }
}
