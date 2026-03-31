import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, SearchX, Loader2 } from 'lucide-react'
import { AnimeCard } from '@/components/shared/anime-card'
import { AnimeGridSkeleton } from '@/components/shared/anime-card-skeleton'
import type { JikanListResponse, Anime } from '@/types/jikan'

interface AnimeGridProps {
  data: { pages: JikanListResponse<Anime>[] } | undefined
  isPending: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  isError: boolean
  error: Error | null
  fetchNextPage: () => void
}

export function AnimeGrid({
  data,
  isPending,
  isFetchingNextPage,
  hasNextPage,
  isError,
  error,
  fetchNextPage,
}: AnimeGridProps) {
  const { t } = useTranslation()
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isPending) {
    return <AnimeGridSkeleton count={12} />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="font-medium">{t('search.errorTitle')}</p>
        <p className="text-sm text-muted-foreground">
          {error?.message ?? t('search.errorMessage')}
        </p>
      </div>
    )
  }

  const allAnime = (() => {
    const raw = data?.pages.flatMap((page) => page.data) ?? []
    const seen = new Set<number>()
    return raw.filter((a) => {
      if (seen.has(a.mal_id)) return false
      seen.add(a.mal_id)
      return true
    })
  })()
  const total = data?.pages[0]?.pagination.items.total ?? 0

  if (allAnime.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <SearchX className="h-10 w-10 text-muted-foreground" />
        <p className="font-medium">{t('search.noResults')}</p>
        <p className="text-sm text-muted-foreground">
          {t('search.noResultsHint')}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {t('common.results', { count: total })}
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {allAnime.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>

      {/* Sentinel + loading indicator */}
      <div ref={sentinelRef} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  )
}
