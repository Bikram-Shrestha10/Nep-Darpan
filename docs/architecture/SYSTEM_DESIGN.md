# Nep Darpan — System Design

Version: 0.2  
Date: 2026-10-04  
Status: Draft architecture baseline

## 1. Design objective

Deliver a fast, trusted responsive news and information website with a secure newsroom publishing system. Use Next.js with strict TypeScript for the full-stack web application. Keep article content, access rules, publication state, and media metadata authoritative in PostgreSQL. Use Redis as the shared server-side cache for eligible public, derived data; cache loss or outage must not affect content correctness. Use Cloudinary to store, transform, and deliver images and videos. All database schema changes, queries, policies, and functions use PostgreSQL SQL. Supabase is the reference managed provider for PostgreSQL and Auth. Treat Redis hosting, Cloudinary account configuration, and live-data sources as replaceable integrations.

## 2. Assumptions

- The site is Nepali-first and has a locale-aware content model. Nepali is the default route; English is supported when a reviewed translation exists.
- Reader and newsroom experiences are responsive web pages for phone, tablet, and desktop browsers. Native iOS and Android applications are outside the current scope.
- Next.js is the full-stack React application, not merely an API server behind a standalone React SPA.
- TypeScript with strict type checking is required for application, newsroom, and integration code.
- PostgreSQL is the system of record for editorial content and access control. Supabase is the reference managed provider for database, authentication, and storage, not a product requirement. Public users do not need to sign in.
- Redis is a shared cache for published public projections and other explicitly cacheable derived data; it is never the authoritative content store.
- Cloudinary stores and delivers image/video binaries. PostgreSQL stores their identifiers, publication status, and editorial metadata. Only cleared public assets use public delivery.
- Editors curate lead, breaking status, and the trending collection at launch. Automated audience-based trending is deferred.
- Hosting, mail delivery, analytics, market-data supplier, video programming/player scope, and expected audience size remain open.
- Exact framework/library versions are not pinned here; select currently supported versions when implementation starts.

## 3. System context

~~~mermaid
flowchart LR
  Reader[Reader browser or mobile web]
  Staff[Journalist, editor, administrator]
  Next[Next.js application<br/>public site, newsroom, server endpoints]
  DB[(Supabase PostgreSQL<br/>editorial system of record)]
  Cache[(Redis<br/>shared public-data cache)]
  Auth[Supabase Auth]
  Media[Cloudinary<br/>media storage, transformations, CDN]
  Mail[Email delivery provider]
  Data[Approved external data providers<br/>optional market or weather]
  Metrics[Privacy-reviewed analytics and monitoring]

  Reader -->|read pages, search, subscribe| Next
  Staff -->|sign in, edit, review, publish| Next
  Next -->|authorized queries and mutations| DB
  Next <-->|cache reads, writes, and invalidation| Cache
  Next <--> Auth
  Next -->|constrained upload signatures| Media
  Staff -->|direct signed image/video upload| Media
  Reader -->|responsive image/video delivery| Media
  Next -->|confirmed subscription or alert| Mail
  Data -->|validated source snapshot| Next
  Next -->|operational and approved events| Metrics
~~~

Do not let the browser connect with a privileged database credential. Public client access, if used, is limited to a publishable key and explicit least-privilege policies. Keep privileged operations behind server code.

## 4. Logical architecture

### Public web experience

- Locale-aware page shell, responsive navigation, home, category, article, search, information hub, and utility pages.
- Public pages query published content through server-side data-access functions. Components that only render content stay server-rendered; client code is reserved for interaction such as search controls, audio controls, menu state, and share affordances.
- Public pages render meaningful article text in the initial HTML. Images are responsive and optimized. Metadata is generated from canonical content.
- The homepage combines editor-controlled placements with chronological latest items. A cache is not a source of truth.
- Server-side data-access modules use Redis for shared hot public data, with PostgreSQL fallback on cache miss or Redis failure.

### Newsroom

