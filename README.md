# Mongle (몽글)

Soft-cinematic sanctuary for movies, moods, and journal reflections.

## Stack

- Next.js 14 + TypeScript + Tailwind CSS
- Dongle (브랜드·제목) + Nunito / Pretendard (본문)
- Lucide React
- Design: Soft-Cinematic Glassmorphism (`docs/001`)

## Run

```bash
nvm use 20
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## Screens

| Path | Doc | Description |
|---|---|---|
| `/` | `docs/00_home` | Today's Pick + Continue Watching + Soft Fluffy + Rainy Day |
| `/explore` | `docs/03_search&explore` | Search + mood chips + Trending bento + Sentiment |
| `/archive` | `docs/02_myArchive` | Stats + journal cards with cloud bubbles |
| `/movie/[id]` | `docs/01_details` | Cinema backdrop + Synopsis + Cast + Related |
| `/profile` | — | Profile |

## Design docs

- [`docs/00_home`](docs/00_home)
- [`docs/01_details`](docs/01_details)
- [`docs/02_myArchive`](docs/02_myArchive)
- [`docs/03_search&explore`](docs/03_search&explore)
- [`docs/mongle_spec.md`](docs/mongle_spec.md)
