import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

interface TrendIndicatorProps {
  members: number
  rank: number | null
  score?: number | null
}

export function TrendIndicator({ members, rank, score }: TrendIndicatorProps) {
  const { t } = useTranslation()
  const isHot = members > 100_000 || (rank !== null && rank <= 50)
  const isRising = !isHot && rank !== null && rank <= 200

  if (isHot) {
    return (
      <Badge className="bg-orange-500 text-white hover:bg-orange-600 text-xs font-medium">
        {t('seasonal.trending')}
      </Badge>
    )
  }

  if (isRising) {
    return (
      <Badge variant="secondary" className="text-xs font-medium text-green-600">
        {t('seasonal.rising')}
      </Badge>
    )
  }

  if (score !== null && score !== undefined) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        {score.toFixed(1)}
      </span>
    )
  }

  return null
}
