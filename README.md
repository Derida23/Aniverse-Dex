# Aniverse Dex

Discover, track, and explore anime — powered by [Jikan API](https://jikan.moe/) (MyAnimeList unofficial API).

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-v6-646cff?logo=vite)

## Features

**Search & Filter**
- Full-text search with debounce
- Filter by genre (multi-select), status, type, rating, min score, start date
- Infinite scroll pagination
- URL-synced filters (shareable search links)

**Anime Detail**
- Netflix-style hero with backdrop image
- Synopsis, characters with voice actors, user reviews
- Similar anime recommendations
- Add to watchlist, share, compare — all from hero section

**Watchlist**
- Local-first with localStorage persistence
- Status tracking: Watching, Completed, Plan to Watch, Dropped
- Dashboard with stats
- Cross-tab sync via BroadcastChannel

**Compare**
- Side-by-side comparison of 2 anime
- Core stats with visual bars + winner highlight
- Genre overlap analysis, synopsis, streaming links, related series

**Recommendations**
- Personalized feed based on watchlist taste profile
- Trending, top rated, and similar anime tabs
- Cold start wizard for new users

**Seasonal & Schedule**
- Today's releases, weekly schedule calendar
- Season browser with highlights (top + hidden gems)
- Countdown timers for upcoming episodes

**Other**
- i18n: English & Indonesian
- Dark / Light / System theme
- Responsive: mobile, tablet, desktop
- Page titles per route

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + TypeScript (strict) |
| Build | Vite 6 |
| Routing | React Router 7 |
| Server State | TanStack Query 5 |
| Client State | Zustand 5 |
| HTTP | Axios |
| Styling | Tailwind CSS 4 + shadcn/ui |
| i18n | react-i18next |
| Toast | Sonner |
| API | Jikan v4 (MyAnimeList) |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Install

```bash
pnpm install
```

### Environment

```bash
cp .env.example .env
```

Default API is the public Jikan endpoint — no key needed.

### Development

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
pnpm build
pnpm preview
```

### Test

```bash
pnpm test          # unit tests (vitest)
pnpm e2e           # e2e tests (playwright)
pnpm coverage      # coverage report
```

## Project Structure

```
src/
├── app/                 # Providers, router
├── components/
│   ├── ui/              # shadcn/ui components
│   └── shared/          # Navbar, theme, language
├── features/
│   ├── search/          # Search + filters
│   ├── anime-detail/    # Detail page, hero, characters, reviews
│   ├── watchlist/       # Watchlist + dashboard
│   ├── recommendation/  # Personalized feed, taste profile
│   ├── seasonal/        # Schedule, highlights, countdown
│   ├── compare/         # Side-by-side comparison
│   └── home/            # Landing page
├── hooks/               # Shared hooks
├── lib/                 # Axios, i18n, query client, utils
├── locales/             # en.json, id.json
└── types/               # TypeScript types
```

## License

MIT
