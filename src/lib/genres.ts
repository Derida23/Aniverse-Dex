export const GENRE_OPTIONS = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 7, name: 'Mystery' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' },
  { id: 14, name: 'Horror' },
  { id: 18, name: 'Mecha' },
  { id: 19, name: 'Music' },
  { id: 22, name: 'Romance' },
  { id: 24, name: 'Sci-Fi' },
  { id: 30, name: 'Sports' },
  { id: 36, name: 'Slice of Life' },
  { id: 37, name: 'Supernatural' },
  { id: 40, name: 'Psychological' },
  { id: 41, name: 'Thriller' },
] as const

export const GENRE_NAME_TO_ID: Record<string, number> = Object.fromEntries(
  GENRE_OPTIONS.map((g) => [g.name, g.id]),
)

export const GENRE_ID_TO_NAME: Record<number, string> = Object.fromEntries(
  GENRE_OPTIONS.map((g) => [g.id, g.name]),
)
