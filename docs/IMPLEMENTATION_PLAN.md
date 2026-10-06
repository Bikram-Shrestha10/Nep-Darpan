# Nep Darpan — Frontend-First Implementation Plan

Version: 0.2  
Date: 2026-10-05  
Status: Phase 0 baseline and frontend contract recorded; remaining provider and operational decisions stay open until their dependent phase.

## 1. Purpose and delivery order

This plan turns the [PRD](product/PRD.md), [TRD](engineering/TRD.md), and [System Design](architecture/SYSTEM_DESIGN.md) into ordered, reviewable tasks. The delivery order is intentionally frontend first:

1. Build and verify the responsive web user interface with realistic, typed mock data.
2. Approve the UI and its data/API contracts before backend work begins.
3. Build the PostgreSQL-backed backend and integrations, then replace the mock data adapters.
4. Run integrated verification, pilot the newsroom workflow, and launch.

The product is a browser-based responsive web application for phone, tablet, and desktop. A native mobile application is out of scope. The stack is Next.js/React with strict TypeScript, PostgreSQL, Redis for shared server-side caching, and Cloudinary for editorial image and video storage/delivery. During frontend work, PostgreSQL and Redis are not prerequisites and Docker Compose is not needed. Docker Compose will be used when the backend/database phase begins.

Each task has a test, review, and verification gate. A task is complete only after all three pass and its exit criteria are met. This process reduces risk and catches regressions early; no plan can guarantee that issues will never occur.

## 2. Working rules

1. Work on one numbered task at a time. Keep changes small enough to review and record the task ID in the work log or pull request.
2. Do not connect the frontend directly to PostgreSQL, Redis, Cloudinary secrets, or privileged service credentials. Frontend work uses typed fixtures behind a replaceable data adapter.
3. Define and review content/API contracts before wiring the frontend to real backend endpoints. Mock data must match those contracts and must be visibly fictional/non-production.
4. After every task, run its listed tests plus applicable formatting/lint, strict TypeScript, and build checks. Review the change, then verify it in the running web app. Do not carry a failed gate into the next task.
5. For user-facing tasks, verify keyboard use and narrow phone, tablet, and desktop browser widths. Fix findings and repeat the failed checks.
6. Record test commands and results, review findings, and verification evidence. Use newsroom review for editorial distinctions, security review for access/data/media changes, and accessibility review for shared/UI work.
7. Keep secrets out of source control and client bundles. Use separate development, staging, and production credentials and data.
8. Never treat wireframe headlines, dates, market values, identities, quotations, or sample media as verified news.

### Required gate for every task

| Gate | Required action | Pass condition |
|---|---|---|
| Test | Run the task-specific automated/manual checks plus relevant lint and strict TypeScript checks. | All checks pass; failures are fixed and rerun. |
| Review | Check the diff against the task and acceptance criteria; involve the named product, editorial, security, or accessibility reviewer as needed. | No unresolved correctness, security, privacy, accessibility, or content-trust issue. |
| Verify | Exercise the feature in a browser or staging environment and collect evidence; inspect responsive behavior for UI tasks. | Observed behavior matches exit criteria. |

## 3. Decisions to settle before dependent work

The user authorized proceeding with the recommended Phase 0 options. The following are the active product defaults for frontend development; unresolved policy and provider decisions remain open and must be settled before their dependent backend or release tasks.

| Decision | Accepted working baseline | Needed before |
|---|---|---|
| Launch language | Nepali is the default; show English only when a reviewed translation is available. | Frontend contract recorded; translator/reviewer assignment remains open before English content is enabled. |
| Staff roles and publication approval | Journalist, editor, fact-checker, and administrator; editor approves every article. Fact-check entries use fact-check review; editors can flag high-risk explainers. | Frontend contract recorded; criteria for high-risk remain open before workflow implementation. |
| Initial frontend scope | Home, categories, articles, search, explainers/guides/fact-checks, corrections, and newsroom prototypes. Defer newsletter and live market/weather modules. | Frontend scope recorded; external modules require later approval. |
| Trending and placement | Editor-curated lead, breaking, and trending placements. | Recorded; automated popularity ranking remains deferred. |
| Infrastructure and operations | Select application/DB/Auth/Redis hosting, regions, backups, support owner, and service objectives. Supabase remains a reference provider until approved. | Backend and release |
| Cloudinary policy | Confirm account/environments, file/type/size limits, video scope, rights/attribution fields, retention, and restricted delivery needs. | Media integration |
| External information providers | Approve each market/weather feed, its attribution and freshness threshold; otherwise hide the module. | External data integrations |
| Email and analytics | Approve providers, consent, retention, unsubscribe, and privacy policies. | Newsletter/analytics |
| Audience and service objectives | Set expected traffic, response-time and availability targets, recovery objectives, and on-call ownership. | Load/recovery tests and launch |

