import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { useCountdown } from '../hooks/use-countdown'

interface CountdownTimerProps {
  targetDate: string | null
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const { t } = useTranslation()
  const countdown = useCountdown(targetDate)

  if (!countdown) return null

  if (countdown === 'Airing now') {
    return (
      <Badge variant="destructive" className="text-xs font-medium">
        {t('seasonal.airingNow')}
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="text-xs font-medium">
      {countdown}
    </Badge>
  )
}
