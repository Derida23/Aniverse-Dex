import { useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { AnimeFilters, JikanListResponse, Anime } from '@/types/jikan'
import { searchKeys } from './query-keys'

async function fetchAnimeList(
  filters: AnimeFilters,
  page: number,
): Promise<JikanListResponse<Anime>> {
  const params: Record<string, string | number> = {
    order_by: 'start_date',
    sort: 'desc',
    page,
  }

  if (filters.q) params['q'] = filters.q
  if (filters.genres) params['genres'] = filters.genres
  if (filters.min_score !== undefined) params['min_score'] = filters.min_score
  if (filters.status) params['status'] = filters.status
  if (filters.type) params['type'] = filters.type
  if (filters.rating) params['rating'] = filters.rating
  if (filters.start_date) params['start_date'] = filters.start_date

  const { data } = await apiClient.get<JikanListResponse<Anime>>('/anime', { params })
  return data
}

export function useAnimeList(filters: AnimeFilters) {
  const { page: _p, ...filterKey } = filters
  void _p // query key excludes page since infinite query handles it

  return useInfiniteQuery({
    queryKey: searchKeys.list(filterKey),
    queryFn: ({ pageParam }) => fetchAnimeList(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next_page
        ? lastPage.pagination.current_page + 1
        : undefined,
  })
}
