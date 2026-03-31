import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ColdStartState {
  hasCompleted: boolean
  favoriteGenreIds: number[]
  markCompleted: () => void
  setGenres: (ids: number[]) => void
}

export const useColdStart = create<ColdStartState>()(
  persist(
    (set) => ({
      hasCompleted: false,
      favoriteGenreIds: [],
      markCompleted: () => set({ hasCompleted: true }),
      setGenres: (ids) => set({ favoriteGenreIds: ids }),
    }),
    {
      name: 'cold-start-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
