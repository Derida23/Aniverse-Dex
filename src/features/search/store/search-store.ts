import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AnimeFilters } from '@/types/jikan'

const MAX_RECENT_SEARCHES = 5

interface SearchState {
  lastFilters: AnimeFilters
  recentSearches: string[]
}

interface SearchActions {
  saveFilters: (filters: AnimeFilters) => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
}

type SearchStore = SearchState & SearchActions

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      lastFilters: {},
      recentSearches: [],

      saveFilters: (filters) => set({ lastFilters: filters }),

      addRecentSearch: (query) => {
        const trimmed = query.trim()
        if (!trimmed) return

        set((state) => {
          const filtered = state.recentSearches.filter((s) => s !== trimmed)
          const next = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES)
          return { recentSearches: next }
        })
      },

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'anime-search-store',
    },
  ),
)
