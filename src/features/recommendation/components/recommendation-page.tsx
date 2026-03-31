import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/use-page-title'
import { useWatchlistStore } from '@/features/watchlist'
import { useColdStart } from '../hooks/use-cold-start'
import ColdStartWizard from './cold-start-wizard'
import TasteProfile from './taste-profile'
import RecommendationFeed from './recommendation-feed'

export default function RecommendationPage() {
  const { t } = useTranslation()
  usePageTitle(t('recommendation.title'))
  const { hasCompleted } = useColdStart()
  const items = useWatchlistStore((state) => state.items)
  const isWatchlistEmpty = items.length === 0

  const showColdStart = !hasCompleted && isWatchlistEmpty

  if (showColdStart) {
    return <ColdStartWizard />
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="mb-8 text-3xl font-bold">{t('recommendation.title')}</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-1/3 lg:shrink-0">
          <TasteProfile />
        </aside>
        <main className="min-w-0 flex-1">
          <RecommendationFeed />
        </main>
      </div>
    </div>
  )
}
