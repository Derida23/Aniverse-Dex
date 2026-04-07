import { useTranslation } from 'react-i18next'
import { AlertCircle, Star, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import type { Schedule } from '@/types/jikan'
import { useSchedule } from '../api/use-schedule'

const WEEK_DAY_KEYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

type WeekDayKey = (typeof WEEK_DAY_KEYS)[number]

const WEEK_DAYS_ENGLISH = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

type WeekDayLabel = (typeof WEEK_DAYS_ENGLISH)[number]

function normalizeBroadcastDay(day: string | null): WeekDayLabel | null {
  if (!day) return null
  // Jikan API returns plural forms like "Mondays", "Tuesdays", etc.
  const singular = day.replace(/s$/i, '')
  const capitalized = singular.charAt(0).toUpperCase() + singular.slice(1).toLowerCase()
  return WEEK_DAYS_ENGLISH.find((d) => d === capitalized) ?? null
}

function ScheduleCard({ anime }: { anime: Schedule }) {
  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="group flex gap-3 rounded-lg border bg-card p-2 transition-all hover:shadow-md hover:bg-accent/30"
    >
      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        {anime.score != null && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-0.5 bg-black/70 py-0.5 text-[10px] text-white">
            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
            {anime.score.toFixed(1)}
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <p className="line-clamp-2 text-xs font-semibold leading-tight">
          {anime.title}
        </p>
        {anime.broadcast.time && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {anime.broadcast.time}
          </div>
        )}
        {anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {anime.genres.slice(0, 2).map((g) => (
              <Badge key={g.mal_id} variant="secondary" className="px-1 py-0 text-[10px]">
                {g.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

function DayColumnSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-3">
      <Skeleton className="h-5 w-20" />
      <Separator />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-20 w-14 shrink-0 rounded-md" />
          <div className="flex flex-1 flex-col gap-1.5 py-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface DayColumnProps {
  dayLabel: string
  animes: Schedule[]
  isToday: boolean
  count: number
}

function DayColumn({ dayLabel, animes, isToday, count }: DayColumnProps) {
  const { t } = useTranslation()

  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border p-3 ${
        isToday ? 'border-primary bg-primary/5' : 'bg-card'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className={`text-sm font-semibold ${isToday ? 'text-primary' : ''}`}>{dayLabel}</h3>
          {isToday && (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
              {t('common.today')}
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{count}</span>
      </div>
      <Separator />
      {animes.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground italic">{t('common.noReleases')}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {animes.map((anime) => (
            <ScheduleCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  )
}

function groupByDay(schedules: Schedule[]): Record<WeekDayLabel, Schedule[]> {
  const grouped: Record<WeekDayLabel, Schedule[]> = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  }

  const seen = new Set<number>()
  for (const anime of schedules) {
    if (seen.has(anime.mal_id)) continue
    seen.add(anime.mal_id)
    const day = normalizeBroadcastDay(anime.broadcast.day)
    if (day) {
      grouped[day].push(anime)
    }
  }

  return grouped
}

const JS_DAY_TO_KEY: Record<number, WeekDayKey> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
}

const KEY_TO_ENGLISH: Record<WeekDayKey, WeekDayLabel> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

export function ScheduleCalendar() {
  const { t } = useTranslation()
  const { data, isPending, isError, error } = useSchedule()

  const todayKey = JS_DAY_TO_KEY[new Date().getDay()] ?? 'monday'

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t('seasonal.weeklySchedule')}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <DayColumnSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertCircle className="h-4 w-4" />
        <span>{error?.message ?? t('seasonal.failedWeekly')}</span>
      </div>
    )
  }

  const grouped = groupByDay(data?.data ?? [])

  // Reorder: today first, then the rest in order
  const todayIdx = WEEK_DAY_KEYS.indexOf(todayKey as WeekDayKey)
  const reordered = [
    ...WEEK_DAY_KEYS.slice(todayIdx),
    ...WEEK_DAY_KEYS.slice(0, todayIdx),
  ]

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold">{t('seasonal.weeklySchedule')}</h2>
        <p className="text-sm text-muted-foreground">{t('seasonal.weeklySubtitle')}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {reordered.map((key) => {
          const animes = grouped[KEY_TO_ENGLISH[key]]
          return (
            <DayColumn
              key={key}
              dayLabel={t(`seasonal.days.${key}`)}
              animes={animes}
              isToday={key === todayKey}
              count={animes.length}
            />
          )
        })}
      </div>
    </div>
  )
}
