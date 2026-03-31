import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
})

// Auto-retry on 429 (rate limit) with exponential backoff
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config
    if (!config || error.response?.status !== 429) {
      return Promise.reject(error)
    }

    config._retryCount = (config._retryCount ?? 0) + 1

    if (config._retryCount > 3) {
      return Promise.reject(error)
    }

    const retryAfter = error.response?.headers?.['retry-after']
    const delay = retryAfter
      ? Number(retryAfter) * 1000
      : config._retryCount * 1000

    await new Promise((r) => setTimeout(r, delay))
    return apiClient(config)
  },
)