Optional provider choices must not block independent frontend work. Keep dependent integrations deferred until their provider and policy are approved.

## 4. Phase 0 — Scope and contract decisions

### Task 0.1 — Approve release scope and frontend contract — complete

- **Build:** Recorded the user-authorized recommended defaults in the PRD and this plan; created the [frontend content/API contract](engineering/FRONTEND_CONTRACT.md) with public types, gateway methods, visibility rules, localization behavior, and frontend scope.
- **Test:** Walked the reader and newsroom journeys against the P0 scope; mapped home, category, article, search, hub, correction, and newsroom prototype paths to contract fields and acceptance checks. Confirmed the public contract excludes drafts and staff-only data and that optional modules are deferred.
- **Review:** Cross-reviewed the contract against the PRD, TRD, and system design for editorial labels, publication visibility, media rights, locale behavior, and server boundaries. Remaining product-policy questions are recorded as open rather than guessed.
- **Verify:** Confirmed the frontend can run against fictional fixtures without PostgreSQL, Redis, Cloudinary credentials, or live data. Confirmed native apps, newsletter, and live market/weather modules are outside this frontend milestone.
- **Exit:** Phase 0 baseline and frontend contract are recorded. Proceed to Task 1.1; implementation tasks retain their own required gates.

## 5. Phase 1 — Frontend first, with mock data

### Task 1.1 — Create the frontend application foundation — complete

- **Build:** Added Next.js App Router with React, strict TypeScript, Node 24, Biome lint/format, Vitest, CI workflow, environment validation, reusable root layout, and the typed fixture gateway. Database and Redis containers remain deferred to Task 2.1.
- **Test:** `npm run check` passed: Biome lint and format check, strict TypeScript, 6 Vitest tests, and production build. `npm audit` reports 0 vulnerabilities.
- **Review:** Confirmed the frontend has no service secrets or production service dependencies and fixtures are explicitly fictional. Replaced the default Next ESLint config with Biome after its transitive `braces` dependency showed a high-severity advisory with no patched release; `npm audit` is now clean.
- **Verify:** Started the local Next.js server and requested `/`; received HTTP 200. Confirmed the rendered document contains Nep Darpan, the fictional-data warning, `lang="ne-NP"`, and no Create Next App branding.
- **Exit:** Clean local frontend foundation is running and all Task 1.1 gates passed. Continue to Task 1.2.

### Task 1.2 — Build design system and responsive shell — complete

- **Build:** Added paper, ink, rule, urgency, focus, typography, spacing, control, and state tokens; a Nepali masthead; desktop and compact navigation; phone bottom navigation; footer; buttons; search field; breadcrumbs; skip link; and reusable loading, empty, and error states. The shell uses the supplied wireframe's broadsheet hierarchy while keeping live modules and unapproved integrations out of scope.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, 13 Vitest tests, Axe scans for the shell/shared states, and the Next.js production build. `npm audit` reports 0 vulnerabilities.
- **Review:** Reviewed the diff and rendered phone/tablet/desktop screenshots for Devanagari hierarchy, readable line lengths, semantic landmarks, labels, visible fixture disclosure, restrained urgent color, reduced-motion behavior, and consistency with the frontend contract. Fixed test cleanup after Axe correctly detected duplicated landmarks left by earlier test renders.
- **Verify:** Rendered the running site in Microsoft Edge at 375×812, 820×1000, and 1440×1000. All three reported `scrollWidth === clientWidth`; `lang="ne-NP"`, the main landmark, and the primary heading were present. Keyboard Tab reached the skip link first and the mobile menu second; Enter opened the menu. Visual inspection confirmed responsive reflow at all three widths.
- **Exit:** Shared visual system and responsive shell gates passed. Await explicit user approval before Task 1.3.

### Task 1.3 — Build reusable story and media components — complete

