import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useWatchlistStore } from '../store/watchlist-store'
import type { WatchStatus } from '../store/watchlist-store'

type TabValue = WatchStatus | 'all'

interface TabConfig {
  value: TabValue
  labelKey: string
}

const TAB_CONFIGS: TabConfig[] = [
  { value: 'all', labelKey: 'watchlist.stats.all' },
  { value: 'watching', labelKey: 'watchlist.status.watching' },
  { value: 'completed', labelKey: 'watchlist.status.completed' },
  { value: 'plan_to_watch', labelKey: 'watchlist.status.plan_to_watch' },
  { value: 'dropped', labelKey: 'watchlist.status.dropped' },
]

interface WatchlistTabsProps {
  children: React.ReactNode
}

export function WatchlistTabs({ children }: WatchlistTabsProps) {
  const { t } = useTranslation()
  const activeTab = useWatchlistStore((state) => state.activeTab)
  const setActiveTab = useWatchlistStore((state) => state.setActiveTab)
  const items = useWatchlistStore((state) => state.items)

  const stats = useMemo(() => ({
    total: items.length,
    watching: items.filter((i) => i.status === 'watching').length,
    completed: items.filter((i) => i.status === 'completed').length,
    plan_to_watch: items.filter((i) => i.status === 'plan_to_watch').length,
    dropped: items.filter((i) => i.status === 'dropped').length,
  }), [items])

  const getCount = (tab: TabValue): number => {
    if (tab === 'all') return stats.total
    return stats[tab]
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as TabValue)}
      className="w-full"
    >
      <TabsList className="h-auto flex-wrap gap-1 w-full justify-start bg-muted p-1">
        {TAB_CONFIGS.map(({ value, labelKey }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="flex items-center gap-1.5 data-[state=active]:bg-background"
          >
            {t(labelKey)}
            <Badge
              variant={activeTab === value ? 'default' : 'secondary'}
              className="h-5 min-w-5 px-1.5 text-xs rounded-full"
            >
              {getCount(value)}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}
