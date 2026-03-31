import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, CheckCircle2, Clock, ListTodo, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useWatchlistStore } from '../store/watchlist-store'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  count: number
  colorClass: string
}

function StatCard({ icon, label, count, colorClass }: StatCardProps) {
  return (
    <Card className="flex-1 min-w-0">
      <CardContent className="flex items-center gap-3 py-4 px-5">
        <div className={`flex items-center justify-center rounded-lg p-2 ${colorClass}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold leading-none">{count}</p>
          <p className="text-xs text-muted-foreground mt-1 truncate">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function WatchlistDashboard() {
  const { t } = useTranslation()
  const items = useWatchlistStore((state) => state.items)
  const stats = useMemo(() => ({
    total: items.length,
    watching: items.filter((i) => i.status === 'watching').length,
    completed: items.filter((i) => i.status === 'completed').length,
    plan_to_watch: items.filter((i) => i.status === 'plan_to_watch').length,
    dropped: items.filter((i) => i.status === 'dropped').length,
  }), [items])

  return (
    <div className="flex flex-wrap gap-3">
      <StatCard
        icon={<ListTodo className="size-4 text-blue-600 dark:text-blue-400" />}
        label={t('watchlist.stats.total')}
        count={stats.total}
        colorClass="bg-blue-100 dark:bg-blue-900/30"
      />
      <StatCard
        icon={<BookOpen className="size-4 text-green-600 dark:text-green-400" />}
        label={t('watchlist.status.watching')}
        count={stats.watching}
        colorClass="bg-green-100 dark:bg-green-900/30"
      />
      <StatCard
        icon={<CheckCircle2 className="size-4 text-purple-600 dark:text-purple-400" />}
        label={t('watchlist.status.completed')}
        count={stats.completed}
        colorClass="bg-purple-100 dark:bg-purple-900/30"
      />
      <StatCard
        icon={<Clock className="size-4 text-yellow-600 dark:text-yellow-400" />}
        label={t('watchlist.status.plan_to_watch')}
        count={stats.plan_to_watch}
        colorClass="bg-yellow-100 dark:bg-yellow-900/30"
      />
      <StatCard
        icon={<XCircle className="size-4 text-red-600 dark:text-red-400" />}
        label={t('watchlist.status.dropped')}
        count={stats.dropped}
        colorClass="bg-red-100 dark:bg-red-900/30"
      />
    </div>
  )
}