- **Build:** Added typed lead and compact/standard story cards, topic and story-kind labels, editorials labels for breaking/opinion/analysis/fact-check/sponsored content, Nepali bylines and Kathmandu-localized timestamps, correction notices, related-story lists, source attribution, and responsive image/video placeholders. Placeholders expose alt text, captions, credits, aspect ratio, and video duration without fetching the fixture URLs or implying playback. Source links are limited to HTTP(S). Added a second explicitly fictional card fixture for responsive preview coverage.
- **Test:** `npm run check` passed lint/format, strict TypeScript, 22 Vitest tests, Axe scans, and the production build. Tests cover compact/standard cards, missing optional fields, long Devanagari headlines and author names, corrections, unique editorial labels, image/video alt and attribution, empty related content, unsafe source URLs, and fixture isolation. `npm audit --audit-level=high` found 0 vulnerabilities.
- **Review:** Reviewed the content components against the public contract. Labels remain explicit and do not rely on color alone; opinion and fact-check kind labels are not duplicated. Media fixtures make no network requests, empty alt text is decorative, video preview text is announced with its poster description, and unsafe source protocols are displayed without links. Removed an unsupported establishment-year claim from the shared masthead.
- **Verify:** Exercised the running site in Edge at 320×800, 375×812, 820×1000, and 1440×1000. Each request returned HTTP 200 with no browser page errors or horizontal overflow; the Nepali document language, server-rendered headline, image alternative text, and credit were present. Keyboard Tab reaches the skip link first and Enter opens the phone navigation. Visual inspection confirmed the lead and compact cards reflow with media present and missing.
- **Exit:** Shared story and media components pass their gates. Await explicit user approval before Task 1.4.

### Task 1.4 — Build public pages with mock content

- **Build:** Added the editorial homepage, latest feed, all navigation category routes, localized article routes, information-hub index, and explainer/guide/fact-check detail pages. Expanded the typed mock gateway with editor-curated lead/latest/trending/section data, metadata, corrections, safe source attribution, related stories, and hub review dates. Core content is server rendered; each public page has a persistent fictional-content notice. The fact-check fixture has no verdict or real claim. English stays unavailable until reviewed translations exist.
- **Test:** `npm run check` passed Biome lint and formatting, strict TypeScript, 24 Vitest tests, and Next.js production build. Tests cover fixture visibility, locale availability, categories including opinion/world, published/missing article behavior, correction/source/related fields, and the fact-check no-conclusion state. `npm audit --audit-level=high` found 0 vulnerabilities; `git diff --check` passed.
- **Review:** Reviewed all page templates against the frontend content contract and responsive wireframe hierarchy. Confirmed every navigation category resolves, editorial opinion/fact-check labels are explicit, no sample headline is represented as real reporting, the demo source uses a reserved invalid domain, and the source card external-link sanitizer remains in place. Manual Axe scans on home, category, article, and fact-check pages found 0 WCAG 2.1 A/AA or 2.2 A/AA violations. Visual screenshot review confirmed readable article hierarchy, corrections, sources, and related reporting.
- **Verify:** Microsoft Edge browser runner checked 13 routes at 320, 375, 820, and 1440 px (52 route/viewport combinations): all approved pages returned HTTP 200, had a main landmark and fixture disclosure, and showed no horizontal overflow. Unknown category/article/hub slugs and unsupported `/en/` article returned 404. Browser console had no page errors. Keyboard Tab reached the skip link first. Initial HTTP HTML contains page headings and story content before client JavaScript.
- **Exit:** Approved public page types are navigable, responsive, and populated only with fictional fixtures. Task 1.4 gates passed; await explicit user approval before Task 1.5.

### Task 1.5 — Build search and discovery interactions

