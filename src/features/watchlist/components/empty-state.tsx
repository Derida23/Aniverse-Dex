import { useTranslation } from 'react-i18next'
import { BookmarkX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function EmptyState() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex items-center justify-center rounded-full bg-muted p-6">
        <BookmarkX className="size-10 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold">{t('watchlist.emptyTitle')}</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          {t('watchlist.emptyDesc')}
        </p>
      </div>
      <Button asChild>
        <Link to="/search">{t('watchlist.startExploring')}</Link>
      </Button>
    </div>
  )
}
