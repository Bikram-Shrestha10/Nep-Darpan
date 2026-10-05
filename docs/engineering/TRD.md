# Nep Darpan — Technical Requirements Document

Version: 0.3  
Date: 2026-10-05  
Status: Technical baseline; frontend-first contract is documented separately and provider decisions remain open

## 1. Purpose and stack

This document translates the Nep Darpan PRD, supplied wireframe, and current news-site/product research into technical requirements. The database is PostgreSQL, accessed and managed with PostgreSQL SQL. Supabase is the proposed reference managed provider for PostgreSQL and staff authentication. Cloudinary is the selected system for storing, transforming, and delivering editorial images and videos. The reference implementation uses:

- React through the Next.js App Router for the public site, server rendering, newsroom interface, and limited application endpoints;
- TypeScript for application code;
- Supabase-managed PostgreSQL for the content system of record, with PostgreSQL SQL migrations and queries;
- Redis for a shared server-side cache of eligible public, derived data across application instances;
- Cloudinary for original image/video asset storage, responsive transformations, and CDN delivery;
- Supabase Auth for staff sign-in and optional future reader accounts;

Hosting, email, analytics, live-data providers, and exact package versions are unselected. Choose currently supported versions at implementation start. Do not make a business decision based only on a sample in the wireframe.

The deliverable is a responsive web application for phone, tablet, and desktop browsers. There is no native iOS or Android client in the current scope; app-store links in the supplied wireframe are placeholders.

## 2. Runtime and component requirements

### Rendering

- Use server-rendered or statically cached HTML for the public homepage, category pages, article pages, and hub pages. Headline and article body must be readable before client JavaScript runs.
- Use React Server Components for output and data access that do not need browser state. Add Client Components only for interaction, browser APIs, or high-frequency local state.
- Use server-side data-access modules for public queries and editorial mutations. Components must not each construct their own unchecked database access path.
- Use the current Next.js cache APIs deliberately. Document freshness and invalidation for home, articles, categories, and feeds.
- Defer non-critical below-the-fold modules only when that does not hide the main story or harm accessibility.

### TypeScript

- Use TypeScript for application, server endpoint, integration, and newsroom code, with `strict` type checking enabled.
- Share typed domain contracts across rendering and server code. Validate external and user-controlled input at runtime; compile-time types do not validate request bodies, webhook payloads, or Cloudinary upload results.
- Keep database row types generated or checked against PostgreSQL migrations. Avoid unchecked casts at authentication, authorization, and publication-state boundaries.

### Local development containers

- Use Docker Engine with Docker Compose for local PostgreSQL and Redis services so developers can reproduce data and cache dependencies consistently.
- Keep the Next.js development server on the host by default for hot reload; the application may also have a development container if the team finds that workflow useful.
- Pin service images to supported major versions, add health checks, use development-only credentials and named local volumes, and document start, stop, backup, and reset commands. Never mount production data or production secrets into local containers.
- Keep local database and Redis ports configurable to avoid collisions. A clean checkout must be able to start dependencies using the documented Compose workflow.
- Add a local Supabase stack only if that provider is selected and the team needs it; Docker does not determine production hosting or authentication choices.
- Cloudinary remains an external service. Use a dedicated test account or a test adapter for local work, and never put Cloudinary API secrets in the browser or container image.

### Redis cache

- Access Redis only from server-side data-access/cache modules. Never expose Redis credentials or connect browser clients directly.
- Cache eligible published public data such as article projections, category/home listings, and short-lived search results. PostgreSQL remains authoritative.
- Use locale-aware, versioned keys and bounded TTLs. Publishing, updating, correcting, or archiving content must invalidate affected Redis entries and any corresponding rendered-page cache.
- Cache misses and Redis failures fall back to PostgreSQL and must not make published content unavailable. Keep drafts, previews, staff data, and personal data out of shared public cache entries.
- Select a Redis deployment and Next.js cache integration compatible with the chosen hosting/runtime. Verify behavior across all application instances.

### Server endpoints and actions

Use Next.js Route Handlers for external HTTP interfaces such as:

- newsletter subscription intake;
- RSS/Atom or JSON API if a consumer requires it;
- signed publishing/integration webhooks;
- search endpoint if server-rendered search is insufficient;
- health/readiness endpoint with no secret-bearing output.

Use Server Actions for same-origin newsroom forms where appropriate. Both paths authenticate and authorize each mutation, validate input on the server, return safe errors, and do not trust client-provided role or article state.