- **Build:** Added a server-rendered `/search` page with a GET form, query, locale, category and story-kind filters, relevance/newest sorting, URL-backed pagination, suggested queries, latest-story discovery, and empty/loading/error states. The fixture adapter supports Unicode normalization, punctuation and symbol removal, all-term matching, relevance ranking, and three-item pages. English query terms can match editorial kind labels, but the English locale clearly reports that reviewed English content is not yet available. Search remains behind the replaceable `PublicContentGateway` and calls no external service.
- **Test:** `npm run check` passed lint, format, strict TypeScript, 32 Vitest tests, and production build. Search tests cover Nepali terms with punctuation, normalization, English kind queries, locale/category/type filters, relevance/newest ordering, pagination/clamping, punctuation-only and oversized queries, repeated/invalid URL parameters, and preservation of valid URL filter state. `npm audit --audit-level=high` found 0 vulnerabilities; `git diff --check` passed.
- **Review:** Reviewed labels and result cards for reader clarity, query parameters for bounded length and allowlisted filters, duplicate/malformed parameters for safe fallback, URL encoding and pagination links for state preservation, and gateway isolation for backend replaceability. English content is not fabricated or silently translated. Axe scans of the search prompt, results, English-empty, and filtered-empty states found 0 WCAG 2.1 A/AA or 2.2 A/AA violations.
- **Verify:** Microsoft Edge exercised Nepali query/punctuation, filter and no-result cases, English empty state, duplicate parameters, invalid page, and a two-page newest-sorted query. Form submission, refresh, browser back/forward, and pagination retained URL state. Four responsive widths (320, 375, 820, 1440 px) had no horizontal overflow. The production build served a direct page-two URL with HTTP 200 and the expected second-page story content.
- **Exit:** Search and discovery are usable from the URL with fixture data; English publication remains gated on reviewed translation. Task 1.5 gates passed; await explicit user approval before Task 1.6.

### Task 1.6 — Build newsroom screens as frontend prototypes

- **Build:** Added responsive sign-in, stories list/detail/editor, review queue, same-session preview, scheduling controls, correction form, local media selection/upload states, and permission-denied/loading/error screens. All newsroom pages use explicitly fictional fixtures; persistent notices explain that authentication, authorization, database saves, publication, and Cloudinary uploads are not connected. New draft state is held in memory and clears on refresh.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, 39 Vitest tests across 7 files, and the production build. Browser workflow verified a draft enters the review queue, approval appears in preview, and reload clears the draft. All 10 newsroom routes returned HTTP 200 at 320, 375, 820, and 1440 px with no horizontal overflow or browser JavaScript errors. Axe WCAG 2.1 A/AA scans found no violations on all 10 routes at 375 px. `npm audit --audit-level=high` found 0 vulnerabilities; `git diff --check` passed.
- **Review:** Reviewed all newsroom route and component changes against the frontend contract. Confirmed sign-in and denied pages explicitly state they do not enforce access, review actions do not publish stories, corrections do not alter public articles, and selected media files are not uploaded. No database, Redis, Cloudinary credentials, or live services are referenced. Editorial sign-off remains appropriate before the newsroom workflow is approved for real use.
- **Verify:** Exercised editor → review → approval → preview in Edge at 375×812; verified the title and approval label carried across routes and a refresh displayed the “draft not in memory” state. Checked 10 routes across phone, tablet, and desktop widths; no overflow/errors, and each page rendered its main heading and prototype disclosure. Axe found no A/AA issues; keyboard-native form controls and navigation remain operable.
- **Exit:** Newsroom interface and prototype interactions are implemented and verified as frontend-only. Actual authentication, server-side authorization, persistence, publication, and media upload remain Phase 2 work. Await explicit user approval before Task 1.7.

### Task 1.7 — Frontend quality gate and API contract freeze — technical gate passed; owner sign-off pending

