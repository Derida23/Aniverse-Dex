import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { RootLayout } from '@/components/shared/root-layout'

const HomePage = lazy(() => import('@/features/home/components/home-page'))
const SearchPage = lazy(() => import('@/features/search/components/search-page'))
const AnimeDetailPage = lazy(() => import('@/features/anime-detail/components/anime-detail-page'))
const WatchlistPage = lazy(() => import('@/features/watchlist/components/watchlist-page'))
const RecommendationPage = lazy(
  () => import('@/features/recommendation/components/recommendation-page')
)
const SeasonalPage = lazy(() => import('@/features/seasonal/components/seasonal-page'))
const ComparePage = lazy(() => import('@/features/compare/components/compare-page'))
const NotFoundPage = lazy(() => import('@/components/shared/not-found-page'))

function PageSkeleton() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
    </div>
  )
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'search', element: withSuspense(SearchPage) },
      { path: 'anime/:id', element: withSuspense(AnimeDetailPage) },
      { path: 'watchlist', element: withSuspense(WatchlistPage) },
      { path: 'recommendations', element: withSuspense(RecommendationPage) },
      { path: 'seasonal', element: withSuspense(SeasonalPage) },
      { path: 'compare', element: withSuspense(ComparePage) },
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },
])
