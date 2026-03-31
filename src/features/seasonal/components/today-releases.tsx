import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import type { Schedule } from '@/types/jikan'
import { useSchedule } from '../api/use-schedule'
import { CountdownTimer } from './countdown-timer'

type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

const DAY_NAMES: Record<number, WeekDay> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
}

function buildBroadcastDate(broadcast: Schedule['broadcast']): string | null {
  if (!broadcast.time || !broadcast.timezone) return null

  const now = new Date()
  const [hours, minutes] = broadcast.time.split(':').map(Number)

  if (hours === undefined || minutes === undefined) return null

  const target = new Date(now)
  target.setHours(hours, minutes, 0, 0)

  if (target.getTime() < now.getTime()) {
    target.setDate(target.getDate() + 1)
  }

  return target.toISOString()
}

interface TodayAnimeCardProps {
  anime: Schedule
}

function TodayAnimeCard({ anime }: TodayAnimeCardProps) {
  const targetDate = buildBroadcastDate(anime.broadcast)

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
      </div>
      <div className="flex flex-col gap-1">
        <p className="line-clamp-2 text-xs font-medium leading-tight">{anime.title}</p>
        <CountdownTimer targetDate={targetDate} />
      </div>
    </Link>
  )
}

function TodayReleasesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-3/4 w-full rounded-md" />
          <Skeleton className="mt-2 h-3 w-full" />
          <Skeleton className="mt-1 h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export function TodayReleases() {
  const { t } = useTranslation()
  const todayIndex = new Date().getDay()
  const todayDay = DAY_NAMES[todayIndex] ?? 'monday'

  const { data, isPending, isError, error } = useSchedule(todayDay)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold">{t('seasonal.todayReleases')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('seasonal.airingOn', { day: t(`seasonal.days.${todayDay}`) })}
        </p>
      </div>

      {isPending && <TodayReleasesSkeleton />}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error?.message ?? t('seasonal.failedToday')}</span>
        </div>
      )}

      {!isPending && !isError && data && (
        <>
          {data.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('seasonal.noToday')}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {data.data.map((anime) => (
                <TodayAnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
