import { create } from 'zustand'

const MAX_COMPARE = 2

export interface CompareItem {
  id: number
  title: string
  imageUrl: string
}

interface CompareState {
  items: CompareItem[]
  addItem: (item: CompareItem) => void
  removeItem: (id: number) => void
  clear: () => void
  hasItem: (id: number) => boolean
  isFull: () => boolean
}

export const useCompareStore = create<CompareState>()((set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      if (state.items.length >= MAX_COMPARE) return state
      if (state.items.some((i) => i.id === item.id)) return state
      return { items: [...state.items, item] }
    })
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
  },

  clear: () => set({ items: [] }),

  hasItem: (id) => get().items.some((i) => i.id === id),

  isFull: () => get().items.length >= MAX_COMPARE,
}))
