import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { AnimeDetail, Character, Anime, AnimeReview, JikanSingleResponse, JikanListResponse } from '@/types/jikan'
import { animeDetailKeys } from './query-keys'

interface RecommendationEntry {
  entry: Anime
}

interface JikanRecommendationsResponse {
  data: RecommendationEntry[]
  pagination: {
    last_visible_page: number
    has_next_page: boolean
    current_page: number
    items: { count: number; total: number; per_page: number }
  }
}

async function fetchAnimeDetail(id: number): Promise<AnimeDetail> {
  const { data } = await apiClient.get<JikanSingleResponse<AnimeDetail>>(`/anime/${id}/full`)
  return data.data
}

async function fetchAnimeCharacters(id: number): Promise<Character[]> {
  const { data } = await apiClient.get<JikanListResponse<Character>>(`/anime/${id}/characters`)
  return data.data
}

async function fetchAnimeReviews(id: number): Promise<AnimeReview[]> {
  const { data } = await apiClient.get<JikanListResponse<AnimeReview>>(`/anime/${id}/reviews`)
  return data.data
}

async function fetchAnimeRecommendations(id: number): Promise<RecommendationEntry[]> {
  const { data } = await apiClient.get<JikanRecommendationsResponse>(`/anime/${id}/recommendations`)
  return data.data
}

export function useAnimeDetail(id: number) {
  return useQuery({
    queryKey: animeDetailKeys.full(id),
    queryFn: () => fetchAnimeDetail(id),
    enabled: id > 0,
  })
}

export function useAnimeCharacters(id: number) {
  return useQuery({
    queryKey: animeDetailKeys.characters(id),
    queryFn: async () => {
      // Small delay to avoid Jikan rate limit (3 req/s)
      await new Promise((r) => setTimeout(r, 400))
      return fetchAnimeCharacters(id)
    },
    enabled: id > 0,
    staleTime: Infinity,
  })
}

export function useAnimeReviews(id: number) {
  return useQuery({
    queryKey: animeDetailKeys.reviews(id),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 1200))
      return fetchAnimeReviews(id)
    },
    enabled: id > 0,
    staleTime: Infinity,
    retry: 2,
  })
}

export function useAnimeRecommendations(id: number) {
  return useQuery({
    queryKey: animeDetailKeys.recommendations(id),
    queryFn: async () => {
      // Delay to avoid Jikan rate limit after detail + characters
      await new Promise((r) => setTimeout(r, 800))
      return fetchAnimeRecommendations(id)
    },
    enabled: id > 0,
    staleTime: Infinity,
    retry: 2,
  })
}