### Suggested source layout

~~~text
app/
  [locale]/
    page.tsx
    category/[slug]/page.tsx
    news/[slug]/page.tsx
    search/page.tsx
    info/[slug]/page.tsx
    live/[slug]/page.tsx
  admin/
    page.tsx
    articles/...
  api/
    newsletter/subscriptions/route.ts
    newsroom/media/cloudinary/signature/route.ts
    newsroom/media/cloudinary/register/route.ts
    webhooks/...
src/
  components/
  features/
    articles/
    categories/
    search/
    newsletter/
    newsroom/
  lib/
    auth/
    db/
    media/cloudinary/
    seo/
    validation/
    integrations/
supabase/
  migrations/
  seed.sql
  tests/
~~~

Exact routing can change with the locale strategy. Public URLs should stay stable and readable. A proposed baseline is /ne, /en, /ne/category/economy, and /ne/news/story-slug; decide whether locale prefixes appear for all locales.

## 3. Supabase client and secret handling

- Create separate request-scoped server clients for cookie-authenticated staff work and anonymous public reads, using the supported Supabase SSR package/API at implementation time.
- Use the publishable key only in browser contexts where direct public access is needed. Prefer server-side reads unless direct browser access materially helps.
- Keep service-role/secret credentials in server-only modules and runtime secret storage. Do not use public-prefixed environment variables for privileged keys.
- Validate the authenticated user and role on every protected server operation. Authentication establishes identity, not newsroom permission.
- Use database migrations to apply grants, RLS policies, indexes, functions, and triggers consistently across environments.

Supabase documentation currently recommends cookie-based SSR setup for SSR frameworks and cautions that the SSR package API can change. Confirm the supported package and API at implementation time.

### Cloudinary credentials

- Keep the Cloudinary API secret in server-only runtime configuration. The cloud name and public API key may be exposed as documented public configuration; the secret must never be sent to the browser.
- Cloudinary is not the staff identity provider. Use the app's authenticated newsroom role checks before issuing signed upload parameters or changing asset access state.

## 4. Data model requirements

The initial schema should cover the entities below. The final schema and constraints belong in reviewed SQL migrations.

| Entity | Required fields / behavior |
|---|---|
| profiles | Auth user ID, display name, locale preference, active state; staff identity only, avoid excess profile data |
| user_roles | User ID, role, optional scope, grantor, grant time; controlled role vocabulary and auditable changes |
| authors | Public display name, slug, bio, portrait asset, active state; may be linked to a staff profile but need not be |
| story_groups | Stable ID grouping language variants of one editorial story |
| articles | ID, story group, locale, unique locale/slug, headline, summary, structured body, status, author/editor references, category, publish/schedule/update times, SEO fields, breaking/editorial priority, public visibility |
| article_revisions | Article ID, revision number, editor, saved time, content snapshot or immutable diff, change summary |
| categories and tags | Locale-aware display name and slug, description, sort order, active state |
| article_categories and article_tags | Many-to-many relationships with deterministic primary-category rules |
| article_authors | Multiple credited authors and stable byline order |
| media_assets | Cloudinary asset ID and public ID, resource type, delivery/access mode, version/format, dimensions, byte size, duration where relevant, alt text, caption, credit, license/source, uploader, approval state |
| article_media | Article-to-asset relation, placement/order, display treatment |
| corrections | Article, public correction text, reason/category, editor, created/published time, optional superseded correction |
| article_links | Explicit related-story/explainer relationships and editorial order |
| hub_entries | Explainer/guide/fact-check type, reviewed content, next review date, evidence/source links, status |
| homepage_placements | Locale, slot, content target, rank, start/end time, editor, active state |
| breaking_updates | Published update text, category, linked article, publication/expiry time, editor |
| newsletter_subscriptions | Normalized email or provider reference, consent text/version and time, locale, status, confirmation/unsubscribe state; restricted staff access |
| data_sources and market_snapshots | Provider, instrument, value, unit/currency, observed/fetched time, source URL, validation/stale state |
| bookmarks (P1) | Auth user ID and article ID; user can only read/write own rows |
| audit_events | Actor, operation, entity, timestamp, request ID, safe before/after summary for important newsroom actions |

### Database constraints and indexes

