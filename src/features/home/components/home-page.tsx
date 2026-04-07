import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { usePageTitle } from '@/hooks/use-page-title'
import { Search, Bookmark, Star, Calendar, ArrowRight, Play, TrendingUp, Award, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/axios'
import type { Anime, JikanListResponse } from '@/types/jikan'

function dedupAnime(items: Anime[]): Anime[] {
  const seen = new Set<number>()
  return items.filter((a) => {
    if (seen.has(a.mal_id)) return false
    seen.add(a.mal_id)
    return true
  })
}

function useTopAiring() {
  return useQuery({
    queryKey: ['home', 'top-airing'],
    queryFn: async (): Promise<Anime[]> => {
      const { data } = await apiClient.get<JikanListResponse<Anime>>('/top/anime', {
        params: { filter: 'airing', limit: 5 },
      })
      return dedupAnime(data.data)
    },
    staleTime: 1000 * 60 * 30,
  })
}

function useTopUpcoming() {
  return useQuery({
    queryKey: ['home', 'top-upcoming'],
    queryFn: async (): Promise<Anime[]> => {
      await new Promise((r) => setTimeout(r, 400))
      const { data } = await apiClient.get<JikanListResponse<Anime>>('/top/anime', {
        params: { filter: 'upcoming', limit: 6 },
      })
      return dedupAnime(data.data)
    },
    staleTime: 1000 * 60 * 30,
  })
}

// Spotlight hero — big featured anime
function SpotlightHero({ anime }: { anime: Anime }) {
  const { t } = useTranslation()

  return (
    <Link to={`/anime/${anime.mal_id}`} className="group relative block overflow-hidden rounded-2xl">
      <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden">
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ objectPosition: '50% 25%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 overflow-hidden p-4 sm:p-6 md:p-8">
        <Badge className="mb-2 bg-primary/90 text-primary-foreground">
          <Sparkles className="mr-1 h-3 w-3" />
          {t('home.spotlight')}
        </Badge>
        <h2 className="text-lg font-extrabold text-white drop-shadow-lg sm:text-2xl md:text-3xl line-clamp-1">
          {anime.title_english ?? anime.title}
        </h2>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {anime.score != null && (
            <span className="flex items-center gap-1 rounded-md bg-yellow-500/20 px-2 py-0.5 text-xs font-bold text-yellow-400 sm:text-sm">
              <Star className="h-3 w-3 fill-current sm:h-3.5 sm:w-3.5" />
              {anime.score.toFixed(1)}
            </span>
          )}
          {anime.genres.slice(0, 3).map((g) => (
            <Badge key={g.mal_id} variant="secondary" className="bg-white/15 text-white border-white/20 text-[10px] sm:text-xs">
              {g.name}
            </Badge>
          ))}
        </div>
        {anime.synopsis && (
          <p className="mt-1.5 hidden text-xs text-white/80 max-w-lg sm:block md:text-sm">
            {anime.synopsis.slice(0, 120)}...
          </p>
        )}
        <div className="mt-2">
          <Button size="sm" className="gap-1.5 bg-white text-black hover:bg-white/90">
            <Play className="h-4 w-4 fill-current" />
            {t('home.viewDetail')}
          </Button>
        </div>
      </div>
    </Link>
  )
}

// Rank card — for top airing list
function RankCard({ anime, rank }: { anime: Anime; rank: number }) {
  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="group flex items-center gap-3 rounded-xl border bg-card p-2.5 transition-all hover:shadow-md hover:bg-accent/30"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-extrabold text-primary">
        {rank}
      </span>
      <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight line-clamp-1">
          {anime.title_english ?? anime.title}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          {anime.score != null && (
            <span className="flex items-center gap-0.5 text-yellow-500">
              <Star className="h-3 w-3 fill-current" />
              {anime.score.toFixed(1)}
            </span>
          )}
          {anime.genres.slice(0, 2).map((g) => (
            <span key={g.mal_id}>{g.name}</span>
          ))}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  )
}