- Authenticated dashboard, article editor, Cloudinary-backed media library, review queue, preview, publish scheduling, category/tag management, correction log, and role management.
- Server verifies the current user and permission for every mutation. Database policies provide a second access-control boundary.
- Publishing records who published what and when, then invalidates the affected public page, listing, sitemap/feed, and search index as applicable.
- Publishing blocks media that lacks approval, rights/source data, or required accessibility text.

### Application and integrations

- Next.js Server Components and server-side data access serve the website.
- Use Server Actions for same-application form mutations where suitable. Use Route Handlers for external webhooks, feed/API responses, and endpoints with a stable HTTP contract.
- An integration adapter validates external data and persists a normalized snapshot with source and observation time. Rendering a page must not be the only refresh mechanism.
- Newsletter delivery and background jobs use a selected provider or scheduler; credentials remain server-side.

### Data services

- Supabase Postgres stores editorial objects, roles, revisions, taxonomy, subscriptions, and source snapshots.
- Redis stores only eligible cache entries for public published data; it can be flushed and rebuilt from PostgreSQL.
- Supabase Auth manages staff authentication and, if later approved, optional reader accounts.
- Cloudinary stores original image/video assets, returns responsive/transformed delivery, and serves public approved media through its CDN. PostgreSQL stores asset IDs and editorial metadata, not binaries.
- Supabase Realtime is optional. The first public ticker can use short Redis TTLs and editor-triggered invalidation. Add realtime only if its latency requirement justifies its complexity.

## 5. Main data domains