- **Build:** Closed the P0 UI gaps found during contract review by adding inclusive Kathmandu-date search filters, browser-native article sharing with clipboard fallback, gateway-backed category options, reusable category/hub pagination, hub type filters, and honest destination pages for every footer link. Policy/contact pages remain placeholders until approved copy exists. Routed every public reader page through one typed `contentGateway` adapter. Expanded the frontend-to-contract mapping and recorded backend capabilities the UI assumes in [FRONTEND_CONTRACT.md](engineering/FRONTEND_CONTRACT.md).
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, 49 Vitest tests across 10 files, and the production build. Tests cover date validation/timezone boundaries, URL-preserved filters, category listing, pagination, safe placeholders, and sharing. `npm audit --audit-level=high` found 0 vulnerabilities; `git diff --check` passed after the final documentation edit.
- **Review:** Compared P0 reader and newsroom journeys with the PRD and contract. Fixed missing date filters and article share action, replaced the direct fixture import with the gateway adapter, added collection pagination, and fixed footer destinations. The first accessibility sweep caught an invalid list/alert role on malformed search dates; the semantics were corrected. Confirmed no app code calls external APIs and no PostgreSQL, Redis, Cloudinary, staff-auth, or persistence integration was introduced. Sitemap/feed/production SEO plumbing remains assigned to Task 2.5; newsroom commands still need reviewed server-side contracts and authorization. Product/editorial owner sign-off is pending; no human editor or SEO reviewer was named for this technical gate.
- **Verify:** Edge and Chrome loaded all 31 reader, newsroom, policy-placeholder, and filtered-route variants at 375 px; four representative reader/newsroom pages were also checked at 320, 375, 820, and 1440 px (94 route/viewport checks total). Axe WCAG 2.1 A/AA scans cover all 31 routes at 375 px. All 14 footer links returned HTTP 200. Date-only search returns the expected two results; pagination preserves both date bounds; article sharing copies the current URL in both browsers; keyboard Tab reaches the skip link. The targeted responsive checks found no overflow; no browser errors or external requests were detected. Replayed newsroom draft → review → approval → preview in Edge; approval is labeled as non-publishing and refresh clears the temporary draft.
- **Exit:** Technical checks and the contract review are ready for owner acceptance. The v1.0 contract remains a candidate until product/editorial owner sign-off; do not begin Task 2.1 or treat the API contract as frozen until the user approves this baseline. Contract changes after approval require explicit impact review.

## 6. Phase 2 — Backend and database after frontend approval

### Task 2.1 — Start local services and create PostgreSQL schema

- **Build:** Use Docker Compose for local PostgreSQL and Redis services with health checks, development-only credentials, named local volumes, and documented start/stop/reset steps. Add versioned PostgreSQL SQL migrations for approved staff/content/taxonomy/locale/revision/correction/media/homepage/hub/audit data. Add synthetic, non-production seeds and typed database contracts.
- **Test:** Start services and verify health checks; apply migrations to clean and upgrade databases; test constraints, indexes, seed repeatability, type generation, and recovery instructions.
- **Review:** Data/security review schema access, audit immutability, locale uniqueness, publication timestamps, retention, and least privilege.
- **Verify:** Inspect schema and query representative homepage/category/article/hub records; restart containers and verify local data persistence; reset only using documented development commands.
- **Exit:** Local dependencies are reproducible and reviewed migrations match the frozen frontend contract.

### Task 2.2 — Implement staff authentication and permissions

- **Build:** Connect the approved staff-auth provider; implement sessions, roles, protected newsroom routes, server-side authorization on every mutation, and least-privilege PostgreSQL policies/grants. Keep public reading anonymous.
- **Test:** Cover signed-out access, every role's allowed/denied actions, direct endpoint/action invocation, expired sessions, role changes, and database access policies.
- **Review:** Security review IDOR, escalation, session/CSRF handling, service credentials, and whether any action trusts client-supplied role/state.
- **Verify:** Sign in as each test role; attempt allowed and forbidden actions via UI and direct requests; confirm public pages reveal no staff data.
- **Exit:** Server and database enforce the approved role matrix and privileged actions are audited.

### Task 2.3 — Implement persistent editorial workflow and APIs

- **Build:** Implement repositories/data-access modules and server actions/route handlers matching the frozen contracts. Add draft, in-review, approved, scheduled, published, corrected, and archived transitions as approved; revisions, preview, timestamps, attribution, correction notes, and audit events. Replace fixture reads/writes behind the UI adapter.
- **Test:** Cover valid/invalid state transitions, concurrent edits, schedule/time-zone boundaries, rollback, correction visibility, draft/preview privacy, API validation, and database persistence.
- **Review:** Editor reviews workflow semantics and correction display; security reviewer inspects preview authorization and every mutation boundary.
- **Verify:** Run a story from draft through review, scheduling/publication, correction, and archive in local staging; verify the frontend displays persisted state and public routes expose only published content.
- **Exit:** Newsroom can publish without developer intervention and UI/API/data contracts agree.

### Task 2.4 — Integrate Cloudinary media securely