// Upcoming anime card
function UpcomingCard({ anime }: { anime: Anime }) {
  return (
    <Link to={`/anime/${anime.mal_id}`} className="group flex flex-col gap-2">
      <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-muted">
        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {anime.score != null && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400">
            <Star className="h-2.5 w-2.5 fill-current" />
            {anime.score.toFixed(1)}
          </div>
        )}
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-semibold leading-tight line-clamp-2">
          {anime.title_english ?? anime.title}
        </p>
        <div className="flex flex-wrap gap-1">
          {anime.genres.slice(0, 2).map((g) => (
            <Badge key={g.mal_id} variant="secondary" className="text-[10px] px-1.5 py-0">
              {g.name}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}

function SpotlightSkeleton() {
  return <Skeleton className="aspect-video sm:aspect-[21/9] w-full rounded-2xl" />
}

function RankListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border p-2.5">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-16 w-11 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function UpcomingGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-3/4 w-full rounded-xl" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  const { t } = useTranslation()
  usePageTitle()

  const { data: topAiring, isPending: airingLoading } = useTopAiring()
  const { data: upcoming, isPending: upcomingLoading } = useTopUpcoming()

  const spotlightAnime = topAiring?.[0]
  const rankList = topAiring?.slice(1, 5) ?? []

  const features = [
    { to: '/search', icon: Search, titleKey: 'home.smartSearch', descKey: 'home.smartSearchDesc' },
    { to: '/watchlist', icon: Bookmark, titleKey: 'home.watchlist', descKey: 'home.watchlistDesc' },
    { to: '/recommendations', icon: Star, titleKey: 'home.forYou', descKey: 'home.forYouDesc' },
    { to: '/seasonal', icon: Calendar, titleKey: 'home.seasonal', descKey: 'home.seasonalDesc' },
  ]

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <h1 className="sr-only">Aniverse Dex</h1>

      {/* Hero: Spotlight + Top Airing Rank */}
      <section aria-label={t('home.spotlight')} className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="flex-1 min-w-0">
          {airingLoading || !spotlightAnime ? (
            <SpotlightSkeleton />
          ) : (
            <SpotlightHero anime={spotlightAnime} />
          )}
        </div>

        <aside className="w-full lg:w-80 shrink-0">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wide">{t('home.topAiring')}</h2>
          </div>
          {airingLoading ? (
            <RankListSkeleton />
          ) : (
            <ol className="space-y-2" aria-label={t('home.topAiring')}>
              {rankList.map((anime, i) => (
                <li key={anime.mal_id}>
                  <RankCard anime={anime} rank={i + 2} />
                </li>
              ))}
            </ol>
          )}
        </aside>
      </section>

      {/* Quick actions */}
      <nav aria-label="Quick actions">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button asChild size="lg" className="gap-2">
            <Link to="/search">
              <Search className="h-4 w-4" />
              {t('home.exploreAnime')}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/seasonal">
              <Calendar className="h-4 w-4" />
              {t('home.thisSeason')}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/recommendations">
              <Sparkles className="h-4 w-4" />
              {t('home.forYou')}
            </Link>
          </Button>
        </div>
      </nav>

      {/* Upcoming */}
      <section aria-label={t('home.upcoming')}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wide">{t('home.upcoming')}</h2>
          </div>
          <Link to="/search?status=upcoming" className="flex items-center gap-1 text-xs text-primary hover:underline">
            {t('home.viewAll')}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {upcomingLoading ? (
          <UpcomingGridSkeleton />
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {upcoming?.map((anime) => (
              <UpcomingCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )}
      </section>

      {/* Feature cards */}
      <section aria-label="Features" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ to, icon: Icon, titleKey, descKey }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="flex items-center justify-between text-base">
                  {t(titleKey)}
                  <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardTitle>
                <CardDescription>{t(descKey)}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  )
}
