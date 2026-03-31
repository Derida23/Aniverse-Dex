export const animeDetailKeys = {
  all: ['anime'] as const,
  details: () => [...animeDetailKeys.all, 'detail'] as const,
  detail: (id: number) => [...animeDetailKeys.details(), id] as const,
  full: (id: number) => [...animeDetailKeys.details(), id, 'full'] as const,
  characters: (id: number) => [...animeDetailKeys.detail(id), 'characters'] as const,
  recommendations: (id: number) => [...animeDetailKeys.detail(id), 'recommendations'] as const,
  reviews: (id: number) => [...animeDetailKeys.detail(id), 'reviews'] as const,
}
