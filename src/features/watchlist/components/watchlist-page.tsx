import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/use-page-title'
import { TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useWatchlistStore } from '../store/watchlist-store'
import type { WatchStatus } from '../store/watchlist-store'
import { WatchlistDashboard } from './watchlist-dashboard'
import { WatchlistTabs } from './watchlist-tabs'
import { WatchlistItem } from './watchlist-item'
import { EmptyState } from './empty-state'

type TabValue = WatchStatus | 'all'

const ALL_STATUSES: WatchStatus[] = ['watching', 'completed', 'plan_to_watch', 'dropped']

function ItemList({ tab }: { tab: TabValue }) {
  const allItems = useWatchlistStore((state) => state.items)
  const items = useMemo(
    () => (tab === 'all' ? allItems : allItems.filter((i) => i.status === tab)),
    [allItems, tab],
  )

  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <WatchlistItem key={item.id} item={item} />
      ))}
    </div>
  )
}

export default function WatchlistPage() {
  const { t } = useTranslation()
  usePageTitle(t('watchlist.title'))
  const totalItems = useWatchlistStore((state) => state.items.length)

  return (
    <article className="container max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('watchlist.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {totalItems === 0
            ? t('watchlist.noTracked')
            : t('watchlist.tracked', { count: totalItems })}
        </p>
      </header>

      <Separator />

      <WatchlistDashboard />

      <Separator />

      <WatchlistTabs>
        <TabsContent value="all" className="mt-4">
          <ItemList tab="all" />
        </TabsContent>

        {ALL_STATUSES.map((status) => (
          <TabsContent key={status} value={status} className="mt-4">
            <ItemList tab={status} />
          </TabsContent>
        ))}
      </WatchlistTabs>
    </article>
  )
}
