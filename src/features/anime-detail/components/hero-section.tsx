import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Star, BookmarkPlus, BookmarkCheck, Tv, Clock, Activity, Play, Share2, GitCompare, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCompareStore } from '@/features/compare'
import type { AnimeDetail } from '@/types/jikan'

interface HeroSectionProps {
  anime: AnimeDetail
  isInWatchlist: boolean
  onToggleWatchlist: () => void
}

export default function HeroSection({ anime, isInWatchlist, onToggleWatchlist }: HeroSectionProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const allTags = [...(anime.genres ?? []), ...(anime.themes ?? [])]
  const trailerUrl = anime.trailer?.url

  const isInCompare = useCompareStore((s) => s.items.some((i) => i.id === anime.mal_id))
  const compareCount = useCompareStore((s) => s.items.length)
  const addCompare = useCompareStore((s) => s.addItem)
  const removeCompare = useCompareStore((s) => s.removeItem)
  const isFull = compareCount >= 2

  function handleCompare() {
    if (isInCompare) {
      removeCompare(anime.mal_id)
      toast.info(t('compare.removed', { title: anime.title_english ?? anime.title }))
    } else if (isFull) {
      navigate('/compare')
    } else {
      addCompare({
        id: anime.mal_id,
        title: anime.title_english ?? anime.title,
        imageUrl: anime.images.jpg.image_url,
      })
      toast.success(t('compare.added', { title: anime.title_english ?? anime.title }))
      if (compareCount === 1) {
        navigate('/compare')
      }
    }
  }

  async function handleShare(): Promise<void> {
    const title = anime.title_english ?? anime.title
    const shareData = {
      title,
      text: t('detail.shareText', { title }),
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch { /* cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success(t('common.linkCopied'))
      } catch { /* unavailable */ }
    }
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={anime.images.jpg.large_image_url}
          alt=""
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background from-10% via-background/80 via-60% to-background/30 md:from-5% md:via-50%" />
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-background from-30% via-background/50 via-60% to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="flex min-h-[75vh] flex-col items-center justify-end gap-6 pb-12 pt-24 text-center lg:min-h-[70vh] lg:flex-row lg:items-center lg:justify-start lg:gap-8 lg:py-16 lg:text-left">

          {/* Mobile + Tablet poster */}
          <div className="shrink-0 lg:hidden mb-2">
            <img
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              className="w-36 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 aspect-2/3 sm:w-44 md:w-52"
            />
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col items-center gap-3 min-w-0 lg:items-start lg:gap-4">
            <div>
              <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
                {anime.title_english ?? anime.title}
              </h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="mt-1 text-sm text-muted-foreground lg:text-lg">
                  {anime.title}
                </p>
              )}
            </div>

            {/* Score + Meta */}
            <div className="flex flex-wrap justify-center items-center gap-2 text-xs lg:justify-start lg:gap-3 lg:text-sm">
              {anime.score != null && (
                <div className="flex items-center gap-1 rounded-md bg-yellow-500/20 px-2 py-1 text-yellow-500 dark:text-yellow-400">
                  <Star className="h-3.5 w-3.5 fill-current lg:h-4 lg:w-4" />
                  <span className="font-bold">{anime.score.toFixed(1)}</span>
                  {anime.scored_by != null && (
                    <span className="text-[10px] text-muted-foreground ml-0.5 lg:text-xs lg:ml-1">
                      ({(anime.scored_by / 1000).toFixed(0)}K)
                    </span>
                  )}
                </div>
              )}
              {anime.episodes != null && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Tv className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  {t('detail.episodes', { count: anime.episodes })}
                </span>
              )}
              {anime.duration && (
                <span className="hidden sm:flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  {anime.duration}
                </span>
              )}
              <span className="flex items-center gap-1 text-muted-foreground">
                <Activity className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                {anime.status}
              </span>
              {anime.year && (
                <span className="text-muted-foreground">
                  {anime.season ? `${anime.season.charAt(0).toUpperCase()}${anime.season.slice(1)} ` : ''}
                  {anime.year}
                </span>
              )}
            </div>

            {/* Genres */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 lg:justify-start">
                {allTags.map((tag) => (
                  <Badge
                    key={`${tag.mal_id}-${tag.name}`}
                    variant="secondary"
                    className="bg-foreground/10 text-foreground backdrop-blur-sm border-foreground/10 text-xs"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Synopsis preview */}
            {anime.synopsis && (
              <p className="hidden sm:block line-clamp-3 text-sm leading-relaxed text-muted-foreground max-w-xl">
                {anime.synopsis}
              </p>
            )}

            {/* Studios */}
            {anime.studios.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {anime.studios.map((s) => s.name).join(' / ')}
              </p>
            )}

            {/* Action buttons: trailer, watchlist, share, compare */}
            <div className="flex flex-wrap justify-center items-center gap-2 pt-2 lg:justify-start lg:gap-3">
              {trailerUrl && (
                <Button asChild size="lg" className="gap-2">
                  <a href={trailerUrl} target="_blank" rel="noopener noreferrer">
                    <Play className="h-4 w-4 fill-current lg:h-5 lg:w-5" />
                    Trailer
                  </a>
                </Button>
              )}
              <Button
                onClick={onToggleWatchlist}
                variant={isInWatchlist ? 'secondary' : trailerUrl ? 'outline' : 'default'}
                size="lg"
                className="gap-2"
              >
                {isInWatchlist ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 lg:h-5 lg:w-5" />
                    {t('watchlist.inWatchlist')}
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="h-4 w-4 lg:h-5 lg:w-5" />
                    {t('watchlist.add')}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => { void handleShare() }}
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t('common.share')}</span>
              </Button>
              <Button
                variant={isInCompare ? 'secondary' : 'outline'}
                size="sm"
                className="gap-1.5"
                onClick={handleCompare}
              >
                {isInCompare ? <Check className="h-4 w-4" /> : <GitCompare className="h-4 w-4" />}
                <span className="hidden sm:inline">
                  {isInCompare ? t('compare.inCompare') : t('common.compare')}
                </span>
                {!isInCompare && compareCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {compareCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Desktop poster — right side */}
          <div className="hidden shrink-0 lg:block">
            <div className="relative">
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                className="w-56 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 aspect-2/3 lg:w-72"
              />
              <div
                className="absolute -inset-4 -z-10 rounded-3xl opacity-30 blur-2xl dark:opacity-40"
                style={{
                  backgroundImage: `url(${anime.images.jpg.large_image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
