import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { Anime, JikanListResponse } from '@/types/jikan'

async function fetchCurrentSeason(): Promise<JikanListResponse<Anime>> {
  const { data } = await apiClient.get<JikanListResponse<Anime>>('/seasons/now')
  return data
}

export function useCurrentSeason() {
  return useQuery({
    queryKey: ['seasonal', 'current'],
    queryFn: fetchCurrentSeason,
    staleTime: 1000 * 60 * 10,
  })
}
