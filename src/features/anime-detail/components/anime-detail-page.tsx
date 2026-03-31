import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { usePageTitle } from '@/hooks/use-page-title'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useWatchlistStore } from '@/features/watchlist'
import { useAnimeDetail } from '../api/use-anime-detail'
import HeroSection from './hero-section'
import SynopsisSection from './synopsis-section'
import CharacterGrid from './character-grid'
import ReviewSection from './review-section'
import RecommendationsSection from './recommendations-section'

export default function AnimeDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const animeId = id ? Number(id) : 0

  const { data: anime, isPending, isError } = useAnimeDetail(animeId)
  usePageTitle(anime ? (anime.title_english ?? anime.title) : undefined)

  const addItem = useWatchlistStore((s) => s.addItem)
  const removeItem = useWatchlistStore((s) => s.removeItem)
  const isInWatchlist = useWatchlistStore((s) => s.items.some((i) => i.id === animeId))

  function handleToggleWatchlist() {
    if (!anime) return
    const title = anime.title_english ?? anime.title

    if (isInWatchlist) {
      removeItem(anime.mal_id)
      toast.success(t('watchlist.removedToast', { title }))
    } else {
      addItem({
        id: anime.mal_id,
        title,
        imageUrl: anime.images.jpg.image_url,
        score: anime.score,
        episodes: anime.episodes,
        type: anime.type,
        genres: anime.genres.map((g) => g.name),
        status: 'plan_to_watch',
      })
      toast.success(t('watchlist.addedToast', { title }))
    }
  }

  if (!id || animeId === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-destructive">{t('detail.invalidId')}</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          {t('common.goBack')}
        </Button>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-10 space-y-6">
        <div className="flex gap-6">
          <Skeleton className="w-48 md:w-64 aspect-[2/3] rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <Skeleton className="h-10 w-36 mt-4" />
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    )
  }

  if (isError || !anime) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-destructive font-medium">{t('detail.errorTitle')}</p>
        <p className="text-muted-foreground text-sm mt-1">
          {t('detail.errorMessage')}
        </p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          {t('common.goBack')}
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen -mx-4 -mt-6 animate-fade-in">
      <HeroSection
        anime={anime}
        isInWatchlist={isInWatchlist}
        onToggleWatchlist={handleToggleWatchlist}
      />

      <div className="px-4">
        <SynopsisSection synopsis={anime.synopsis} />

        <Separator />

        <CharacterGrid animeId={animeId} />

        <Separator />

        <ReviewSection animeId={animeId} />

        <Separator />

        <RecommendationsSection animeId={animeId} />
      </div>

    </div>
  )
}
