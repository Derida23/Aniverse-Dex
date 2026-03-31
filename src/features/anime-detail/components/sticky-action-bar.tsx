import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BookmarkPlus, BookmarkCheck, Share2, GitCompare, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCompareStore } from '@/features/compare'
import type { AnimeDetail } from '@/types/jikan'

interface StickyActionBarProps {
  anime: AnimeDetail
  isInWatchlist: boolean
  onToggleWatchlist: () => void
}

export default function StickyActionBar({
  anime,
  isInWatchlist,
  onToggleWatchlist,
}: StickyActionBarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const isInCompare = useCompareStore((s) => s.items.some((i) => i.id === anime.mal_id))
  const compareCount = useCompareStore((s) => s.items.length)
  const addCompare = useCompareStore((s) => s.addItem)
  const removeCompare = useCompareStore((s) => s.removeItem)
  const isFull = compareCount >= 2

  function handleCompare() {
    if (isInCompare) {
      removeCompare(anime.mal_id)
      toast.info(t('compare.removed', { title: anime.title_english ?? anime.title }))
    } else if (isFull) {
      navigate('/compare')
    } else {
      addCompare({
        id: anime.mal_id,
        title: anime.title_english ?? anime.title,
        imageUrl: anime.images.jpg.image_url,
      })
      toast.success(t('compare.added', { title: anime.title_english ?? anime.title }))
      if (compareCount === 1) {
        navigate('/compare')
      }
    }
  }

  async function handleShare(): Promise<void> {
    const title = anime.title_english ?? anime.title
    const shareData = {
      title,
      text: t('detail.shareText', { title }),
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success(t('common.linkCopied'))
      } catch {
        // Clipboard not available
      }
    }
  }

  return (
    <div className="sticky bottom-20 z-30 mx-4 mt-6 md:bottom-24">
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-background/85 px-4 py-3 shadow-lg backdrop-blur-xl">
        <p className="mr-auto hidden text-sm font-medium truncate max-w-xs text-muted-foreground lg:block">
          {anime.title_english ?? anime.title}
        </p>

        <Button
          onClick={onToggleWatchlist}
          variant={isInWatchlist ? 'secondary' : 'default'}
          size="sm"
          className="gap-1.5"
        >
          {isInWatchlist ? (
            <>
              <BookmarkCheck className="h-4 w-4" />
              {t('watchlist.inWatchlist')}
            </>
          ) : (
            <>
              <BookmarkPlus className="h-4 w-4" />
              {t('watchlist.add')}
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => { void handleShare() }}
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">{t('common.share')}</span>
        </Button>

        <Button
          variant={isInCompare ? 'secondary' : 'outline'}
          size="sm"
          className="gap-1.5"
          onClick={handleCompare}
        >
          {isInCompare ? (
            <Check className="h-4 w-4" />
          ) : (
            <GitCompare className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {isInCompare ? t('compare.inCompare') : t('common.compare')}
          </span>
          {!isInCompare && compareCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {compareCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
