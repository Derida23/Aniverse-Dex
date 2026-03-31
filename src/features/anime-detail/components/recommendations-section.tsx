import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useAnimeRecommendations } from '../api/use-anime-detail'

interface RecommendationsSectionProps {
  animeId: number
}

export default function RecommendationsSection({ animeId }: RecommendationsSectionProps) {
  const { t } = useTranslation()
  const { data: recommendations, isPending, isError } = useAnimeRecommendations(animeId)

  if (isPending) {
    return (
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">{t('detail.similarAnime')}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-36 shrink-0 rounded-lg" />
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">{t('detail.similarAnime')}</h2>
        <p className="text-destructive text-sm">{t('detail.failedRecommendations')}</p>
      </section>
    )
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">{t('detail.similarAnime')}</h2>
        <p className="text-muted-foreground text-sm italic">{t('detail.noRecommendations')}</p>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">{t('detail.similarAnime')}</h2>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-muted-foreground/30">
        {recommendations.map(({ entry }) => (
          <Link
            key={entry.mal_id}
            to={`/anime/${entry.mal_id}`}
            className="shrink-0 w-36 group"
          >
            <div className="overflow-hidden rounded-lg border bg-card shadow-sm transition-all group-hover:shadow-md group-hover:scale-[1.02]">
              <div className="relative aspect-2/3 overflow-hidden">
                <img
                  src={entry.images.jpg.image_url}
                  alt={entry.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-2">
                <p className="text-xs font-medium leading-tight line-clamp-2">
                  {entry.title_english ?? entry.title}
                </p>
                {entry.score != null && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    ★ {entry.score.toFixed(1)}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
