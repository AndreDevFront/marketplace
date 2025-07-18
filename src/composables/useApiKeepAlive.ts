import { onMounted } from 'vue'
import { httpClient } from '@/lib/http.client'

export const useApiKeepAlive = () => {
  const pingApi = async () => {
    try {
      await httpClient.get('/cards?rpp=1')
      console.log('✅ API acordada!')
    } catch (error) {
      console.log('🕐 API hibernada, tentando acordar...', error)
    }
  }

  onMounted(() => {
    pingApi()
  })


  const startKeepAlive = () => {
    setInterval(pingApi, 25 * 60 * 1000)
  }

  return { pingApi, startKeepAlive }
}
