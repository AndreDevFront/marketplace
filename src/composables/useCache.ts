
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

  const cached = async <T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMinutes: number = 5
  ): Promise<T> => {
    const now = Date.now()
    const cachedEntry = cache.get(key) as CacheEntry<T> | undefined

    if (cachedEntry && (now - cachedEntry.timestamp) < cachedEntry.ttl) {
      return cachedEntry.data
    }

    try {
      isLoading.value = true
      const data = await fetcher()

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

  const getCached = <T>(key: string): T | null => {
    const now = Date.now()
    const cachedEntry = cache.get(key) as CacheEntry<T> | undefined

    if (cachedEntry && (now - cachedEntry.timestamp) < cachedEntry.ttl) {
      return cachedEntry.data
    }

    return null
  }

  const hasCached = (key: string): boolean => {
    const now = Date.now()
    const cachedEntry = cache.get(key)

    return Boolean(
      cachedEntry && (now - cachedEntry.timestamp) < cachedEntry.ttl
    )
  }


  const clearCache = (key: string): boolean => {
    return cache.delete(key)
  }


  const clearAllCache = (): void => {
    cache.clear()
  }

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