- **Build:** Add server-generated, narrowly scoped upload signatures; enforce role, file type, and size; verify uploads server-side; store asset ID, rights, attribution, alt text, caption, dimensions, format, duration, and visibility metadata in PostgreSQL. Connect the UI upload/selection flows and responsive media delivery.
- **Test:** Cover valid/invalid/expired signatures, forbidden roles, oversized/unapproved files, forged metadata, upload without registration, transformations, and private/unapproved original and derived URLs.
- **Review:** Security/editorial review API secret isolation, public/private delivery, upload presets, derived transformations, copyright, captions, rights, and removal process.
- **Verify:** Upload approved test image/video in staging, confirm transformations/captions, and verify restricted or unapproved assets are inaccessible by original and derived URLs.
- **Exit:** Only authorized and cleared media appears publicly, with provenance and rights retained in PostgreSQL.

### Task 2.5 — Add production search and distribution data

- **Build:** Implement PostgreSQL-backed search that matches the agreed Nepali/English behavior, filters, pagination, and public-only visibility. Wire the approved search UI. Implement canonical/hreflang metadata, Open Graph/social cards, NewsArticle structured data, sitemap, robots rules, and RSS/Atom feeds from persisted content.
- **Test:** Use newsroom-reviewed query fixtures; test Devanagari normalization, filters, malformed input, query/index performance, canonical consistency, JSON-LD, feed escaping/order, sitemap inclusion/exclusion, and draft exclusion.
- **Review:** Editor/SEO review relevance and metadata; engineering review query safety, abuse controls, index use, cache headers, and feed stability.
- **Verify:** Search approved staging corpus and inspect page metadata, feed, and sitemap; verify only eligible published content appears at canonical URLs.
- **Exit:** Search and distribution are backed by real data and match the approved UI contract.

### Task 2.6 — Add Redis caching and invalidation

- **Build:** Add a server-only Redis adapter with versioned, locale-aware keys, bounded TTLs, public-only projections, and invalidation on publish/update/correct/archive. Coordinate Redis and Next.js rendered-page/data cache invalidation; PostgreSQL stays authoritative.
- **Test:** Cover cache hit/miss, locale isolation, publication/correction/archive invalidation, timeout/outage fallback, stale expiry, and shared behavior across multiple app instances.
- **Review:** Inspect privacy/draft leakage, key design, stampede risk, invalidation completeness, Redis access controls/TLS, and safe failure behavior.
- **Verify:** Publish and correct a staging story and confirm pages/feeds update within the agreed freshness target; disable Redis and confirm content remains available from PostgreSQL.
- **Exit:** Redis improves eligible reads without changing correctness or becoming a required source of truth.

### Task 2.7 — Add approved external information integrations (conditional)

- **Build:** Only for approved providers, add isolated adapters for market/weather/other data. Store source, units, observed/fetched time, validation, and freshness; expose stale/unavailable states to the frontend.
- **Test:** Use fixtures for valid, malformed, delayed, stale, rate-limited, and unavailable responses; verify units, timezone conversions, attribution, timeouts, and retry behavior.
- **Review:** Data/editor owner approves rights, labels, and freshness; technical review checks secrets, failure states, and no invented fallback values.
- **Verify:** Compare staging display to the provider at a recorded time and simulate outage; if no source is approved, verify module remains hidden and mark deferred.
- **Exit:** Every displayed value has a source and timestamp, or the unapproved module is excluded.

### Task 2.8 — Add newsletter signup (conditional)

- **Build:** After provider and privacy policy approval, implement validated signup, consent evidence, confirmation/unsubscribe, provider integration, abuse controls, and retention policy.
- **Test:** Cover duplicate/invalid addresses, confirmation, unsubscribe, replay, rate limits, provider failure, and consent history.
- **Review:** Privacy and editorial owners approve consent language, retention, access, unsubscribe, and sending cadence.
- **Verify:** Use provider test mode to sign up and unsubscribe end-to-end; confirm no unconfirmed email receives messages if double opt-in is selected.
- **Exit:** Signup and unsubscribe meet the approved policy, or this remains disabled/deferred.

### Task 2.9 — Replace mock services and verify end-to-end integration

- **Build:** Remove production use of frontend fixtures and connect every approved screen to real server data. Retain fixtures only for tests/story examples; provide loading, empty, error, retry, and permission-denied states for real services.
- **Test:** Run end-to-end reader/newsroom journeys, API contract checks, database integration tests, migration tests, auth boundary tests, and UI regression suite.
- **Review:** Product/editor/technical review contract drift, fixture leakage, data exposure, editorial labels, and regression findings.
- **Verify:** Demonstrate persisted content from newsroom to public page, correction propagation, real search, cache fallback, and Cloudinary media on phone/tablet/desktop.
- **Exit:** No public or newsroom production screen depends on mock data; required integrated acceptance scenarios pass.

