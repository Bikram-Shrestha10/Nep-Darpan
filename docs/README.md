# Nep Darpan product and engineering documents

Draft set: 0.3  
Prepared: 2026-10-05  
Status: Phase 0 scope and frontend contract recorded as the working baseline; provider and operational decisions remain open.

These documents turn the supplied Stitch wireframe into an implementation-ready starting point. The HTML and images are visual references. Headlines, dates, market values, weather, quotations, identities, and other sample content shown there are placeholders; they are not verified reporting or approved live data.

## Documents

- [Product Requirements Document](product/PRD.md) — audience, outcomes, launch scope, requirements, priorities, and acceptance criteria.
- [System Design](architecture/SYSTEM_DESIGN.md) — architecture, service boundaries, reader and publishing flows, data domains, security boundaries, and trade-offs.
- [Technical Requirements Document](engineering/TRD.md) — reference stack, application structure, schema, interfaces, security, search, rendering, operations, and technical acceptance.
- [Frontend Content and API Contract](engineering/FRONTEND_CONTRACT.md) — typed frontend data shapes, mock-data boundary, localization, visibility rules, and page-to-data mapping.
- [Newsroom and Admin Panel guide](admin/README.md) — current website functionality, newsroom prototype limits, target admin navigation/layout, role baseline, workflows, and acceptance checklist.
- [Phased Implementation Plan](IMPLEMENTATION_PLAN.md) — frontend-first task sequence, backend/database follow-up, and required test, review, and verification gates for every task.

## Baseline assumptions

1. Nep Darpan is a Nepali-first digital newsroom and information hub for readers in Nepal and the diaspora.
2. Nepali is the default public language. English is included in the content model and routes as a planned second language; simultaneous bilingual launch remains open.
3. PostgreSQL is the required database, accessed with PostgreSQL SQL; Supabase is the reference managed database and staff-auth provider.
4. Next.js is the full-stack React application and TypeScript is required for application code. The site is responsive in phone, tablet, and desktop browsers; native mobile apps are out of scope.
5. Redis is the shared cache for eligible public, derived data across application instances. PostgreSQL remains the source of truth; Redis can be bypassed on cache miss or outage.
6. Cloudinary stores and delivers editorial images and videos. PostgreSQL stores media metadata, provenance, rights, and Cloudinary asset identifiers.
7. Public reading does not require an account. Newsroom actions require named staff accounts and server-enforced permissions.
8. Launch focuses on trusted publishing, discovery, responsive web reading, editor-curated trending/latest coverage, and an information hub. Personalization and automated trending are later increments.
9. Market, weather, audio, email, analytics, hosting, video programming scope, and external data feeds require agreed providers, rights, and launch decisions.
10. Docker Compose is planned for local PostgreSQL and Redis when the backend/database phase begins; this does not select a production hosting provider.

## Recommended decisions before implementation

- Confirm Nepali-only versus bilingual first release and who translates or reviews translations.
- Confirm editorial roles, approval rules, and whether every story needs a fact-check step.
- Define media rights, Cloudinary account/environment limits, and freshness expectations for market-data sources.
- Choose application and Redis hosting, email delivery, analytics, expected traffic, and support owner.
- Confirm reader account features, advertising/sponsorship policy, retention, and recovery objectives.


