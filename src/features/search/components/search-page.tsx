import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/use-page-title'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAnimeFilters } from '../hooks/use-anime-filters'
import { useAnimeList } from '../api/use-anime-list'
import { useSearchStore } from '../store/search-store'
import { SearchBar } from './search-bar'
import { FilterPanel, MobileFilterSheet } from './filter-panel'
import { FilterChips } from './filter-chips'
import { AnimeGrid } from './anime-grid'

export default function SearchPage() {
  const { t } = useTranslation()
  usePageTitle(t('search.title'))
  const { filters, setFilter, activeCount } = useAnimeFilters()
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAnimeList(filters)

  const recentSearches = useSearchStore((state) => state.recentSearches)
  const saveFilters = useSearchStore((state) => state.saveFilters)
  const addRecentSearch = useSearchStore((state) => state.addRecentSearch)
  const clearRecentSearches = useSearchStore((state) => state.clearRecentSearches)

  useEffect(() => {
    saveFilters(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  useEffect(() => {
    if (filters.q && filters.q.trim()) {
      addRecentSearch(filters.q.trim())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q])

  const showRecentSearches = !filters.q && recentSearches.length > 0

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('search.title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('search.subtitle')}
        </p>
      </div>

      {/* Search Bar + Mobile Filter Trigger (only on mobile) */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1">
          <SearchBar isPending={isPending} />
        </div>
        {/* Mobile only filter button */}
        <MobileFilterSheet />
      </div>

      {/* Recent Searches */}
      {showRecentSearches && (
        <div className="mb-4 rounded-lg border bg-card p-3 animate-slide-up">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {t('search.recentSearches')}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRecentSearches}
              className="h-6 px-2 text-xs text-muted-foreground"
            >
              {t('common.clearAll')}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((query) => (
              <button
                key={query}
                onClick={() => setFilter('q', query)}
                className="flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-sm transition-colors hover:bg-muted"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {activeCount > 0 && (
        <div className="mb-4">
          <FilterChips />
        </div>
      )}

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Desktop Sidebar Filter (only on lg+) */}
        <FilterPanel />

        {/* Results */}
        <div className="min-w-0 flex-1">
          <AnimeGrid
            data={data}
            isPending={isPending}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage ?? false}
            isError={isError}
            error={error}
            fetchNextPage={fetchNextPage}
          />
        </div>
      </div>
    </div>
  )
}
