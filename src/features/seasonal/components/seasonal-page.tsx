import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/use-page-title'
import { Star, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Anime } from '@/types/jikan'
import { useCurrentSeason } from '../api/use-current-season'
import { useSeasonAnime } from '../api/use-season'
import { TodayReleases } from './today-releases'
import { ScheduleCalendar } from './schedule-calendar'
import { SeasonalHighlights } from './seasonal-highlights'

type SeasonName = 'winter' | 'spring' | 'summer' | 'fall'

const SEASONS: SeasonName[] = ['winter', 'spring', 'summer', 'fall']

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i)

function getCurrentSeason(): SeasonName {
  const month = new Date().getMonth() + 1
  if (month >= 1 && month <= 3) return 'winter'
  if (month >= 4 && month <= 6) return 'spring'
  if (month >= 7 && month <= 9) return 'summer'
  return 'fall'
}

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
      <div className="flex flex-col gap-1">
        <p className="line-clamp-2 text-xs font-medium leading-tight">{anime.title}</p>
        <div className="flex flex-wrap gap-1">
          {anime.genres.slice(0, 2).map((g) => (
            <Badge key={g.mal_id} variant="secondary" className="px-1.5 py-0 text-xs">
              {g.name}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}

function SeasonGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="aspect-3/4 w-full rounded-md" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}

type SeasonMode = 'current' | 'custom'

interface SeasonPickerProps {
  mode: SeasonMode
  onModeChange: (mode: SeasonMode) => void
  selectedYear: number
  selectedSeason: SeasonName
  onYearChange: (year: number) => void
  onSeasonChange: (season: SeasonName) => void
}

function SeasonPicker({
  mode,
  onModeChange,
  selectedYear,
  selectedSeason,
  onYearChange,
  onSeasonChange,
}: SeasonPickerProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={mode}
        onValueChange={(v) => onModeChange(v as SeasonMode)}
      >
        <SelectTrigger className="w-36 sm:w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="current">{t('seasonal.currentSeason')}</SelectItem>
          <SelectItem value="custom">{t('seasonal.pickSeason')}</SelectItem>
        </SelectContent>
      </Select>

      {mode === 'custom' && (
        <>
          <Select
            value={String(selectedYear)}
            onValueChange={(v) => onYearChange(Number(v))}
          >
            <SelectTrigger className="w-24 sm:w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedSeason}
            onValueChange={(v) => onSeasonChange(v as SeasonName)}
          >
            <SelectTrigger className="w-24 sm:w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEASONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(`seasonal.seasons.${s}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  )
}

interface SeasonTabContentProps {
  mode: SeasonMode
  selectedYear: number
  selectedSeason: SeasonName
}

function SeasonTabContent({ mode, selectedYear, selectedSeason }: SeasonTabContentProps) {
  const { t } = useTranslation()
  const currentQuery = useCurrentSeason()
  const customQuery = useSeasonAnime(selectedYear, selectedSeason)

  const query = mode === 'current' ? currentQuery : customQuery
  const { data, isPending, isError, error } = query

  return (
    <div className="flex flex-col gap-8">
      {mode === 'current' && <SeasonalHighlights />}

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">
          {mode === 'current'
            ? t('seasonal.allThisSeason')
            : `${t(`seasonal.seasons.${selectedSeason}`)} ${selectedYear}`}
        </h2>

        {isPending && <SeasonGridSkeleton />}

        {isError && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error?.message ?? t('seasonal.failedSeason')}</span>
          </div>
        )}

        {!isPending && !isError && data && (
          <>
            {data.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('seasonal.noSeason')}</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {data.data.map((anime) => (
                  <SeasonCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function SeasonalPage() {
  const { t } = useTranslation()
  usePageTitle(t('seasonal.title'))
  const [activeTab, setActiveTab] = useState<string>('today')
  const [seasonMode, setSeasonMode] = useState<SeasonMode>('current')
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR)
  const [selectedSeason, setSelectedSeason] = useState<SeasonName>(getCurrentSeason())

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{t('seasonal.title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('seasonal.subtitle')}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="today">{t('seasonal.todayTab')}</TabsTrigger>
            <TabsTrigger value="schedule">{t('seasonal.weekTab')}</TabsTrigger>
            <TabsTrigger value="season">{t('seasonal.seasonTab')}</TabsTrigger>
          </TabsList>

          {activeTab === 'season' && (
            <SeasonPicker
              mode={seasonMode}
              onModeChange={setSeasonMode}
              selectedYear={selectedYear}
              selectedSeason={selectedSeason}
              onYearChange={setSelectedYear}
              onSeasonChange={setSelectedSeason}
            />
          )}
        </div>

        <TabsContent value="today">
          <TodayReleases />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleCalendar />
        </TabsContent>

        <TabsContent value="season">
          <SeasonTabContent
            mode={seasonMode}
            selectedYear={selectedYear}
            selectedSeason={selectedSeason}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
