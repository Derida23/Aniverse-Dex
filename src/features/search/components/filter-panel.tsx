import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAnimeFilters } from '../hooks/use-anime-filters'

const STATUS_KEYS = ['airing', 'complete', 'upcoming'] as const
const TYPE_KEYS = ['tv', 'movie', 'ova', 'special', 'ona', 'music'] as const
const RATING_KEYS = ['g', 'pg', 'pg13', 'r17', 'r', 'rx'] as const

const GENRE_OPTIONS = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' },
  { id: 14, name: 'Horror' },
  { id: 7, name: 'Mystery' },
  { id: 22, name: 'Romance' },
  { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' },
  { id: 30, name: 'Sports' },
  { id: 37, name: 'Supernatural' },
  { id: 41, name: 'Thriller' },
  { id: 18, name: 'Mecha' },
  { id: 19, name: 'Music' },
  { id: 40, name: 'Psychological' },
] as const

function parseGenreIds(genres: string | undefined): number[] {
  if (!genres) return []
  return genres.split(',').map(Number).filter((n) => !isNaN(n) && n > 0)
}

function FilterFields() {
  const { t } = useTranslation()
  const { filters, setFilter, resetFilters } = useAnimeFilters()

  const selectedGenreIds = parseGenreIds(filters.genres)

  function toggleGenre(id: number) {
    const current = new Set(selectedGenreIds)
    if (current.has(id)) {
      current.delete(id)
    } else {
      current.add(id)
    }
    const next = [...current].join(',')
    setFilter('genres', next || undefined)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('filter.status')}</label>
        <Select
          value={filters.status ?? ''}
          onValueChange={(val) => setFilter('status', val || undefined)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('filter.anyStatus')} />
          </SelectTrigger>
          <SelectContent>
            {STATUS_KEYS.map((key) => (
              <SelectItem key={key} value={key}>
                {t(`filter.statusOptions.${key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('filter.type')}</label>
        <Select
          value={filters.type ?? ''}
          onValueChange={(val) => setFilter('type', val || undefined)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('filter.anyType')} />
          </SelectTrigger>
          <SelectContent>
            {TYPE_KEYS.map((key) => (
              <SelectItem key={key} value={key}>
                {t(`filter.typeOptions.${key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('filter.rating')}</label>
        <Select
          value={filters.rating ?? ''}
          onValueChange={(val) => setFilter('rating', val || undefined)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('filter.anyRating')} />
          </SelectTrigger>
          <SelectContent>
            {RATING_KEYS.map((key) => (
              <SelectItem key={key} value={key}>
                {t(`filter.ratingOptions.${key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Min Score */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">
          {t('filter.minScore')}{' '}
          {filters.min_score !== undefined && (
            <span className="text-muted-foreground">({filters.min_score})</span>
          )}
        </label>
        <Input
          type="range"
          min={0}
          max={10}
          step={0.5}
          value={filters.min_score ?? 0}
          onChange={(e) => {
            const val = parseFloat(e.target.value)
            setFilter('min_score', val > 0 ? val : undefined)
          }}
          className="h-2 cursor-pointer accent-primary"
          aria-label={t('filter.minScore')}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>10</span>
        </div>
      </div>

      {/* Genres */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('filter.genres')}</label>
        <div className="flex flex-wrap gap-1.5">
          {GENRE_OPTIONS.map((genre) => {
            const isSelected = selectedGenreIds.includes(genre.id)
            return (
              <Badge
                key={genre.id}
                variant={isSelected ? 'default' : 'outline'}
                className="cursor-pointer select-none gap-1 px-2 py-1 text-xs transition-colors"
                onClick={() => toggleGenre(genre.id)}
              >
                {isSelected && <Check className="h-3 w-3" />}
                {genre.name}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Start Date */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('filter.startDate')}</label>
        <Input
          type="date"
          value={filters.start_date ?? ''}
          onChange={(e) => setFilter('start_date', e.target.value || undefined)}
          aria-label={t('filter.startDate')}
        />
      </div>

      <Separator />

      <Button variant="outline" onClick={resetFilters} className="w-full">
        {t('filter.reset')}
      </Button>
    </div>
  )
}

// Desktop inline panel — only shows on lg+
export function FilterPanel() {
  const { t } = useTranslation()

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-4 rounded-lg border bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold">{t('filter.title')}</h2>
        <FilterFields />
      </div>
    </aside>
  )
}

// Mobile filter sheet trigger — only shows below lg
export function MobileFilterSheet() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { activeCount } = useAnimeFilters()

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            {t('filter.title')}
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t('filter.title')}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 px-4 pb-8">
            <FilterFields />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
