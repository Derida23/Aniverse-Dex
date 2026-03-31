import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { AnimeFilters } from '@/types/jikan'

type FilterKey = keyof AnimeFilters

function parseFiltersFromParams(params: URLSearchParams): AnimeFilters {
  const filters: AnimeFilters = {}

  const q = params.get('q')
  if (q) filters.q = q

  const genres = params.get('genres')
  if (genres) filters.genres = genres

  const minScore = params.get('min_score')
  if (minScore !== null) {
    const parsed = parseFloat(minScore)
    if (!isNaN(parsed)) filters.min_score = parsed
  }

  const status = params.get('status')
  if (status) filters.status = status

  const type = params.get('type')
  if (type) filters.type = type

  const rating = params.get('rating')
  if (rating) filters.rating = rating

  const startDate = params.get('start_date')
  if (startDate) filters.start_date = startDate

  const page = params.get('page')
  if (page !== null) {
    const parsed = parseInt(page, 10)
    if (!isNaN(parsed)) filters.page = parsed
  }

  return filters
}

function countActiveFilters(filters: AnimeFilters): number {
  let count = 0
  if (filters.genres) count++
  if (filters.min_score !== undefined) count++
  if (filters.status) count++
  if (filters.type) count++
  if (filters.rating) count++
  if (filters.start_date) count++
  return count
}

interface UseAnimeFiltersReturn {
  filters: AnimeFilters
  setFilter: <K extends FilterKey>(key: K, value: AnimeFilters[K]) => void
  resetFilters: () => void
  activeCount: number
}

export function useAnimeFilters(): UseAnimeFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams])

  const setFilter = useCallback(
    <K extends FilterKey>(key: K, value: AnimeFilters[K]) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)

          if (value === undefined || value === null || value === '') {
            next.delete(key)
          } else {
            next.set(key, String(value))
          }

          // Reset to page 1 when filters change (except when setting page itself)
          if (key !== 'page') {
            next.delete('page')
          }

          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const resetFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams()
        const q = prev.get('q')
        if (q) next.set('q', q)
        return next
      },
      { replace: true },
    )
  }, [setSearchParams])

  const activeCount = useMemo(() => countActiveFilters(filters), [filters])

  return { filters, setFilter, resetFilters, activeCount }
}
