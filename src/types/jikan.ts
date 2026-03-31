export interface Genre {
  mal_id: number
  name: string
  type: string
  url: string
}

export interface MalEntry {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface VoiceActor {
  person: { mal_id: number; name: string; images: { jpg: { image_url: string } } }
  language: string
}

export interface Anime {
  mal_id: number
  title: string
  title_english: string | null
  images: { jpg: { image_url: string; large_image_url: string } }
  score: number | null
  scored_by: number | null
  rank: number | null
  popularity: number
  status: 'Finished Airing' | 'Currently Airing' | 'Not yet aired'
  genres: Genre[]
  themes: Genre[]
  episodes: number | null
  duration: string
  synopsis: string | null
  aired: { from: string | null; to: string | null }
  season: 'winter' | 'spring' | 'summer' | 'fall' | null
  year: number | null
  type: string | null
  source: string | null
  studios: MalEntry[]
  airing: boolean
  members: number
  favorites: number
}

export interface AnimeDetail extends Anime {
  background: string | null
  relations: { relation: string; entry: MalEntry[] }[]
  streaming: { name: string; url: string }[]
  trailer: { youtube_id: string | null; url: string | null; embed_url: string | null }
}

export interface Character {
  character: { mal_id: number; name: string; images: Anime['images'] }
  role: 'Main' | 'Supporting'
  voice_actors: VoiceActor[]
}

export interface AnimeReview {
  mal_id: number
  type: string
  reactions: { overall: number; nice: number; love_it: number; funny: number; confusing: number; informative: number; well_written: number; creative: number }
  date: string
  review: string
  score: number
  tags: string[]
  is_spoiler: boolean
  is_preliminary: boolean
  episodes_watched: number | null
  user: { username: string; url: string; images: { jpg: { image_url: string } } }
}

export interface AnimeFilters {
  q?: string
  genres?: string
  min_score?: number
  status?: string
  type?: string
  rating?: string
  start_date?: string
  page?: number
}

export interface JikanListResponse<T> {
  data: T[]
  pagination: {
    last_visible_page: number
    has_next_page: boolean
    current_page: number
    items: { count: number; total: number; per_page: number }
  }
}

export interface JikanSingleResponse<T> {
  data: T
}

export interface Schedule {
  mal_id: number
  title: string
  images: Anime['images']
  score: number | null
  genres: Genre[]
  broadcast: { day: string | null; time: string | null; timezone: string | null; string: string | null }
  episodes: number | null
  synopsis: string | null
  airing: boolean
}
