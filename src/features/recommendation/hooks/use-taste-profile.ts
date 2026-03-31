import { useQueries } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { useWatchlistStore } from '@/features/watchlist'
import { animeDetailKeys } from '@/features/anime-detail/api/query-keys'
import type { AnimeDetail, JikanSingleResponse } from '@/types/jikan'

export interface TasteProfileEntry {
  name: string
  percentage: number
  count: number
}

const MAX_QUERIES = 10

async function fetchAnimeDetail(id: number): Promise<AnimeDetail> {
  const { data } = await apiClient.get<JikanSingleResponse<AnimeDetail>>(`/anime/${id}/full`)
  return data.data
}

export function useTasteProfile(): { profile: TasteProfileEntry[]; isLoading: boolean } {
  const items = useWatchlistStore((state) => state.items)

  const capped = items.slice(0, MAX_QUERIES)

  const results = useQueries({
    queries: capped.map((item) => ({
      queryKey: animeDetailKeys.full(item.id),
      queryFn: () => fetchAnimeDetail(item.id),
      staleTime: Infinity,
      enabled: item.id > 0,
    })),
  })

  const isLoading = results.some((r) => r.isLoading)

  const genreCount = new Map<string, number>()

  for (const result of results) {
    if (!result.data) continue
    for (const genre of result.data.genres) {
      genreCount.set(genre.name, (genreCount.get(genre.name) ?? 0) + 1)
    }
  }

  if (genreCount.size === 0) {
    return { profile: [], isLoading }
  }

  const sorted = [...genreCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

  const maxCount = sorted[0]?.[1] ?? 1

  const profile: TasteProfileEntry[] = sorted.map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / maxCount) * 100),
  }))

  return { profile, isLoading }
}
