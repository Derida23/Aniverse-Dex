import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Anime } from '@/types/jikan'
import { apiClient } from '@/lib/axios'
import type { JikanSingleResponse, AnimeDetail } from '@/types/jikan'

interface AnimeCardProps {
  anime: Anime
}

async function fetchAnimeDetail(id: number): Promise<AnimeDetail> {
  const { data } = await apiClient.get<JikanSingleResponse<AnimeDetail>>(`/anime/${id}/full`)
  return data.data
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const qc = useQueryClient()

  const prefetch = () => {
    void qc.prefetchQuery({
      queryKey: ['anime', 'detail', anime.mal_id],
      queryFn: () => fetchAnimeDetail(anime.mal_id),
      staleTime: 1000 * 60 * 10,
    })
  }

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="group flex flex-col gap-2"
      onMouseEnter={prefetch}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {anime.score !== null && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs text-white">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {anime.score.toFixed(1)}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="line-clamp-2 text-sm font-medium leading-tight">{anime.title}</p>
        <div className="flex flex-wrap gap-1">
          {anime.genres.slice(0, 2).map((g) => (
            <Badge key={g.mal_id} variant="secondary" className="text-xs px-1.5 py-0">
              {g.name}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}
