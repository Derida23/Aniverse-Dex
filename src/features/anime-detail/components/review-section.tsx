import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Star, ThumbsUp, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import type { AnimeReview } from '@/types/jikan'
import { useAnimeReviews } from '../api/use-anime-detail'

interface ReviewCardProps {
  review: AnimeReview
}

function ReviewCard({ review }: ReviewCardProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const date = new Date(review.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const scoreColor =
    review.score >= 8
      ? 'text-green-500 bg-green-500/15'
      : review.score >= 5
        ? 'text-yellow-500 bg-yellow-500/15'
        : 'text-red-500 bg-red-500/15'

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      {/* Header: user + score */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={review.user.images.jpg.image_url}
            alt={review.user.username}
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-border"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{review.user.username}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>

        <div className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-bold ${scoreColor}`}>
          <Star className="h-3.5 w-3.5 fill-current" />
          {review.score}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {review.is_spoiler && (
          <Badge variant="destructive" className="text-[10px] gap-1">
            <AlertTriangle className="h-3 w-3" />
            Spoiler
          </Badge>
        )}
        {review.is_preliminary && (
          <Badge variant="secondary" className="text-[10px]">
            {t('review.preliminary')}
          </Badge>
        )}
        {review.episodes_watched != null && (
          <Badge variant="outline" className="text-[10px]">
            {t('review.episodesWatched', { count: review.episodes_watched })}
          </Badge>
        )}
        {review.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-[10px]">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Review text */}
      <div>
        {review.is_spoiler && !expanded ? (
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-sm text-muted-foreground">{t('review.spoilerWarning')}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 text-xs"
              onClick={() => setExpanded(true)}
            >
              {t('review.showSpoiler')}
            </Button>
          </div>
        ) : (
          <p className={`text-sm leading-relaxed text-muted-foreground whitespace-pre-line ${!expanded ? 'line-clamp-4' : ''}`}>
            {review.review}
          </p>
        )}
        {!review.is_spoiler && review.review.length > 300 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 gap-1 px-0 text-xs text-primary hover:bg-transparent"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                {t('common.showLess')}
                <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                {t('common.showMore')}
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Reactions */}
      {review.reactions.overall > 0 && (
        <>
          <Separator />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{review.reactions.overall} {t('review.helpful')}</span>
          </div>
        </>
      )}
    </div>
  )
}

function ReviewSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

interface ReviewSectionProps {
  animeId: number
}

export default function ReviewSection({ animeId }: ReviewSectionProps) {
  const { t } = useTranslation()
  const { data: reviews, isPending, isError } = useAnimeReviews(animeId)
  const [showAll, setShowAll] = useState(false)

  if (isPending) {
    return (
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">{t('review.title')}</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">{t('review.title')}</h2>
        <p className="text-destructive text-sm">{t('review.failed')}</p>
      </section>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">{t('review.title')}</h2>
        <p className="text-muted-foreground text-sm italic">{t('review.empty')}</p>
      </section>
    )
  }

  const displayed = showAll ? reviews : reviews.slice(0, 3)

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {t('review.title')}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({reviews.length})
          </span>
        </h2>
      </div>

      <div className="space-y-4">
        {displayed.map((review) => (
          <ReviewCard key={review.mal_id} review={review} />
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="gap-1"
          >
            {showAll
              ? t('review.showLess', { count: reviews.length })
              : t('review.showMore', { count: reviews.length - 3 })}
            {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </section>
  )
}
