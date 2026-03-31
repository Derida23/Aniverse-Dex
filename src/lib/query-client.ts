import { QueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 menit
      retry: 1,
      refetchOnWindowFocus: false,
      throwOnError: (error) => {
        return (error as AxiosError).response?.status !== undefined &&
          (error as AxiosError).response!.status >= 500
      },
    },
  },
})