## 7. Phase 3 — Readiness, pilot, and release

### Task 3.1 — Security, accessibility, performance, and operations hardening

- **Build:** Add structured logs, error monitoring, health/readiness endpoints, privacy-approved analytics, dashboards, and incident/restore runbooks. Establish WCAG 2.2 AA review and Core Web Vitals targets based on approved service objectives.
- **Test:** Run cross-browser journeys, keyboard/screen-reader checks, accessibility scans, representative network throttling, dependency/security scans, and load tests against agreed targets.
- **Review:** Independent reviewers assess threat model, data exposure, newsroom resilience, accessibility, privacy, alert quality, and operations ownership.
- **Verify:** Demonstrate provider/database/Redis degradation, rollback, backup restore, and alert routing in non-production; record outstanding risks and evidence.
- **Exit:** No release-blocking security, accessibility, performance, or recovery finding remains.

### Task 3.2 — Stage and run an editorial pilot

- **Build:** Configure isolated staging, CI/CD and migration procedure, restricted access, synthetic stories, and editor onboarding checklist.
- **Test:** Run full regression and migration checks in staging; verify credential separation and that test emails/media cannot reach real audiences.
- **Review:** Editorial lead, product owner, and technical lead review pilot feedback, correction workflow, responsive usability, and open risks.
- **Verify:** Complete draft-to-publication/correction journeys and priority reader journeys on phone/tablet/desktop; confirm monitoring and backup evidence.
- **Exit:** Named owners approve release readiness and all P0 acceptance scenarios pass in staging.

### Task 3.3 — Launch and stabilize

- **Build:** Release with documented backup, approved schema migrations, smoke checks, rollback plan, on-call coverage, and editorial communications. Enable only approved features.
- **Test:** Run production-safe checks for home/category/article/search, staff sign-in/publishing, feeds/sitemap, Redis fallback, Cloudinary delivery, monitoring, and restore readiness.
- **Review:** Release owner reviews approvals, incidents, security findings, provider credentials, legal/editorial policies, and rollback point.
- **Verify:** Observe the agreed stabilization window; confirm publication invalidation, error/latency dashboards, backup completion, and support escalation.
- **Exit:** Launch owner records go/no-go and stabilization sign-off; remaining work is prioritized.

## 8. Later releases

These features are outside initial launch unless product scope is explicitly changed: reader accounts/bookmarks, automated trending/recommendation, push notifications, native mobile apps, personalization, expanded audio/video products, regional editions, subscriptions, and advertising. Update PRD/TRD/system design and repeat the task gates before adding them.

## 9. Release-level acceptance checklist

- Approved frontend is complete and reviewed before backend/database implementation starts.
- Public home, topics, articles, search, and approved hub content work without reader sign-in.
- Draft, review, scheduled, archived, preview, and restricted media are inaccessible publicly.
- Staff permissions are enforced server-side and at database boundaries; publication/correction actions are audited.
- Corrections are visible, attributed, timestamped, and propagated through rendered/cache/feed surfaces within the agreed freshness target.
- Core reading and navigation work by keyboard and at phone, tablet, and desktop widths; article text renders before client JavaScript.
- Redis outage falls back to PostgreSQL; Cloudinary access and rights behavior match policy.
- External data, if enabled, shows provider, units, observation time, and stale/unavailable state; unsupported modules stay hidden.
- Metadata, canonical URLs, structured data, sitemap, and feeds include only appropriate published content.
- Backup/restore, incident ownership, correction process, privacy policy, monitoring, and support have accountable owners.

## 10. Current status and next step

Phase 0 and Tasks 1.1–1.6 are complete. The Task 1.7 technical gate is ready for product/editorial owner acceptance, and the v1.0 frontend/API contract is a candidate pending that sign-off. The application serves Nepali-first responsive reader pages and frontend-only newsroom prototypes using fictional fixtures. Do not begin Task 2.1 until the user approves the UI/contract baseline. Docker, PostgreSQL, Redis, authentication, and Cloudinary integration remain deferred to the backend phases. Every implementation task requires its own test, review, and verification before the next begins.
