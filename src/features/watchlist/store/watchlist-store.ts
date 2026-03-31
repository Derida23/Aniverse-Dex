import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type WatchStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped'

export interface WatchlistItem {
  id: number
  title: string
  imageUrl: string
  score: number | null
  status: WatchStatus
  episodes: number | null
  type: string | null
  genres: string[]
  addedAt: number
  updatedAt: number
}

interface WatchlistState {
  items: WatchlistItem[]
  activeTab: WatchStatus | 'all'
  addItem: (item: Omit<WatchlistItem, 'addedAt' | 'updatedAt'>) => void
  removeItem: (id: number) => void
  updateStatus: (id: number, status: WatchStatus) => void
  setActiveTab: (tab: WatchStatus | 'all') => void
  getItemById: (id: number) => WatchlistItem | undefined
  getByStatus: (status: WatchStatus) => WatchlistItem[]
  getStats: () => Record<WatchStatus | 'total', number>
}

const channel =
  typeof window !== 'undefined' ? new BroadcastChannel('watchlist-sync') : null

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => {
      // Listen for cross-tab sync messages
      if (channel) {
        channel.onmessage = (event: MessageEvent<{ items: WatchlistItem[] }>) => {
          set({ items: event.data.items })
        }
      }

      const broadcastItems = (items: WatchlistItem[]) => {
        channel?.postMessage({ items })
      }

      return {
        items: [],
        activeTab: 'all',

        addItem: (item) => {
          set((state) => {
            const exists = state.items.some((i) => i.id === item.id)
            if (exists) return state

            const now = Date.now()
            const newItem: WatchlistItem = {
              ...item,
              addedAt: now,
              updatedAt: now,
            }
            const updated = [...state.items, newItem]
            broadcastItems(updated)
            return { items: updated }
          })
        },

        removeItem: (id) => {
          set((state) => {
            const updated = state.items.filter((i) => i.id !== id)
            broadcastItems(updated)
            return { items: updated }
          })
        },

        updateStatus: (id, status) => {
          set((state) => {
            const updated = state.items.map((i) =>
              i.id === id ? { ...i, status, updatedAt: Date.now() } : i
            )
            broadcastItems(updated)
            return { items: updated }
          })
        },

        setActiveTab: (tab) => set({ activeTab: tab }),

        getItemById: (id) => get().items.find((i) => i.id === id),

        getByStatus: (status) => get().items.filter((i) => i.status === status),

        getStats: () => {
          const items = get().items
          return {
            total: items.length,
            watching: items.filter((i) => i.status === 'watching').length,
            completed: items.filter((i) => i.status === 'completed').length,
            plan_to_watch: items.filter((i) => i.status === 'plan_to_watch').length,
            dropped: items.filter((i) => i.status === 'dropped').length,
          }
        },
      }
    },
    {
      name: 'watchlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