~~~mermaid
erDiagram
  USER ||--o{ USER_ROLE : has
  USER ||--o| AUTHOR : may_be
  STORY_GROUP ||--o{ ARTICLE : translations
  ARTICLE ||--o{ ARTICLE_REVISION : history
  ARTICLE ||--o{ ARTICLE_AUTHOR : credited
  AUTHOR ||--o{ ARTICLE_AUTHOR : writes
  ARTICLE ||--o{ ARTICLE_CATEGORY : categorized
  CATEGORY ||--o{ ARTICLE_CATEGORY : contains
  ARTICLE ||--o{ ARTICLE_TAG : tagged
  TAG ||--o{ ARTICLE_TAG : classifies
  ARTICLE ||--o{ ARTICLE_MEDIA : uses
  MEDIA_ASSET ||--o{ ARTICLE_MEDIA : attached
  ARTICLE ||--o{ CORRECTION : corrected_by
  ARTICLE ||--o{ ARTICLE_LINK : related
  ARTICLE ||--o{ ARTICLE_LINK : references
  ARTICLE ||--o{ HUB_ENTRY : may_explain
  MARKET_SNAPSHOT }o--|| DATA_SOURCE : obtained_from
~~~

This shows the recommended domain shape, not a migration-ready schema. A language-specific article is the publishable unit; a story group connects reviewed translations without assuming every story has one. The TRD describes the proposed tables.

## 6. Critical flows

### Story publication

1. Journalist creates a draft. Structured content, headline, summary, locale, author, taxonomy, images, credits, and source notes are saved.
2. Editor reviews the preview, requests changes, approves, schedules, or publishes. Optional fact-check review is explicit rather than silently implied.
3. The server checks the editor's role and valid state transition. It records a revision and audit event in the same transaction as the publication-state change.
4. After commit, the system invalidates Redis entries and rendered cache entries for the story locale, home placements, category pages, feeds, and sitemap. Invalidation failures are retried and visible in operations monitoring.
5. Public routes read only the published view. Corrections and later updates trigger the same invalidation path.

### Media upload and publication

1. An authenticated journalist or editor requests an upload signature. The Next.js server checks newsroom permission and signs only an allowlisted Cloudinary upload configuration immediately before upload.
2. The browser uploads the image/video directly to Cloudinary using timestamped signed parameters (valid for one hour); the Cloudinary API secret remains server-side.
3. The browser submits the returned asset details to the newsroom registration endpoint. The server verifies Cloudinary's response or confirms the asset through the server-side Cloudinary API, then saves asset ID/public ID, resource type, dimensions, format, bytes, duration, and uploader to PostgreSQL.
4. The asset remains in review until an editor records its alt text, caption, credit, source, license/rights, and access state. Only approved, publishable assets attach to public content.
5. Cloudinary serves responsive image/video derivatives directly to readers after approval. Draft/embargo media uses authenticated delivery or an access policy that also restricts transformed derivatives; a public ID alone is not treated as secrecy.

### Public article read

1. Browser requests a locale and stable story slug.
2. Next.js loads the public published representation on the server, resolving metadata and related items.
3. Cache behavior follows the publication freshness tier. An unavailable secondary module does not hide the story body.
4. The page includes publication/update/correction details, byline and media credit, accessible structure, and alternate-language link only when it exists.

### Search

1. Query and selected facets are encoded in the URL so results are shareable and navigable.
2. Server validates and bounds query length, pagination, locale, and filters.
3. Database search covers public published records only, sorts by relevance then recency, and applies category/date/content-type facets.
4. Search logs, if enabled, are minimized under an approved privacy policy. Nepali and Latin-script behavior is measured separately.

### External indicator refresh

1. A scheduled worker or provider callback fetches from the approved source.
2. An adapter validates schema, unit, currency, observation timestamp, plausible bounds, and source attribution.
3. A new immutable snapshot is stored. Failure leaves the prior value marked with its actual timestamp and stale status.
4. The site shows source and freshness and never invents a substitute value. A manual override, if allowed, records owner and time.

## 7. Publication states and trust model

Recommended article states: draft → in review → approved → scheduled → published → archived. A correction is a separate record and visible notice, not a hidden state that overwrites public history. A rejected or withdrawn story has a recorded reason and defined public behavior.

Fact-check review can be a state or checklist depending on editorial policy. Do not claim a story is “fact checked” unless the newsroom defines the process and stores its evidence, reviewer, scope, and date.

Newsroom controls determine the lead, breaking marker, editor-curated trending collection, and home-page order. If a later “most read” module uses audience counts, label that basis, protect it from trivial manipulation, and never let it automatically elevate unverified content.

## 8. Security boundaries

- Anonymous readers retrieve only published public content and approved public assets.
- Staff access uses authenticated identity plus server-checked roles and scoped database policies.
- Separate journalist, editor, fact-checker, and administrator capabilities as the real workflow requires. Avoid making every staff account an administrator.
- Store permissions in a controlled role mapping. Hiding admin navigation is not authorization.
- Enable and test row-level security and explicit grants on exposed tables. Adding a policy does not necessarily remove existing table grants.
- The Supabase service-role/secret key bypasses RLS; isolate it to server-only code, and never bundle it to the browser.
- Keep the Cloudinary API secret server-side. Only authenticated newsroom users can request upload signatures; validate resource type, format, size, and duration before recording assets.
- Use public Cloudinary delivery only for cleared public media. Keep draft, embargoed, and restricted media in a protected delivery mode that restricts both originals and transformed derivatives, supported by the selected Cloudinary plan.
- Validate and sanitize rich text and embeds. Allowlist embed hosts, reject unsafe schemes, constrain upload type/size, and attach media rights metadata.
- Protect forms and webhooks with rate limits, request validation, CSRF/origin protections for cookie-authenticated mutations, and replay protection for signed integrations.
- Keep drafts, internal notes, PII, and moderation data out of public caches and responses.

## 9. Caching and freshness

| Data | Expected freshness | Strategy |
|---|---|---|
| Published article and category listing | Cached; invalidated on editor publish/update/correction | Redis keys include content identity and locale; targeted invalidation also refreshes rendered pages |
| Home lead and breaking ticker | Brief cache or targeted invalidation on editorial change | Editorial action invalidates entries; monitor publish-to-visible latency |
| Search results | Brief Redis cache keyed by normalized query, locale, and facets | Cache public published results only; never share private/session-specific data |
| Staff dashboard, drafts, previews | Request-specific; never shared publicly | Authenticated uncached server response |
| Source snapshot | Refresh schedule set by source agreement; show observation time | Persist snapshots and show stale/failed state |
| Images and static assets | Long-lived Cloudinary CDN delivery after approval | Derive URLs from the asset ID/version and approved transformation presets; use a new asset version when bytes change |

PostgreSQL remains the source of truth. Redis is an optimization: on misses or Redis errors, load public content from PostgreSQL and repopulate when available. Keep shared cache entries limited to published public data; do not cache drafts, previews, staff data, or personal data. Use bounded TTLs and targeted invalidation on editorial changes. Integrate Redis with the selected Next.js cache APIs through a server-side adapter and verify invalidation semantics on the production host. A multi-instance deployment must share Redis and coordinate rendered-cache invalidation across instances. Never depend on a short TTL as the only breaking-news publication path.

## 10. Deployment and environments

Maintain isolated development, staging, and production environments with separate databases, Redis instances/namespaces, Cloudinary product environments (or tightly separated folders/presets), authentication configuration, secrets, email lists, and provider credentials. With the Supabase reference setup, use separate projects for these environments. Apply schema changes through reviewed, version-controlled migrations.

Select hosting that supports the required Next.js server runtime, Redis connectivity, cache invalidation, image delivery, secret management, scheduled work, preview deployments, and logs. Vercel is one possible option, not a decision made by this design. If deployed to multiple instances, validate shared Redis behavior and rendered-cache invalidation.

## 11. Availability, recovery, and observability

- Decide RPO/RTO based on newsroom tolerance for lost drafts and downtime. Confirm backup and point-in-time recovery availability on the selected plan before launch; test restoration.
- Monitor public status, server errors, database latency/connections, Redis availability/latency/hit rate/evictions, Cloudinary upload/transformation/CDN errors and usage, auth failures, publish-to-visible delay, search latency, and stale external data.
- Use structured logs with request ID, route, locale, article ID, and operation result. Avoid logging session tokens, full newsletter addresses, private notes, or unredacted search history.
- Alert an owner on repeated publish/invalidation failure, backup failure, elevated 5xx, or stale critical data. Define operational ownership and incident communications.

## 12. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Breaking story stays cached after publish | Targeted invalidation, publish-to-visible monitoring, and a fallback path |
| Redis is unavailable or serves an expired entry | Fall back to PostgreSQL, enforce bounded TTLs, and monitor cache errors and hit/freshness behavior |
| Nepali search returns poor matches | Benchmark queries; combine full-text and normalized substring/trigram matching; assess dedicated search only after evidence |
| Unauthorized draft or service credential exposure | Server-only secrets, explicit grants/RLS, role checks, and negative-access review |
| External data is stale or misattributed | Persist source/observed time, validate units, show stale state, and do not fabricate a value |
| Draft/embargo media becomes publicly reachable | Use Cloudinary protected delivery for non-public assets; require editorial approval before public delivery |
| Translations drift or get unrelated slugs | Treat locale variants as separately reviewed articles linked by a story group |
| Images or embeds lack publication rights | Required rights/credit fields and an editorial publishing check |
| Early scope overwhelms the newsroom | Ship core editorial workflow first; gate live audio, push, personalization, and complex dashboards |

## 13. Official technical references

These references informed the framework-specific recommendations; verify them again when selecting implementation versions.

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js caching and revalidation](https://nextjs.org/docs/app/guides/caching-without-cache-components)
- [Next.js TypeScript](https://nextjs.org/docs/app/getting-started/typescript)
- [Cloudinary Next.js SDK](https://cloudinary.com/documentation/nextjs_integration)
- [Cloudinary signed uploads](https://cloudinary.com/documentation/nextjs_image_and_video_upload)
- [Cloudinary media access control](https://cloudinary.com/documentation/control_access_to_media)
- [Cloudinary video player and adaptive delivery](https://cloudinary.com/documentation/cloudinary_video_player)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Core Web Vitals](https://web.dev/articles/vitals)
- [Supabase server-side authentication](https://supabase.com/docs/guides/auth/server-side)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Postgres full-text search](https://supabase.com/docs/guides/database/full-text-search)

