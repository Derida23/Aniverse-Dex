import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/use-page-title'
import { Link } from 'react-router-dom'
import { X, Search, Trophy, TrendingUp, ExternalLink } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { apiClient } from '@/lib/axios'
import { animeDetailKeys } from '@/features/anime-detail/api/query-keys'
import type { AnimeDetail, JikanSingleResponse } from '@/types/jikan'
import { useCompareStore } from '../store/compare-store'

async function fetchDetail(id: number): Promise<AnimeDetail> {
  const { data } = await apiClient.get<JikanSingleResponse<AnimeDetail>>(`/anime/${id}/full`)
  return data.data
}

function useCompareDetail(id: number | undefined) {
  return useQuery({
    queryKey: animeDetailKeys.full(id ?? 0),
    queryFn: () => fetchDetail(id!),
    enabled: id !== undefined && id > 0,
    staleTime: Infinity,
  })
}

// ─── Stat Row with visual bar ───

interface StatRowProps {
  label: string
  left: string | number | null | undefined
  right: string | number | null | undefined
  higherIsBetter?: boolean
  showBar?: boolean
  maxVal?: number
}

function StatRow({ label, left, right, higherIsBetter = true, showBar, maxVal }: StatRowProps) {
  const leftNum = typeof left === 'number' ? left : null
  const rightNum = typeof right === 'number' ? right : null

  let leftWin = false
  let rightWin = false
  if (leftNum != null && rightNum != null && leftNum !== rightNum) {
    leftWin = higherIsBetter ? leftNum > rightNum : leftNum < rightNum
    rightWin = !leftWin
  }

  const barMax = maxVal ?? (Math.max(leftNum ?? 0, rightNum ?? 0) || 1)

  return (
    <div className="py-3 border-b border-border/50 last:border-0">
      <p className="text-xs text-center font-medium text-muted-foreground uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-4">
        {/* Left */}
        <div className="text-right">
          <p className={`text-sm ${leftWin ? 'font-bold text-primary' : 'text-foreground'}`}>
            {left ?? '—'}
            {leftWin && ' ✦'}
          </p>
          {showBar && leftNum != null && (
            <div className="mt-1 flex justify-end">
              <div className="w-full max-w-32">
                <Progress value={(leftNum / barMax) * 100} className="h-1.5" />
              </div>
            </div>
          )}
        </div>
        {/* Right */}
        <div>
          <p className={`text-sm ${rightWin ? 'font-bold text-primary' : 'text-foreground'}`}>
            {rightWin && '✦ '}
            {right ?? '—'}
          </p>
          {showBar && rightNum != null && (
            <div className="mt-1">
              <div className="w-full max-w-32">
                <Progress value={(rightNum / barMax) * 100} className="h-1.5" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Text Compare Row ───

function TextRow({ label, left, right }: { label: string; left: string; right: string }) {
  return (
    <div className="py-3 border-b border-border/50 last:border-0">
      <p className="text-xs text-center font-medium text-muted-foreground uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <p className="text-sm text-right text-foreground">{left || '—'}</p>
        <p className="text-sm text-foreground">{right || '—'}</p>
      </div>
    </div>
  )
}

// ─── Genre Overlap Section ───

function GenreComparison({ left, right }: { left: AnimeDetail; right: AnimeDetail }) {
  const { t } = useTranslation()

  const leftGenres = new Set(left.genres.map((g) => g.name))
  const rightGenres = new Set(right.genres.map((g) => g.name))
  const shared = [...leftGenres].filter((g) => rightGenres.has(g))
  const leftOnly = [...leftGenres].filter((g) => !rightGenres.has(g))
  const rightOnly = [...rightGenres].filter((g) => !leftGenres.has(g))

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold mb-3 text-center">{t('compare.genres')}</h3>

      {shared.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground text-center mb-1.5">{t('compare.sharedGenres')}</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {shared.map((g) => (
              <Badge key={g} className="bg-primary/15 text-primary border-primary/30 text-xs">
                {g}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="text-right">
          {leftOnly.length > 0 ? (
            <div className="flex flex-wrap justify-end gap-1">
              {leftOnly.map((g) => (
                <Badge key={g} variant="secondary" className="text-[10px]">{g}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">—</p>
          )}
        </div>
        <div>
          {rightOnly.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {rightOnly.map((g) => (
                <Badge key={g} variant="secondary" className="text-[10px]">{g}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">—</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Synopsis Comparison ───

function SynopsisComparison({ left, right }: { left: AnimeDetail; right: AnimeDetail }) {
  const { t } = useTranslation()

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold mb-3 text-center">{t('compare.synopsis')}</h3>
      <div className="grid grid-cols-2 gap-4">
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-6">
          {left.synopsis ?? '—'}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-6">
          {right.synopsis ?? '—'}
        </p>
      </div>
    </div>
  )
}

// ─── Streaming Links ───

function StreamingComparison({ left, right }: { left: AnimeDetail; right: AnimeDetail }) {
  const { t } = useTranslation()
  if (left.streaming.length === 0 && right.streaming.length === 0) return null

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold mb-3 text-center">{t('compare.streaming')}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 items-end">
          {left.streaming.length > 0 ? left.streaming.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              {s.name}
              <ExternalLink className="h-3 w-3" />
            </a>
          )) : <p className="text-xs text-muted-foreground">—</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          {right.streaming.length > 0 ? right.streaming.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              {s.name}
              <ExternalLink className="h-3 w-3" />
            </a>
          )) : <p className="text-xs text-muted-foreground">—</p>}
        </div>
      </div>
    </div>
  )
}

// ─── Verdict Banner ───

function Verdict({ left, right }: { left: AnimeDetail; right: AnimeDetail }) {
  const { t } = useTranslation()

  const wins = useMemo(() => {
    let l = 0
    let r = 0
    // Score
    if (left.score != null && right.score != null) {
      if (left.score > right.score) l++; else if (right.score > left.score) r++
    }
    // Rank (lower = better)
    if (left.rank != null && right.rank != null) {
      if (left.rank < right.rank) l++; else if (right.rank < left.rank) r++
    }
    // Popularity (lower = better)
    if (left.popularity < right.popularity) l++; else if (right.popularity < left.popularity) r++
    // Members
    if (left.members > right.members) l++; else if (right.members > left.members) r++
    // Favorites
    if (left.favorites > right.favorites) l++; else if (right.favorites > left.favorites) r++
    return { left: l, right: r }
  }, [left, right])

  const winner = wins.left > wins.right ? 'left' : wins.right > wins.left ? 'right' : 'tie'
  const winnerTitle = winner === 'left'
    ? (left.title_english ?? left.title)
    : winner === 'right'
      ? (right.title_english ?? right.title)
      : null

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="text-sm font-semibold">{t('compare.verdict')}</h3>
      </div>

      <div className="grid grid-cols-3 items-center gap-2 text-center">
        <div>
          <p className="text-2xl font-bold text-primary">{wins.left}</p>
          <p className="text-xs text-muted-foreground">{t('compare.wins')}</p>
        </div>
        <div>
          <TrendingUp className="h-5 w-5 mx-auto text-muted-foreground" />
          <p className="text-xs text-muted-foreground mt-1">vs</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">{wins.right}</p>
          <p className="text-xs text-muted-foreground">{t('compare.wins')}</p>
        </div>
      </div>

      {winner !== 'tie' && winnerTitle && (
        <p className="text-center text-sm font-medium mt-3 text-primary">
          {t('compare.winnerIs', { title: winnerTitle })}
        </p>
      )}
      {winner === 'tie' && (
        <p className="text-center text-sm font-medium mt-3 text-muted-foreground">
          {t('compare.tie')}
        </p>
      )}
    </div>
  )
}

// ─── Anime Column ───

function AnimeColumn({ anime, onRemove }: { anime: AnimeDetail; onRemove: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="relative">
        <Link to={`/anime/${anime.mal_id}`}>
          <img
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            className="w-32 sm:w-40 aspect-2/3 rounded-xl object-cover shadow-lg transition-transform hover:scale-105"
          />
        </Link>
        <Button
          variant="secondary"
          size="icon"
          className="absolute -top-2 -right-2 size-6 rounded-full shadow"
          onClick={onRemove}
        >
          <X className="size-3" />
        </Button>
      </div>
      <div className="space-y-1 max-w-40">
        <Link to={`/anime/${anime.mal_id}`} className="hover:text-primary transition-colors">
          <p className="text-sm font-bold leading-tight line-clamp-2">
            {anime.title_english ?? anime.title}
          </p>
        </Link>
        <p className="text-xs text-muted-foreground">{anime.type} · {anime.year ?? '?'}</p>
      </div>
    </div>
  )
}

// ─── Slot Picker ───

function CompareSlot({ index }: { index: number }) {
  const { t } = useTranslation()
  const items = useCompareStore((s) => s.items)
  const removeItem = useCompareStore((s) => s.removeItem)
  const item = items[index]

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/30 p-8 text-center">
        <Search className="h-8 w-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">{t('compare.pickAnime')}</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/search">{t('compare.browseAnime')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center gap-3 rounded-xl border bg-card p-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 size-7 text-muted-foreground hover:text-destructive"
        onClick={() => removeItem(item.id)}
      >
        <X className="size-4" />
      </Button>
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-24 aspect-2/3 rounded-lg object-cover shadow-md"
      />
      <p className="text-xs font-semibold text-center line-clamp-2 max-w-28">{item.title}</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-8">
        <Skeleton className="w-40 aspect-2/3 rounded-xl" />
        <Skeleton className="w-40 aspect-2/3 rounded-xl" />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded" />
      ))}
    </div>
  )
}

// ─── Full Compare Table ───

function CompareTable({ left, right }: { left: AnimeDetail; right: AnimeDetail }) {
  const { t } = useTranslation()
  const removeItem = useCompareStore((s) => s.removeItem)

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      {/* Posters */}
      <div className="grid grid-cols-2 gap-4">
        <AnimeColumn anime={left} onRemove={() => removeItem(left.mal_id)} />
        <AnimeColumn anime={right} onRemove={() => removeItem(right.mal_id)} />
      </div>

      {/* Verdict */}
      <Verdict left={left} right={right} />

      {/* Core Stats */}
      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-sm font-semibold mb-2 text-center">{t('compare.coreStats')}</h3>
        <StatRow label={t('compare.score')} left={left.score?.toFixed(2)} right={right.score?.toFixed(2)} showBar maxVal={10} />
        <StatRow label={t('compare.rank')} left={left.rank} right={right.rank} higherIsBetter={false} />
        <StatRow label={t('compare.popularity')} left={left.popularity} right={right.popularity} higherIsBetter={false} />
        <StatRow label={t('compare.members')} left={left.members} right={right.members} showBar />
        <StatRow label={t('compare.favorites')} left={left.favorites} right={right.favorites} showBar />
      </div>

      {/* Production Info */}
      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-sm font-semibold mb-2 text-center">{t('compare.production')}</h3>
        <TextRow label={t('compare.type')} left={left.type ?? ''} right={right.type ?? ''} />
        <TextRow label={t('compare.episodes')} left={left.episodes != null ? String(left.episodes) : ''} right={right.episodes != null ? String(right.episodes) : ''} />
        <TextRow label={t('compare.duration')} left={left.duration} right={right.duration} />
        <TextRow label={t('compare.source')} left={left.source ?? ''} right={right.source ?? ''} />
        <TextRow label={t('compare.studio')} left={left.studios.map((s) => s.name).join(', ')} right={right.studios.map((s) => s.name).join(', ')} />
        <TextRow label={t('compare.status')} left={left.status} right={right.status} />
        <TextRow label={t('compare.aired')} left={formatDate(left.aired.from)} right={formatDate(right.aired.from)} />
        <TextRow label={t('compare.season')} left={left.season ? `${left.season.charAt(0).toUpperCase()}${left.season.slice(1)} ${left.year}` : ''} right={right.season ? `${right.season.charAt(0).toUpperCase()}${right.season.slice(1)} ${right.year}` : ''} />
      </div>

      {/* Genres */}
      <GenreComparison left={left} right={right} />

      {/* Synopsis */}
      <SynopsisComparison left={left} right={right} />

      {/* Streaming */}
      <StreamingComparison left={left} right={right} />

      <Separator />

      {/* Themes */}
      {(left.themes.length > 0 || right.themes.length > 0) && (
        <div className="rounded-xl border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3 text-center">{t('compare.themes')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-wrap justify-end gap-1">
              {left.themes.length > 0
                ? left.themes.map((th) => <Badge key={th.mal_id} variant="outline" className="text-[10px]">{th.name}</Badge>)
                : <p className="text-xs text-muted-foreground">—</p>}
            </div>
            <div className="flex flex-wrap gap-1">
              {right.themes.length > 0
                ? right.themes.map((th) => <Badge key={th.mal_id} variant="outline" className="text-[10px]">{th.name}</Badge>)
                : <p className="text-xs text-muted-foreground">—</p>}
            </div>
          </div>
        </div>
      )}

      {/* Relations */}
      {(left.relations.length > 0 || right.relations.length > 0) && (
        <div className="rounded-xl border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3 text-center">{t('compare.relations')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 items-end text-right">
              {left.relations.length > 0
                ? left.relations.map((r) => (
                  <p key={r.relation} className="text-xs">
                    <span className="text-muted-foreground">{r.relation}:</span>{' '}
                    {r.entry.map((e) => e.name).join(', ')}
                  </p>
                ))
                : <p className="text-xs text-muted-foreground">—</p>}
            </div>
            <div className="flex flex-col gap-1">
              {right.relations.length > 0
                ? right.relations.map((r) => (
                  <p key={r.relation} className="text-xs">
                    <span className="text-muted-foreground">{r.relation}:</span>{' '}
                    {r.entry.map((e) => e.name).join(', ')}
                  </p>
                ))
                : <p className="text-xs text-muted-foreground">—</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ───

export default function ComparePage() {
  const { t } = useTranslation()
  usePageTitle(t('compare.title'))
  const items = useCompareStore((s) => s.items)
  const clear = useCompareStore((s) => s.clear)

  const leftQuery = useCompareDetail(items[0]?.id)
  const rightQuery = useCompareDetail(items[1]?.id)

  const bothSelected = items.length === 2
  const isLoading = bothSelected && (leftQuery.isPending || rightQuery.isPending)
  const bothLoaded = bothSelected && leftQuery.data && rightQuery.data

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('compare.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('compare.subtitle')}</p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" size="sm" onClick={clear}>
            {t('compare.clearAll')}
          </Button>
        )}
      </div>

      {!bothSelected && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <CompareSlot index={0} />
          <CompareSlot index={1} />
        </div>
      )}

      {isLoading && <LoadingSkeleton />}

      {bothLoaded && (
        <CompareTable left={leftQuery.data} right={rightQuery.data} />
      )}
    </div>
  )
}
