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

### Task 1.2 — Build design system and responsive shell

- **Build:** Implement paper-and-ink tokens, Devanagari-capable typography, layout/grid, header, responsive browser navigation, footer, buttons, cards, forms, breadcrumbs, focus styles, and reusable loading/error/empty states based on the supplied wireframe.
- **Test:** Add component tests for shared controls/navigation and automated accessibility checks for shell components.
- **Review:** Design/editorial review visual hierarchy, Nepali script, readability, wireframe interpretation, and responsive navigation labels.
- **Verify:** Inspect keyboard-only use and phone/tablet/desktop widths; verify no horizontal overflow and usable zoom/reflow.
- **Exit:** Shared visual system and shell approved for all public and newsroom screens.

### Task 1.3 — Build reusable story and media components

- **Build:** Create typed story cards, lead-story layouts, topic labels, author/byline, timestamps, correction notices, opinion/fact-check labels, related-story blocks, responsive image/video placeholders, and source/attribution displays using fixtures.
- **Test:** Cover variants, missing optional data, long Nepali headlines, long author names, correction state, image alternative text, and loading/error states.
- **Review:** Editor verifies that reporting, opinion, sponsored content, fact checks, corrections, and source attribution cannot be confused visually.
- **Verify:** Inspect component combinations at all target widths and with long Devanagari text; confirm graceful layout with missing media.
- **Exit:** Reusable components satisfy the content contract and editorial labels are clear.

### Task 1.4 — Build public pages with mock content

- **Build:** Implement home, topic/category, article, explainer/guide, and fact-check pages. Include editor-curated lead/latest/trending fixtures, author and timestamp, correction history presentation, related reporting, and responsive media. Render core content on the server from fixtures.
- **Test:** Add route/component/browser tests for page states, locale availability, missing content, correction display, labels, and not-found behavior.
- **Review:** Newsroom/design review information hierarchy and trust signals; accessibility review headings, landmarks, links, image alternatives, and reading order.
- **Verify:** Browse representative pages at phone/tablet/desktop widths; disable JavaScript or inspect initial HTML to verify primary story text is present.
- **Exit:** All approved public page types are navigable, responsive, and populated only with clearly fictional fixtures.

### Task 1.5 — Build search and discovery interactions

- **Build:** Implement search forms/results, topic filters, sort controls if approved, pagination or load-more interaction, locale selection, and URL-backed query state using a local fixture search adapter. Show useful empty, loading, and error states.
- **Test:** Cover Nepali/English query fixtures, punctuation/diacritics, filters, empty/malformed queries, keyboard submission, URL state, and pagination.
- **Review:** Editor checks labels and result-card usefulness; technical reviewer checks URL behavior, user input handling, and that mock search is replaceable by server search.
- **Verify:** Exercise search with the agreed sample terms on phone and desktop, including refresh/back navigation; document known fixture limitations.
- **Exit:** Discovery UI is usable and its typed contract can be backed by the later search endpoint.

### Task 1.6 — Build newsroom screens as frontend prototypes

- **Build:** Implement responsive sign-in shell, story list/detail/editor forms, review queue, preview, scheduling controls, correction form, media selection/upload UI states, and permission-denied states with fixtures only. Clearly mark that actions are non-persistent prototypes.
- **Test:** Component/browser tests cover form validation, unsaved changes, review/publish state displays, denied/loading/error states, keyboard operation, and narrow screens.
- **Review:** Editor validates workflow screens and terms; technical/security reviewer confirms the UI does not imply frontend-only authorization will be sufficient.
- **Verify:** Walk through draft-to-review-to-preview using prototype controls; refresh and confirm the UI clearly communicates that mock changes are not persisted.
- **Exit:** Newsroom interface and interaction requirements are reviewed before server authorization and persistence are added.

### Task 1.7 — Frontend quality gate and API contract freeze

- **Build:** Complete frontend page states, responsive details, design consistency, fixture coverage, and the interface-to-contract mapping. Record any backend capabilities the UI assumes.
- **Test:** Run frontend unit/component/browser tests, lint, strict typecheck, production build, accessibility scans, and cross-browser checks at the agreed viewport matrix.
- **Review:** Product owner, editor, and technical lead review the complete UI and API contract; triage all findings and approve what is P0.
- **Verify:** Demonstrate reader journeys and newsroom prototype in a browser; verify keyboard access, mobile/tablet/desktop layouts, fictional fixtures, and no real integration calls.
- **Exit:** Frontend P0 is approved and contract frozen. Changes to the contract after this point require explicit impact review.

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

Phase 0 and Task 1.1 are complete. Next is Task 1.2: build the Nepali-first design system and responsive site shell from the wireframe. The application foundation currently serves a development checkpoint page backed by fictional fixtures. Docker is deferred until Task 2.1, when PostgreSQL and Redis services are needed. Every implementation task requires its own test, review, and verification before the next begins.
