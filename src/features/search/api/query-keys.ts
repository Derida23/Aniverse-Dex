import type { AnimeFilters } from '@/types/jikan'

export const searchKeys = {
  all: ['anime'] as const,
  lists: () => [...searchKeys.all, 'list'] as const,
  list: (filters: AnimeFilters) => [...searchKeys.lists(), filters] as const,
}
