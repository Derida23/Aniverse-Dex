import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { Anime, JikanListResponse } from '@/types/jikan'

async function fetchPersonalizedRecommendations(genreIds: string): Promise<Anime[]> {
  if (!genreIds) return []
  const { data } = await apiClient.get<JikanListResponse<Anime>>('/anime', {
    params: { genres: genreIds, order_by: 'score', sort: 'desc' },
  })
  return data.data
}

export function usePersonalizedRecommendations(genreIds: string) {
  return useQuery({
    queryKey: ['recommendations', 'personalized', genreIds],
    queryFn: () => fetchPersonalizedRecommendations(genreIds),
    enabled: genreIds.length > 0,
  })
}