- Unique constraint on article locale and slug.
- Check constraints for supported locale, status, non-negative position, valid publication times, and state transitions where practical.
- Index public listing queries by status, locale, published time descending, and ID.
- Index article-to-category and article-to-tag join paths in useful directions.
- Search indexes scoped to locale and published content.
- Unique normalized email for active newsletter state, consistent with provider policy.
- Use integer or numeric/decimal types for market values; do not use floating point for money.
- Use foreign keys and explicit deletion behavior. Do not hard-delete published articles or authors when attribution must remain.

Keep large media out of Postgres. Store rich article bodies in a structured document format with a renderer and strict allowed-node/embed policy. Store or derive searchable text so search stays in sync with revisions.

## 5. Publication and authorization

### Article state transitions

Implement and audit explicit states: draft, in_review, approved, scheduled, published, archived. Corrections are separate public records. The newsroom must define withdrawal behavior. A user cannot publish an article just by submitting a published status from the browser.

### Role baseline

| Role | Read public | Create/edit own draft | Review | Publish/schedule | Correct/unpublish | Manage staff/config |
|---|---:|---:|---:|---:|---:|---:|
| Anonymous | Yes | No | No | No | No | No |
| Journalist | Yes | Yes | No | No | No | No |
| Editor | Yes | Yes | Yes | Yes | Yes, audited | No |
| Fact checker | Yes | Limited review fields | Fact-check review | No by default | No | No |
| Administrator | Yes | Policy-defined | Yes | Yes | Yes, audited | Yes |

Confirm desk-specific scopes, freelance access, and shared editing needs before implementation.

### RLS and grants

- Enable RLS on every table exposed through Supabase APIs.
- Define explicit grants per database role and policies per operation. A policy alone does not remove a table grant.
- Anonymous read is allowed only for published public projections and approved public assets.
- Staff write paths require both an authenticated actor and the appropriate newsroom role.
- Drafts and internal fields are inaccessible through anonymous queries.
- Bookmarks, preferences, and private reader records, if introduced, are scoped to their owner.
- Cloudinary upload signatures are issued only to authorized newsroom staff, with allowed resource types, folders, formats, and size limits. Asset approval and publication permissions remain enforced by the application and PostgreSQL.
- Include automated allow/deny coverage for database policies before production.

## 6. Search and discovery

- Keep locale, category, content type, date range, and sort controls in query parameters.
- Search only published public article/hub projections; never expose drafts through suggestions or facets.
- Rank exact headline matches above summary/body matches; use deterministic recency as a tie-breaker. Allow editorially pinned results where required.
- Start with PostgreSQL full-text search and a normalized substring/trigram fallback. Use weighted title/summary/body fields and appropriate GIN/trigram indexes after corpus testing.
- Normalize Unicode consistently for stored/indexed/query text. Support Devanagari and Latin queries; test conjuncts, diacritics, mixed-script names, punctuation, and transliteration.
- Do not assume English stemming or stop words produce useful Nepali results. Evaluate representative queries with newsroom readers. A dedicated search service is a later option if Postgres cannot meet measured relevance/latency.
- Bound query length, page size, sort options, and date range. Rate-limit public search if abused.
- Capture only privacy-approved aggregate search-quality signals.

## 7. Locale, content, and URLs

- Store each translation as its own editorial record under a shared story-group ID. Give each locale its own slug, summary, body, metadata, status, and review time.
- Store BCP 47 locale tags consistently. Set the document language and script metadata on each page.
- Use a documented font fallback stack for Devanagari and Latin. Prevent headline clipping, line-height collapse, and baseline mismatch at mobile breakpoints.
- Use canonical links per language and hreflang only for published translations.
- Store timestamps in UTC and render in the reader-selected or product-default timezone.
- If a translation is absent, do not imply the source story is translated. Fall back to a clear locale home or the available original according to product decision.

## 8. Media: Cloudinary

