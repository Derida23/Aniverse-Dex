import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/use-debounce'
import { useAnimeFilters } from '../hooks/use-anime-filters'

interface SearchBarProps {
  isPending: boolean
}

export function SearchBar({ isPending }: SearchBarProps) {
  const { t } = useTranslation()
  const { filters, setFilter } = useAnimeFilters()
  const [localValue, setLocalValue] = useState(filters.q ?? '')
  const debouncedValue = useDebounce(localValue, 400)

  // Sync debounced value to URL
  useEffect(() => {
    const currentQ = filters.q ?? ''
    if (debouncedValue !== currentQ) {
      setFilter('q', debouncedValue || undefined)
    }
  }, [debouncedValue]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync URL changes back to local state (e.g. browser back/forward)
  useEffect(() => {
    setLocalValue(filters.q ?? '')
  }, [filters.q])

  const handleClear = () => {
    setLocalValue('')
    setFilter('q', undefined)
  }

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </div>

      <Input
        type="text"
        placeholder={t('search.placeholder')}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-9 pr-9"
        aria-label={t('search.ariaLabel')}
      />

      {localValue && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          aria-label={t('search.clearSearch')}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
