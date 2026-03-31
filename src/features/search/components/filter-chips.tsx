import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GENRE_ID_TO_NAME } from '@/lib/genres'
import { useAnimeFilters } from '../hooks/use-anime-filters'

function genreIdsToNames(genres: string): string {
  return genres
    .split(',')
    .map((id) => GENRE_ID_TO_NAME[Number(id)] ?? id)
    .join(', ')
}

export function FilterChips() {
  const { t } = useTranslation()
  const { filters, setFilter, activeCount } = useAnimeFilters()

  if (activeCount === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 animate-slide-up" role="list" aria-label={t('filter.title')}>
      {filters.status && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 pr-1"
          role="listitem"
        >
          <span>{t('filter.status')}: {filters.status}</span>
          <button
            onClick={() => setFilter('status', undefined)}
            className="ml-1 rounded-sm hover:bg-muted"
            aria-label={t('filter.status')}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.type && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 pr-1"
          role="listitem"
        >
          <span>{t('filter.type')}: {filters.type.toUpperCase()}</span>
          <button
            onClick={() => setFilter('type', undefined)}
            className="ml-1 rounded-sm hover:bg-muted"
            aria-label={t('filter.type')}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.rating && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 pr-1"
          role="listitem"
        >
          <span>{t('filter.rating')}: {filters.rating.toUpperCase()}</span>
          <button
            onClick={() => setFilter('rating', undefined)}
            className="ml-1 rounded-sm hover:bg-muted"
            aria-label={t('filter.rating')}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.min_score !== undefined && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 pr-1"
          role="listitem"
        >
          <span>{t('filter.minScore')}: {filters.min_score}</span>
          <button
            onClick={() => setFilter('min_score', undefined)}
            className="ml-1 rounded-sm hover:bg-muted"
            aria-label={t('filter.minScore')}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.genres && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 pr-1"
          role="listitem"
        >
          <span>{t('filter.genres')}: {genreIdsToNames(filters.genres)}</span>
          <button
            onClick={() => setFilter('genres', undefined)}
            className="ml-1 rounded-sm hover:bg-muted"
            aria-label={t('filter.genres')}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.start_date && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 pr-1"
          role="listitem"
        >
          <span>{t('filter.startDate')}: {filters.start_date}</span>
          <button
            onClick={() => setFilter('start_date', undefined)}
            className="ml-1 rounded-sm hover:bg-muted"
            aria-label={t('filter.startDate')}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
    </div>
  )
}