- Cloudinary is the image/video binary store and delivery CDN. PostgreSQL stores editorial metadata and Cloudinary identifiers; article rendering must not proxy media bytes through Next.js.
- Use the supported Cloudinary Next.js SDK for responsive image/video components and transformations. Generate delivery URLs from validated Cloudinary identifiers and predefined transformations; do not accept arbitrary transformation strings from clients.
- Newsroom uploads use a server-issued signed upload flow. A protected Next.js Route Handler checks staff identity/role, signs only allowlisted upload parameters, and returns no API secret. The browser uploads directly to Cloudinary, then calls a protected registration endpoint; the server verifies the upload response/signature and persists the Cloudinary asset ID/public ID and metadata.
- Generate upload signatures immediately before upload and do not retain or reuse them; Cloudinary signatures are valid for one hour from their timestamp.
- Restrict uploads to approved folders, image/video resource types, allowed formats, maximum file size/dimensions/duration, and upload presets. Unsigned uploads are disabled for newsroom assets. Validate reported resource type, dimensions, file size, and duration before an asset becomes selectable.
- Keep asset state explicit: uploaded/processing, needs editorial review, approved, rejected, and archived/deleted. Only approved assets with required alt text, caption where needed, credit, source, license/rights, and embargo/expiry metadata can be attached to published content.
- Cloudinary's default `upload` delivery is public. Use it only for cleared public assets. Unpublished, embargoed, or restricted assets must use authenticated delivery or an access-control policy that protects both originals and derived transformations. Cloudinary's `private` type alone may leave derived versions public unless strict transformation controls are configured. An obscure public ID or `noindex` header is not access control; confirm the required controls are available on the selected plan.
- Use responsive image derivatives with automatic format/quality and predefined crops. Store focal point or crop guidance when editors need to preserve subject framing. Use versioned Cloudinary assets so corrected media is not served from stale derived URLs.
- For video, store a poster image and provide accessible controls, captions/subtitles, and transcript. Defer player code until needed; do not autoplay with sound. Use a light progressive MP4 path for short/performance-sensitive clips and adaptive HLS/DASH delivery for longer video or variable network conditions.
- Do not treat a remote URL in the wireframe as an approved asset. Apply media rights, privacy, and attribution requirements before publication.
- Remove unnecessary EXIF/geolocation metadata from publicly delivered image derivatives. Keep photo credit, caption, rights, and source in explicit newsroom metadata.

## 9. APIs and external integrations

Proposed contracts; implement only endpoints required by launch.

| Method / path | Purpose | Access |
|---|---|---|
| GET /api/search | Search results when an HTTP API is required | Public, rate-limited, published records only |
| POST /api/newsletter/subscriptions | Validate and register/confirm subscription | Public, bot/rate controls, consent required |
| POST /api/newsroom/media/cloudinary/signature | Create constrained signed image/video upload parameters | Authenticated staff with media-upload permission only |
| POST /api/newsroom/media/cloudinary/register | Verify upload result and persist Cloudinary asset metadata | Authenticated staff; resource/size/status validation required |
| GET /rss.xml | Latest public stories | Public, cacheable |
| GET /sitemap.xml | Public URL discovery | Public, regeneration/invalidation-aware |
| POST /api/webhooks/publish | Optional integration/invalidation trigger | Signed, replay-resistant, least privilege |
| GET /api/health | Liveness/readiness summary | Public-safe or protected; no config/secrets |

The public website can call server-side data-access functions directly; do not build a duplicate REST API for every database query without a consumer.

For third-party data, use a typed adapter boundary and store provenance. Provider failures need timeout, retry/backoff, validation, idempotency, and stale-data behavior. Do not block article rendering on optional provider success.

## 10. SEO, feeds, and sharing

- Generate title, description, canonical URL, locale, social card, and truthful `NewsArticle`/`Article` JSON-LD from stored editorial fields.
- Keep metadata accurate after edits and corrections. Invalidate it with the story body.
- Include only canonical, published, indexable URLs in sitemaps. Omit drafts, noindex routes, duplicates, and invalid locale variants.
- Provide RSS with stable IDs, publication/update times, canonical links, and approved excerpt policy.
- Ensure social preview bots can fetch lead image and metadata; validate on the chosen host.
- Use robots rules to guide crawlers, not to secure private pages; security belongs at route/data layers.

## 11. Performance and capacity

Initial acceptance targets are provisional until traffic is estimated:

- Public Core Web Vitals: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at the 75th percentile for supported devices/markets.
- Cached article/home response target: 95th percentile TTFB ≤800 ms from the target audience region, subject to host and CDN.
- Search response target: 95th percentile ≤1.5 s on an agreed corpus and launch traffic profile.
- Breaking publish-to-visible target: ≤15 seconds; normal publish-to-visible target: ≤60 seconds.
- Avoid serial blocking calls for non-critical modules. Establish budgets for image bytes, font loading, and client JavaScript during implementation.
- Use Cloudinary responsive derivatives for the actual rendered slot size; reserve the largest source for the lead image and avoid downloading full-resolution originals into card layouts. Load video posters first and defer player code/playback until requested.
- Load-test the expected peak once audience/traffic is estimated, including concurrent readers during breaking traffic and newsroom publication.

