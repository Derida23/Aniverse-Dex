import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Anime } from '@/types/jikan'
import { useCurrentSeason } from '../api/use-current-season'

interface SeasonCardProps {
  anime: Anime
}

function SeasonCard({ anime }: SeasonCardProps) {
  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="group flex flex-col gap-2 rounded-lg border bg-card p-2 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-3/4 overflow-hidden rounded-md bg-muted">
        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {anime.score != null && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs text-white">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {anime.score.toFixed(1)}
          </div>
        )}
      </div>
      <p className="line-clamp-2 text-xs font-medium leading-tight">{anime.title}</p>
    </Link>
  )
}

function SeasonCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-3/4 w-full rounded-md" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

interface HighlightSectionProps {
  title: string
  badge?: string
  animes: Anime[]
}

function HighlightSection({ title, badge, animes }: HighlightSectionProps) {
  if (animes.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold">{title}</h3>
        {badge && (
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {animes.map((anime) => (
          <SeasonCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </div>
  )
}

export function SeasonalHighlights() {
  const { t } = useTranslation()
  const { data, isPending, isError, error } = useCurrentSeason()

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        {[t('seasonal.topThisSeason'), t('seasonal.hiddenGems')].map((title) => (
          <div key={title} className="flex flex-col gap-3">
            <Skeleton className="h-5 w-40" />
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SeasonCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertCircle className="h-4 w-4" />
        <span>{error?.message ?? t('seasonal.failedHighlights')}</span>
      </div>
    )
  }

  const allAnime = data?.data ?? []

  const topThisSeason = [...allAnime]
    .filter((a) => a.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 6)

  const hiddenGems = allAnime
    .filter(
      (a) =>
        (a.score === null || a.score < 7.5) &&
        (a.favorites > 1_000 || a.members > 50_000),
    )
    .slice(0, 6)

  return (
    <div className="flex flex-col gap-8">
      <HighlightSection
        title={t('seasonal.topThisSeason')}
        badge={t('seasonal.byScore')}
        animes={topThisSeason}
      />
      <HighlightSection
        title={t('seasonal.hiddenGems')}
        badge={t('seasonal.underrated')}
        animes={hiddenGems}
      />
    </div>
  )
}
