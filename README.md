# Nep Darpan

Nep Darpan is a responsive, Nepali-first news and information website for phone, tablet, and desktop browsers. Native mobile apps are out of scope.

## Current development stage

Tasks 1.1 and 1.2 are complete. The current homepage demonstrates the Nepali-first responsive design system and shared site shell with fictional, typed fixtures. Reusable story and media components are the next approved-plan task. PostgreSQL, Redis, Cloudinary, authentication, and live data are intentionally not connected yet. Never treat the fixture story as real reporting.

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
