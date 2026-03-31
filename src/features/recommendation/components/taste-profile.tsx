import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useTasteProfile } from '../hooks/use-taste-profile'

export default function TasteProfile() {
  const { t } = useTranslation()
  const { profile, isLoading } = useTasteProfile()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('recommendation.tasteProfile')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))
        ) : profile.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('recommendation.tasteEmpty')}
          </p>
        ) : (
          profile.map((entry) => (
            <div key={entry.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{entry.name}</span>
                <span className="text-muted-foreground">{entry.percentage}%</span>
              </div>
              <Progress value={entry.percentage} className="h-2" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
