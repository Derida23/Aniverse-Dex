import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Trash2, Star, Tv, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWatchlistStore } from '../store/watchlist-store'
import type { WatchlistItem as WatchlistItemType, WatchStatus } from '../store/watchlist-store'

const STATUS_KEYS: WatchStatus[] = ['watching', 'completed', 'plan_to_watch', 'dropped']

interface WatchlistItemProps {
  item: WatchlistItemType
}

export function WatchlistItem({ item }: WatchlistItemProps) {
  const { t } = useTranslation()
  const updateStatus = useWatchlistStore((state) => state.updateStatus)
  const removeItem = useWatchlistStore((state) => state.removeItem)

  const [optimisticStatus, setOptimisticStatus] = useState<WatchStatus>(item.status)

  const handleStatusChange = (value: WatchStatus) => {
    setOptimisticStatus(value)
    updateStatus(item.id, value)
  }

  const handleRemove = () => {
    removeItem(item.id)
    toast.success(t('watchlist.removedToast', { title: item.title }))
  }

  const addedDate = new Date(item.addedAt).toLocaleDateString()

  return (
    <div className="flex gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-accent/30">
      {/* Poster */}
      <Link to={`/anime/${item.id}`} className="shrink-0">
        <div className="relative h-24 w-16 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-24">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
          {item.score != null && (
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-0.5 bg-black/70 py-0.5 text-[10px] text-white">
              <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
              {item.score.toFixed(1)}
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between gap-1.5 min-w-0 py-0.5">
        <div className="space-y-1">
          <Link to={`/anime/${item.id}`} className="hover:text-primary transition-colors">
            <p className="text-sm font-semibold leading-tight line-clamp-2">{item.title}</p>
          </Link>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            {item.type && <span>{item.type}</span>}
            {item.episodes != null && (
              <span className="flex items-center gap-0.5">
                <Tv className="h-3 w-3" />
                {item.episodes} eps
              </span>
            )}
            <span className="hidden sm:flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {addedDate}
            </span>
          </div>

          {item.genres && item.genres.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1">
              {item.genres.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="secondary" className="px-1.5 py-0 text-[10px]">
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-center gap-2">
          <Select value={optimisticStatus} onValueChange={handleStatusChange}>
            <SelectTrigger size="sm" className="w-28 sm:w-36 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_KEYS.map((key) => (
                <SelectItem key={key} value={key} className="text-xs">
                  {t(`watchlist.status.${key}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleRemove}
            aria-label={t('watchlist.removeAria', { title: item.title })}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
