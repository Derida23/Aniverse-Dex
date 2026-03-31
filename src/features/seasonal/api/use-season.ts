import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { Anime, JikanListResponse } from '@/types/jikan'

async function fetchSeasonAnime(year: number, season: string): Promise<JikanListResponse<Anime>> {
  const { data } = await apiClient.get<JikanListResponse<Anime>>(`/seasons/${year}/${season}`)
  return data
}

export function useSeasonAnime(year: number, season: string) {
  return useQuery({
    queryKey: ['seasonal', 'season', year, season],
    queryFn: () => fetchSeasonAnime(year, season),
    staleTime: 1000 * 60 * 10,
    enabled: Boolean(year) && Boolean(season),
  })
}
