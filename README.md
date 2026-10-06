# Nep Darpan

Nep Darpan is a responsive, Nepali-first news and information website for phone, tablet, and desktop browsers. Native mobile apps are out of scope.

## Current development stage

Tasks 1.1–1.6 are complete. The Task 1.7 technical frontend/API gate is ready for product/editorial owner sign-off; Task 2.1 has not started. The responsive public site includes the homepage, latest feed, categories, article pages with share controls, information hub, and URL-backed search with date filters and pagination over clearly labeled fictional, typed fixtures. Frontend-only newsroom prototypes include sign-in, story editing, review, preview, corrections, scheduling, and media selection states. Draft edits only persist in memory for the current browser session. PostgreSQL, Redis, Cloudinary upload, authentication, server-side authorization, and live data are intentionally not connected yet. Never treat fixture stories or media previews as real reporting or published media.

## Requirements

- Node.js 24 (Next.js requires Node.js 20.9 or later)
- npm

## Run locally

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` only if you need a local environment file. No service variables are required during the fixture phase.
3. Start the site with `npm run dev`.
4. Open `http://localhost:3000`.

## Quality checks

- `npm run lint` — Biome lint checks.
- `npm run format:check` — verify formatting.
- `npm run typecheck` — strict TypeScript checks.
- `npm run test` — Vitest unit tests.
- `npm run build` — production build.
- `npm run check` — run all checks in sequence.

GitHub Actions runs the dependency audit and quality checks for pushes and pull requests.

## Project documents

- [Phased implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Product requirements](docs/product/PRD.md)
- [Technical requirements](docs/engineering/TRD.md)
- [Frontend content/API contract](docs/engineering/FRONTEND_CONTRACT.md)
- [System design](docs/architecture/SYSTEM_DESIGN.md)