These targets are not test results. Hosting topology and Supabase plan affect capacity and cost.

## 12. Operations and security

- Isolated development, staging, and production configuration; no production secrets in preview builds.
- Version-controlled migrations, reviewed schema changes, reversible migration strategy where practical, and test-seed separation.
- Automated code checks/build gates selected during implementation; secrets scanning and dependency review before production.
- HTTPS, secure session cookies, least privilege, staff account recovery, and multi-factor authentication for privileged staff where supported and approved.
- Content Security Policy, secure headers, upload protections, input validation, output encoding, and safe rich-text rendering.
- Restrict `img-src` and `media-src` to the configured Cloudinary delivery host; do not allow open-ended remote media URLs in article bodies.
- Rate limiting and abuse controls for search, newsletter capture, authentication, and public mutation endpoints.
- Dependency/security updates under a named maintainer process.
- Central error monitoring, structured logs, publish/audit events, Cloudinary upload/delivery/transformation error and usage alerts, provider-freshness alerts, and privacy-conscious web-vitals collection.
- Monitor Redis availability, latency, hit rate, evictions, and cache invalidation failures; alert on sustained failures that affect freshness or database load.
- Define backup frequency, recovery point objective, recovery time objective, retention, incident owner, and restoration drill before launch.

## 13. Technical acceptance checklist

Before production, confirm:

1. The chosen deployment supports configured rendering, cache, invalidation, image, and scheduled-job behavior.
2. Anonymous requests cannot read drafts, staff data, private notes, or unpublished media through the web layer or Supabase API.
3. Every newsroom mutation checks identity, role, allowed state transition, and input validity on the server.
4. RLS and grants are reviewed, and allow/deny cases have automated coverage.
5. Publish, update, correction, and archive invalidate affected Redis entries, rendered public surfaces, and feed metadata within the agreed target; failures are observable and retried safely.
6. Search checks cover Nepali Devanagari, English, mixed-script text, Unicode variants, empty queries, and pagination.
7. External indicator, mail, and media failures have safe user-visible behavior and operational signals.
8. Core reading paths meet agreed accessibility and performance targets in representative phone, tablet, and desktop browser viewports.
9. Backup restoration, environment separation, secret rotation, and incident ownership are documented.
10. Production content, translations, images, quotations, and data values are verified and rights-cleared.
11. Redis cache misses and outages fall back safely to PostgreSQL, and no draft, preview, staff, or personal data is served from shared public cache entries.
12. Production Cloudinary uploads are signed and staff-authorized; unapproved/embargoed media is access-controlled, API secrets stay server-side, and image/video delivery is responsive and accessible.

## 14. Decisions still required

- Supported Next.js/React/TypeScript and Supabase client package versions.
- Hosting/CDN, Redis deployment, image optimization, and cache coordination.
- Locale routing and translation workflow.
- Nepali search query set, normalization strategy, and relevance owner.
- External market/weather/email/analytics providers and their rights contracts; Cloudinary plan, usage limits, and media retention.
- Reader account scope and whether realtime, push, audio, or video belong in launch.
- Production traffic estimate, database plan, backup/recovery objectives, and support coverage.

## 15. Official technical references

Framework guidance can change; recheck these references when implementation versions are chosen.

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js caching and revalidation](https://nextjs.org/docs/app/guides/caching-without-cache-components)
- [Next.js TypeScript](https://nextjs.org/docs/app/getting-started/typescript)
- [Cloudinary Next.js SDK](https://cloudinary.com/documentation/nextjs_integration)
- [Cloudinary signed Next.js uploads](https://cloudinary.com/documentation/nextjs_image_and_video_upload)
- [Cloudinary authentication signatures](https://cloudinary.com/documentation/authentication_signatures)
- [Cloudinary media access control](https://cloudinary.com/documentation/control_access_to_media)
- [Cloudinary video player and adaptive delivery](https://cloudinary.com/documentation/cloudinary_video_player)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Core Web Vitals](https://web.dev/articles/vitals)
- [Supabase SSR authentication](https://supabase.com/docs/guides/auth/server-side)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Postgres full-text search](https://supabase.com/docs/guides/database/full-text-search)

