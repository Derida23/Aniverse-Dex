import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { Anime, JikanListResponse } from '@/types/jikan'

async function fetchGlobalRecommendations(): Promise<Anime[]> {
  const { data } = await apiClient.get<JikanListResponse<Anime>>('/top/anime', {
    params: { filter: 'bypopularity' },
  })
  return data.data
}

export function useGlobalRecommendations() {
  return useQuery({
    queryKey: ['recommendations', 'global'],
    queryFn: fetchGlobalRecommendations,
  })
}
