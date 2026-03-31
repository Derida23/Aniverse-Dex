import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Anime } from '@/types/jikan'

interface RecommendationCardProps {
  anime: Anime
  reason?: string
}

export default function RecommendationCard({ anime, reason }: RecommendationCardProps) {
  const displayTitle = anime.title_english ?? anime.title
  const posterUrl = anime.images.jpg.large_image_url ?? anime.images.jpg.image_url

  return (
    <Link to={`/anime/${anime.mal_id}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
      <Card className="overflow-hidden h-full transition-shadow group-hover:shadow-lg">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={posterUrl}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Hover overlay with synopsis + reason */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {reason && (
              <span className="mb-1.5 text-xs font-semibold text-yellow-400">{reason}</span>
            )}
            {anime.synopsis && (
              <p className="text-xs text-white/90 leading-relaxed line-clamp-5">
                {anime.synopsis}
              </p>
            )}
          </div>
        </div>

        <CardContent className="p-3 space-y-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">{displayTitle}</h3>

          <div className="flex items-center gap-1.5">
            {anime.score != null && (
              <span className="text-xs font-medium text-yellow-500">
                ★ {anime.score.toFixed(1)}
              </span>
            )}
          </div>

          {anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {anime.genres.slice(0, 3).map((genre) => (
                <Badge key={genre.mal_id} variant="secondary" className="text-xs px-1.5 py-0">
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}

          {anime.synopsis && (
            <p className="text-xs text-muted-foreground line-clamp-2">{anime.synopsis}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
