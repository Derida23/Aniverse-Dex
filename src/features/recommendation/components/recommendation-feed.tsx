import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/axios'
import type { Anime, JikanListResponse } from '@/types/jikan'
import { useGlobalRecommendations } from '../api/use-global-recommendations'
import { usePersonalizedRecommendations } from '../api/use-personalized-recommendations'
import { useTasteProfile } from '../hooks/use-taste-profile'
import { GENRE_NAME_TO_ID } from '@/lib/genres'
import RecommendationCard from './recommendation-card'

async function fetchTopAiring(): Promise<Anime[]> {
  const { data } = await apiClient.get<JikanListResponse<Anime>>('/top/anime', {
    params: { filter: 'airing' },
  })
  return data.data
}

function useTopAiring() {
  return useQuery({
    queryKey: ['recommendations', 'top-rated'],
    queryFn: fetchTopAiring,
  })
}

function useSimilarAnime(genreId: string) {
  return useQuery({
    queryKey: ['recommendations', 'similar', genreId],
    queryFn: async (): Promise<Anime[]> => {
      const { data } = await apiClient.get<JikanListResponse<Anime>>('/anime', {
        params: { genres: genreId, order_by: 'score', sort: 'desc' },
      })
      return data.data
    },
    enabled: genreId.length > 0,
  })
}

function dedup(items: Anime[]): Anime[] {
  const seen = new Set<number>()
  return items.filter((a) => {
    if (seen.has(a.mal_id)) return false
    seen.add(a.mal_id)
    return true
  })
}

function CardGrid({ items, reason }: { items: Anime[]; reason?: string }) {
  const unique = dedup(items)
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {unique.map((anime) => (
        <RecommendationCard key={anime.mal_id} anime={anime} {...(reason !== undefined ? { reason } : {})} />
      ))}
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-2/3 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-50 items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}

function TabRefreshHeader({ onRefresh }: { onRefresh: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="flex justify-end">
      <Button variant="outline" size="sm" onClick={onRefresh}>
        {t('common.refresh')}
      </Button>
    </div>
  )
}

export default function RecommendationFeed() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { profile } = useTasteProfile()

  const personalizedGenreIds = profile
    .slice(0, 5)
    .map((e) => GENRE_NAME_TO_ID[e.name])
    .filter((id): id is number => id !== undefined)
    .join(',')

  const topGenre = profile[0]
  const similarGenreId = topGenre !== undefined
    ? (GENRE_NAME_TO_ID[topGenre.name]?.toString() ?? '')
    : ''

  const globalQuery = useGlobalRecommendations()
  const personalizedQuery = usePersonalizedRecommendations(personalizedGenreIds)
  const topAiringQuery = useTopAiring()
  const similarAnimeQuery = useSimilarAnime(similarGenreId)

  function handleRefresh(tab: 'for-you' | 'trending' | 'top-rated' | 'similar') {
    const keyMap = {
      'for-you': ['recommendations', 'personalized'],
      trending: ['recommendations', 'global'],
      'top-rated': ['recommendations', 'top-rated'],
      similar: ['recommendations', 'similar'],
    } as const
    void queryClient.invalidateQueries({ queryKey: keyMap[tab] })
  }

  return (
    <Tabs defaultValue="for-you" className="w-full">
      <TabsList className="mb-4 grid w-full grid-cols-4">
        <TabsTrigger value="for-you">{t('recommendation.tabs.forYou')}</TabsTrigger>
        <TabsTrigger value="trending">{t('recommendation.tabs.trending')}</TabsTrigger>
        <TabsTrigger value="top-rated">{t('recommendation.tabs.topRated')}</TabsTrigger>
        <TabsTrigger value="similar">{t('recommendation.tabs.similar')}</TabsTrigger>
      </TabsList>

      <TabsContent value="for-you" className="space-y-4">
        <TabRefreshHeader onRefresh={() => handleRefresh('for-you')} />
        {!personalizedGenreIds ? (
          <EmptyState message={t('recommendation.emptyPersonalized')} />
        ) : personalizedQuery.isLoading ? (
          <LoadingGrid />
        ) : personalizedQuery.isError ? (
          <EmptyState message={t('recommendation.failedRecommendations')} />
        ) : (personalizedQuery.data?.length ?? 0) === 0 ? (
          <EmptyState message={t('recommendation.noRecommendations')} />
        ) : (
          <CardGrid
            items={personalizedQuery.data ?? []}
            {...(topGenre !== undefined ? { reason: t('recommendation.becauseYouLike', { genre: topGenre.name }) } : {})}
          />
        )}
      </TabsContent>

      <TabsContent value="trending" className="space-y-4">
        <TabRefreshHeader onRefresh={() => handleRefresh('trending')} />
        {globalQuery.isLoading ? (
          <LoadingGrid />
        ) : globalQuery.isError ? (
          <EmptyState message={t('recommendation.failedTrending')} />
        ) : (globalQuery.data?.length ?? 0) === 0 ? (
          <EmptyState message={t('recommendation.noTrending')} />
        ) : (
          <CardGrid items={globalQuery.data ?? []} />
        )}
      </TabsContent>

      <TabsContent value="top-rated" className="space-y-4">
        <TabRefreshHeader onRefresh={() => handleRefresh('top-rated')} />
        {topAiringQuery.isLoading ? (
          <LoadingGrid />
        ) : topAiringQuery.isError ? (
          <EmptyState message={t('recommendation.failedTopRated')} />
        ) : (topAiringQuery.data?.length ?? 0) === 0 ? (
          <EmptyState message={t('recommendation.noTopRated')} />
        ) : (
          <CardGrid items={topAiringQuery.data ?? []} />
        )}
      </TabsContent>

      <TabsContent value="similar" className="space-y-4">
        <TabRefreshHeader onRefresh={() => handleRefresh('similar')} />
        {!similarGenreId ? (
          <EmptyState message={t('recommendation.emptySimilar')} />
        ) : similarAnimeQuery.isLoading ? (
          <LoadingGrid />
        ) : similarAnimeQuery.isError ? (
          <EmptyState message={t('recommendation.failedSimilar')} />
        ) : (similarAnimeQuery.data?.length ?? 0) === 0 ? (
          <EmptyState message={t('recommendation.noSimilar')} />
        ) : (
          <CardGrid
            items={similarAnimeQuery.data ?? []}
            {...(topGenre !== undefined ? { reason: t('recommendation.similarLove', { genre: topGenre.name }) } : {})}
          />
        )}
      </TabsContent>
    </Tabs>
  )
}
