# Nep Darpan — Frontend-First Implementation Plan

Version: 3.7
Date: 2026-10-09
Status: Phase 0 and all Phase 1 frontend implementation tasks (1.1–1.50) are complete and technically verified; Task 1.25 was reverted at the owner's request. Economy (1.43), Opinion (1.47), and newsroom/admin (1.50) still need owner visual acceptance, and Task 1.49's guide and the v1.2 frontend/API contract still need owner review/sign-off. Do not begin Phase 2 until the owner approves the UI and contract baseline.

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
| Launch language | Nepali is the default. The frontend offers an English preview of interface labels and clearly fictional fixtures; real English news remains gated on reviewed translations. | Frontend contract recorded; translator/reviewer assignment remains open before an English news edition is enabled. |
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

- **Build:** Added the editorial homepage, latest feed, all navigation category routes, localized article routes, information-hub index, and explainer/guide/fact-check detail pages. Expanded the typed mock gateway with editor-curated lead/latest/trending/section data, metadata, corrections, safe source attribution, related stories, and hub review dates. Core content is server rendered; each public page has a persistent fictional-content notice. The fact-check fixture has no verdict or real claim. Real English news stays unavailable until reviewed translations exist; the later frontend localization task adds a clearly disclosed English preview for interface copy and fictional fixtures.
- **Test:** `npm run check` passed Biome lint and formatting, strict TypeScript, 24 Vitest tests, and Next.js production build. Tests cover fixture visibility, locale availability, categories including opinion/world, published/missing article behavior, correction/source/related fields, and the fact-check no-conclusion state. `npm audit --audit-level=high` found 0 vulnerabilities; `git diff --check` passed.
- **Review:** Reviewed all page templates against the frontend content contract and responsive wireframe hierarchy. Confirmed every navigation category resolves, editorial opinion/fact-check labels are explicit, no sample headline is represented as real reporting, the demo source uses a reserved invalid domain, and the source card external-link sanitizer remains in place. Manual Axe scans on home, category, article, and fact-check pages found 0 WCAG 2.1 A/AA or 2.2 A/AA violations. Visual screenshot review confirmed readable article hierarchy, corrections, sources, and related reporting.
- **Verify:** Microsoft Edge browser runner checked 13 routes at 320, 375, 820, and 1440 px (52 route/viewport combinations): all approved pages returned HTTP 200, had a main landmark and fixture disclosure, and showed no horizontal overflow. Unknown category/article/hub slugs and unsupported `/en/` article returned 404. Browser console had no page errors. Keyboard Tab reached the skip link first. Initial HTTP HTML contains page headings and story content before client JavaScript.
- **Exit:** Approved public page types are navigable, responsive, and populated only with fictional fixtures. Task 1.4 gates passed; await explicit user approval before Task 1.5.

### Task 1.5 — Build search and discovery interactions

- **Build:** Added a server-rendered `/search` page with a GET form, query, locale, category and story-kind filters, relevance/newest sorting, URL-backed pagination, suggested queries, latest-story discovery, and empty/loading/error states. The fixture adapter supports Unicode normalization, punctuation and symbol removal, all-term matching, relevance ranking, and three-item pages. English query terms can match editorial kind labels, but the English locale clearly reports that reviewed English content is not yet available. Search remains behind the replaceable `PublicContentGateway` and calls no external service.
- **Test:** `npm run check` passed lint, format, strict TypeScript, 32 Vitest tests, and production build. Search tests cover Nepali terms with punctuation, normalization, English kind queries, locale/category/type filters, relevance/newest ordering, pagination/clamping, punctuation-only and oversized queries, repeated/invalid URL parameters, and preservation of valid URL filter state. `npm audit --audit-level=high` found 0 vulnerabilities; `git diff --check` passed.
- **Review:** Reviewed labels and result cards for reader clarity, query parameters for bounded length and allowlisted filters, duplicate/malformed parameters for safe fallback, URL encoding and pagination links for state preservation, and gateway isolation for backend replaceability. No English editorial stories are fabricated or silently translated; later UI-preview translations of fictional fixtures remain separate from published story content. Axe scans of the search prompt, results, English-empty, and filtered-empty states found 0 WCAG 2.1 A/AA or 2.2 A/AA violations.
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

### Task 1.8 — Align the reader interface with the supplied wireframe — complete

- **Build:** Compared the wireframe's homepage, category, search, and article variants and applied their shared editorial direction: a clean paper-and-ink palette, a centered masthead, compact navigation, a strong image-led lead story, ruled story lists, and restrained red accents. Added a CSS-drawn landscape for fictional media previews so the frontend makes no image request or claim about a real event. Kept the work within the existing reader pages and fixture contract; did not add deferred live-data modules.
- **Test:** `npm run check` passed Biome lint and format, strict TypeScript, all 49 Vitest tests (including Axe checks), and the Next.js production build. `git diff --check` passed.
- **Review:** Checked the visual changes against the reference's shared components while treating its story text and photographs as design examples, not publishable reporting or media. Confirmed the art remains visibly labeled as fictional, the preview notice remains present, media metadata remains available, and the responsive lead grid has a single bounded mobile column.
- **Verify:** Exercised home, economy category, Nepali search, and article routes at 320, 375, 820, and 1440 px (16 route/viewport combinations). Each rendered its expected heading and fictional-content notice with no horizontal overflow. At phone width, keyboard Tab focused the skip link first and the mobile menu control second. Reviewed phone screenshots of all four routes and phone/tablet/desktop homepage screenshots in a browser.
- **Exit:** The wireframe-alignment task gates passed. Product/editorial owner sign-off is still required before freezing the frontend/API contract or starting Task 2.1.

### Task 1.9 — Match wireframe layouts and reserve owner-provided media and branding — complete

- **Build:** Reviewed all eight supplied mobile and desktop screens for the home, economy category, search, and article pages. Reworked the shared header to a left-aligned brand lockup with a reserved logo box, matched the image-first lead cards and rounded story panels, made search filters expandable, and added a home reel placement. Every story card and article now has a labeled media slot; fixture media URLs are not loaded. Removed generated landscape art and sample photo captions. Added a neutral empty favicon placeholder for the owner-provided brand asset. No live market data, newsletter signup, database, cache, authentication, or publishing integration was added.
- **Test:** `npm run format`, `npm run check`, and `git diff --check` passed. The check includes Biome lint/format, strict TypeScript, all 49 Vitest tests across 10 files, and the Next.js production build.
- **Review:** Compared the component hierarchy, responsive behavior, card treatment, typography, and media placement with the supplied screenshots. Treated sample headlines, data, and media as visual references only. Confirmed the app renders no image or video elements from fixture URLs; the logo, favicon, photo, and reel areas are labeled placeholders for owner assets.
- **Verify:** Loaded home, economy category, Nepali search results, and article pages in Edge at 320, 375, 820, and 1440 px (16 route/viewport combinations). All returned HTTP 200, showed the fictional-content notice, and had no horizontal overflow, console errors, or failed requests. Captured and reviewed phone and desktop screenshots of all four pages.
- **Exit:** The wireframe fidelity pass is ready for owner review. Frontend/API contract sign-off remains pending, so Task 2.1 must not begin until the user approves the UI and contract baseline.

### Task 1.10 — Add the utility strip and working language/theme controls — complete

- **Build:** Matched the wireframe's compact date and Kathmandu strip with a language control and moon/sun theme button. Added reversible Nepali/English interface labels, a dark palette, and browser-local preference persistence. The date is formatted for Kathmandu; no temperature is shown because an approved live-weather source is still deferred. English mode identifies the interface and fixture translations as preview copy, not verified news.
- **Test:** `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test` (51 tests across 11 files), and `npm run build` passed. `git diff --check` passed.
- **Review:** Checked accessible button names and pressed states, keyboard-operable native buttons, dark-mode token contrast, saved preferences, and the disclosure that translated fixture copy is only a preview. No weather provider or backend service was introduced. English interface copy remains subject to owner review before an English edition is treated as approved.
- **Verify:** Microsoft Edge confirmed the Nepal-localized date, Kathmandu label, Nepali/English switching, light/dark switching, preference persistence after navigation and reload, no browser errors, and no horizontal overflow at 320, 375, 820, and 1440 px. Captured and reviewed the 1440 px header screenshot.
- **Exit:** The utility strip and preference controls pass their implementation gates. Frontend/API contract sign-off remains pending; await the user's review before starting another task.

### Task 1.11 — Localize the complete frontend in Nepali and English — complete

- **Build:** Extended the language control across shared navigation, reader pages, search filters and states, information pages, newsroom screens and forms, accessibility labels, document titles, fictional fixture headlines and article copy, and date/number formatting. Nepali remains the default. English fixture translations are disclosed as preview copy, not verified or editor-approved news; text entered by a newsroom user stays as entered. Made Nepali date/time formatting deterministic across server and browser rendering and changed pagination props to serializable URLs so category pages render without crossing a client boundary with callbacks.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, 53 Vitest tests, and the production build. `git diff --check` passed.
- **Review:** Reviewed interface labels, hidden descriptions, control names, page titles, fixture copy, and search language options in both languages. Confirmed untranslated user-entered text is preserved, English sample copy is not presented as verified reporting, and no backend service was added.
- **Verify:** Switched Nepali → English → Nepali on the running site and confirmed the selection survives navigation and reload; keyboard Enter activates the language control in both directions. Audited public reader/information and newsroom route families in both languages, including expanded search filters and navigation; found no untranslated interface copy after fixes. Checked the responsive homepage at 320×800, 820×1000, and 1440×1000, confirmed the Kathmandu date changes locale and digits, and verified a fresh reload adds no hydration error. Fixed a category-page Server/Client Component error found during route review.
- **Exit:** Site-wide frontend localization gates passed. Frontend/API contract sign-off remains pending; wait for the user's review before starting the next task.

### Task 1.12 — Match the monochrome palette and build the homepage reels carousel — complete

- **Build:** Replaced the red urgency accents and blue focus color with the wireframe's paper, ink, and gray tokens in light and dark themes. Added a typed `ReelCard` collection of six clearly fictional previews and a responsive, horizontally scrollable reels carousel with portrait media placeholders, localized labels, story links, scroll-snap, and labeled previous/next controls. No fixture media is fetched or presented as playable.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, 55 Vitest tests across 12 files, and the production build. The carousel test covers placeholder disclosure, language switching, scroll controls, and an Axe scan. `git diff --check` passed.
- **Review:** Compared the colors and carousel structure with the supplied monochrome homepage design. Confirmed no red or blue accent tokens remain in application styles, status text still has structural framing, controls have accessible labels, and reduced-motion preference selects non-smooth scrolling. Updated the candidate frontend contract with `ReelCard` and the homepage reels field.
- **Verify:** Inspected the running home page at 320×800, 820×1000, and 1440×1000; the page has no horizontal overflow, six cards render, and the horizontal track overflows as intended. Mouse and Enter-key controls scroll the carousel. Verified the light and dark theme tokens remain neutral and the browser console reports no errors.
- **Exit:** The palette and reels carousel pass their gates. Frontend/API contract sign-off remains pending; wait for the user's review before starting Task 2.1.

### Task 1.13 — Add the localized header notification preview — complete

- **Build:** Added a monochrome bell control beside search in the responsive header. The native disclosure panel localizes its title and preview-only explanation in Nepali and English; it does not show a fabricated unread marker or count, and it is not connected to a notification service.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, 56 Vitest tests across 12 files, and the production build. The shell tests cover opening the panel, both languages, and an Axe scan. `git diff --check` passed.
- **Review:** Confirmed the bell matches the wireframe's ink-and-paper controls, has a localized accessible name, works as a native keyboard disclosure, and makes no claim that live notifications or persistent delivery are implemented.
- **Verify:** In the running site, opened the panel and inspected its Nepali copy; switched to English and back and confirmed the complete interface changed languages. Space closed the panel from the focused bell. The 699 px browser view showed the panel aligned to the bell without clipping.
- **Exit:** The notification preview passes its gates. Frontend/API contract sign-off remains pending; wait for the user's review before starting Task 2.1.

### Task 1.14 — Add sourced stock media to the fictional design preview — complete

- **Build:** Added locally served Pexels, Pixabay, and Coverr images to selected fictional story fixtures and three vertical stock videos to the reels carousel. Photos and videos have localized alternative text/captions, visible credits, source records in [the stock media register](assets/STOCK_MEDIA.md), and clear disclosures that they are illustrative only. Reel videos use native controls, muted playback, local posters, and `preload="none"`; no provider API or backend storage is connected.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, the complete Vitest suite, and the production build. Media tests cover rendered image descriptions, visible rights/source disclosures, native video controls, on-demand loading, credits, and Nepali/English copy. `git diff --check` passed.
- **Review:** Checked Pexels, Pixabay, and Coverr license terms and the selected asset pages. Confirmed fixture story copy remains explicitly fictional, the stock captions do not claim to depict the sample events, credits are visible, and no stock item is described as verified reporting. The new public contract fields are limited to bilingual media copy and optional reel video media.
- **Verify:** In the running Next.js app at a 699 px browser viewport, visually checked the loaded story photos and all three reel posters, then started and paused each local clip with its native controls. Switched to English and confirmed the interface, image descriptions, stock disclosures, and reel copy localize; restored Nepali afterward. The carousel's horizontal-scroll control is covered by its component test. Port 3000 returned a different page, so the verified app is open at `http://localhost:3003/`.
- **Exit:** The media preview passes its gates. Frontend/API contract sign-off remains pending; wait for the user's review before starting Task 2.1.

### Task 1.15 — Expand the homepage reels carousel — complete

- **Build:** Added two Pexels vertical stock clips for a total of five playable reel previews. Added bilingual fictional sample headlines, localized media descriptions, visible creator credits, local poster images, and entries in [the stock media register](assets/STOCK_MEDIA.md). Each clip is disclosed as stock footage that does not depict its linked fictional story; playback remains on demand.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, 57 Vitest tests across 12 files, and the Next.js production build. The mock-gateway test verifies the five-reel count, new credits, fictional headlines, and stock-footage disclosure. `git diff --check` passed.
- **Review:** Checked the two Pexels asset pages and the Pexels license. Confirmed both source clips are portrait 2160 × 3840, 10-second videos; the cards keep the existing monochrome reel design and localized fictional-content labels. No backend, external media API, or Cloudinary integration was added.
- **Verify:** Reviewed the five-card carousel in the running app at `http://localhost:3003/` and started then paused the new traffic-lights clip using its native controls. Confirmed the two new posters, credits, and fictional disclosures are visible. The separate taxi-meter preview is included in the carousel and locally served with `preload="none"`.
- **Exit:** The expanded carousel passes its gates. Frontend/API contract sign-off remains pending; wait for the user's review before starting Task 2.1.

### Task 1.16 — Refine the homepage breaking-news hero — complete

- **Build:** Added a compact breaking-news preview above the lead story, with two linked fictional sample headlines, a clear “not live” notice, and a distinct monochrome treatment. Reduced the lead image height on phone and desktop while keeping the headline and editorial summary prominent; the desktop hero uses a balanced two-column layout.
- **Test:** `npm run check` passed lint, format, strict TypeScript, 57 tests across 12 files, and the production build. Added coverage for the breaking-story fixtures and home-hero variant. `git diff --check` passed.
- **Review:** Adapted the lead/breaking/latest hierarchy seen on [Onlinekhabar](https://www.onlinekhabar.com/), [The Kathmandu Post](https://kathmandupost.com/), and [Al Jazeera](https://www.aljazeera.com/) to Nep Darpan's paper-and-ink palette. Confirmed both breaking examples remain labeled fictional and no live-news claim or provider was added.
- **Verify:** Inspected the running app at `http://localhost:3003/` at a 390px phone viewport and the default desktop viewport. The breaking preview appears above the lead at phone size; the lead image is bounded below the headline and summary on phone, and beside the story copy on desktop.
- **Exit:** The breaking-news hero passes its gates. Frontend/API contract sign-off remains pending; wait for the user's review before starting Task 2.1.

### Task 1.17 — Remove the redundant home lead news badge — complete

- **Build:** Removed the generic “समाचार” content-type badge from the homepage lead story while keeping its clickable “समाज” category. Other editorial labels and story-card type labels remain available.
- **Test:** `npm run check` passed lint, format, strict TypeScript, 57 tests across 12 files, and the production build. The lead-story component test verifies that the home hero retains its category and omits the redundant type badge.
- **Review:** Confirmed the change is limited to the home lead-story variant; category navigation remains and other story cards still display their type labels.
- **Verify:** Checked the running app at `http://localhost:3003/` at the default 699 × 700 browser viewport. The hero displays only the “समाज” category above its headline.
- **Exit:** The home lead badge cleanup passes its gates. Frontend/API contract sign-off remains pending; wait for the user's review before starting Task 2.1.

### Task 1.18 — Rebuild the homepage editorial hero — complete

- **Build:** Reworked the homepage top into one featured breaking-news preview, the main lead story, and a two-story latest-headlines rail. The lead and rail sit side by side on wide screens and stack on smaller screens. Breaking content remains visibly marked as a fictional preview with live updates disconnected; the main hero image stays bounded.
- **Test:** `npm run check` passed lint, format, strict TypeScript, 58 tests across 12 files, and the production build. Added HomepageHero coverage for featured and supporting story selection, deduplication, link destinations, the non-live notice, and Axe accessibility.
- **Review:** Adapted the breaking lead and live-update context on [Al Jazeera](https://www.aljazeera.com/), the live lead, timestamps, and related coverage on [The Guardian](https://www.theguardian.com/international), and the quick-scan top-story grouping on [AP News](https://apnews.com/) to Nep Darpan's monochrome palette and fixture-only stage.
- **Verify:** Inspected the running app at `http://localhost:3003/` at 320px, 390px, 768px, 1024px, and 1440px viewport widths. Confirmed the breaking preview is easy to locate, the hero image remains controlled, the latest rail stacks on phones and shifts beside the lead on desktop, and the story links are present.
- **Exit:** The homepage editorial hero passes its gates. Frontend/API contract sign-off remains pending; wait for the user's review before starting Task 2.1.

### Task 1.19 — Finalize the static breaking-news treatment — complete

- **Build:** Set a fictional municipal-services proposal as the single featured breaking headline, paired with the homepage lead and latest-headlines rail. The high-contrast black-and-white strip identifies the headline as a static fictional sample and states that no live news feed is connected. The notice and label are localized in both English and Nepali.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, 58 tests across 12 files, and the production build. Homepage hero coverage verifies the static notice, non-duplicated headline rail, accessible links, and English/Nepali switching; `git diff --check` passed.
- **Review:** Reviewed the top-story, breaking, timestamp, and related-coverage patterns on [Al Jazeera](https://www.aljazeera.com/), [The Guardian](https://www.theguardian.com/international), and [AP News](https://apnews.com/). Kept their clear editorial hierarchy while preserving Nep Darpan's monochrome wireframe palette and an explicit fictional-content disclosure.
- **Verify:** Inspected the running `http://localhost:3003/` homepage in wide desktop and compact browser views. Confirmed the breaking strip appears above the lead, the lead image remains bounded, the latest rail sits alongside on wide screens and below on compact screens, and English/Nepali switching translates the complete visible hero.
- **Exit:** The static breaking-news treatment passes its gates. No live news provider or live updates were added. Frontend/API contract sign-off remains pending; wait for the user's review before starting Task 2.1.

### Task 1.20 — Rebuild the homepage hero as a lead card with flanking stories — complete

- **Build:** Replaced the lead-and-rail hero with an image-first central lead card and four smaller image cards split into left and right columns. Each card places its headline and summary beneath the image. Kept the static, fictional breaking-news strip above the composition and added illustrative stock media to the fictional opinion fixture so all four side cards have an image.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, 58 tests across 12 files, and the production build. Homepage tests verify the main lead, both side columns, all four card slots, unique links, the static breaking story, and English/Nepali switching. `git diff --check` passed.
- **Review:** Confirmed the image-first visual order, headlines and summaries under the images, meaningful photo captions/credits, accessible side-column labels, distinct fictional sample notices, and no live-feed claim. Kept the existing monochrome palette.
- **Verify:** Inspected the running page at 320px, 390px, 768px, 1024px, and a wide desktop viewport. The wide layout places the large lead between the two smaller-card columns; tablet and phone layouts move the lead above the supporting cards without horizontal overflow.
- **Exit:** The revised hero passes its gates. The frontend/API contract remains pending owner approval; wait for the user's review before starting another task.

### Task 1.21 — Remove the homepage breaking-news strip — complete

- **Build:** Removed the black breaking-news banner above the hero and its dedicated styling. The homepage hero receives the lead and latest stories only; the centered lead and four flanking image cards remain. Breaking-news fixture data stays in the typed content contract for a future approved editorial treatment.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, the full test suite, and the production build. Hero coverage verifies that no breaking strip renders while the lead, both side columns, four card slots, unique links, and English/Nepali controls remain. `git diff --check` passed.
- **Review:** Confirmed the selected black banner and its static/live-feed notice are absent, while the fictional-content notice elsewhere on the page remains. No fixture is represented as verified news and no live feed was added.
- **Verify:** Inspected the running homepage after the change; confirmed the image-led lead and flanking cards remain responsive with no banner occupying space above them.
- **Exit:** The requested banner removal passes its gates. The frontend/API contract remains pending owner approval; wait for the user's review before starting another task.

### Task 1.22 — Place the lead story left and supporting cards right — complete

- **Build:** Reorganized the wide-screen homepage hero into a large image-led lead card on the left and a four-story supporting-card rail on the right. Supporting cards use a two-column grid in the rail, and the lead and rail stretch to share top and bottom edges. Tablet and phone layouts place the lead above the supporting cards.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, the full test suite, and the production build. Hero coverage verifies the lead precedes one right-hand list of four supporting stories, the strip remains absent, and English/Nepali controls still work. `git diff --check` passed.
- **Review:** Confirmed the lead retains image, headline, summary, and metadata; supporting stories remain distinct, linked, and labeled as fictional fixtures. The layout uses the existing monochrome design tokens.
- **Verify:** Inspected the running homepage at phone (390px), tablet (768px), and desktop (1536px) widths. Confirmed the lead and right rail share top and bottom edges on desktop; phone and tablet layouts stack the lead above the supporting cards without horizontal overflow.
- **Exit:** The requested hero arrangement passes its gates. The frontend/API contract remains pending owner approval; wait for the user's review before starting another task.

### Task 1.23 — Align the right-rail heading with the lead badge — complete

- **Build:** Added top spacing to the right-rail heading on wide screens so its text aligns vertically with the featured badge on the lead image. The responsive tablet and phone layout remains unchanged.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, 58 tests across 12 files, and the production build. The Nepali date assertion now compares against the application's formatter so weekday spelling remains consistent. `git diff --check` passed.
- **Review:** Compared the title and featured badge positions against the supplied screenshot; retained the two-column hero and its aligned outer edges.
- **Verify:** Confirmed the running homepage returns HTTP 200 and the served stylesheet contains the 1rem heading offset in the wide-screen media query; narrow-screen styles remain unchanged. The browser screenshot tool was unavailable, so visual confirmation is pending the owner's review.
- **Exit:** The requested title alignment passes its gates. The frontend/API contract remains pending owner approval; wait for the user's review before starting another task.

### Task 1.24 — Correct lead badge and right-rail heading alignment — complete

- **Build:** Replaced the approximate 1rem right-heading offset with the sum of the lead badge's top inset and inner top padding (`0.75rem + 0.28rem`). Set an explicit shared line-height for the badge and rail heading so browser defaults do not create different vertical text boxes. The adjustment applies only to the wide two-column hero; stacked tablet and phone layouts remain unchanged.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, the complete test suite, and the production build. `git diff --check` passed.
- **Review:** Checked the CSS geometry against both elements: the rail heading's text box now begins at the same inset as the badge's inner text box. The existing card list and outer hero sizing are not repositioned by this refinement.
- **Verify:** Confirmed the change is limited to the wide-screen media query and explicit label line heights. The in-app browser capture tool failed to initialize, so I could not capture a fresh visual screenshot; browser visual confirmation remains pending owner review.
- **Exit:** The alignment rule is corrected and project checks pass. The frontend/API contract remains pending owner approval; wait for the user's review before starting another task.

### Task 1.25 — Build the compact editorial homepage hero — reverted at owner request

- **Build:** Reverted the compact breaking-strip, text-first rail, secondary row, and four extra fixtures. The homepage returns to the Task 1.24 composition: bounded lead on the left, four image-led story cards on the right, with the right heading aligned to the lead badge.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all 58 tests, and the production build. Hero coverage checks the lead, four image cards, language labels, unique selections, and the absence of the removed sections. `git diff --check` passed.
- **Review:** Confirmed the breaking strip and secondary row are absent, the four card fixtures remain clearly fictional, the paper-and-ink palette is intact, and the lead image remains bounded and responsive.
- **Verify:** The running homepage returned HTTP 200. Server-rendered HTML contains the lead H1, “ताजा समाचार” heading, four supporting cards, and the fictional-content disclosure; it contains no breaking strip or secondary row. A fresh visual browser capture was unavailable, so viewport appearance remains for owner review.
- **Exit:** Current homepage hero is restored to the Task 1.24 design. Await owner review before another task.

### Task 1.26 — Center the lead story between left and right story rails — implementation and checks complete; owner visual review pending

- **Build:** Placed the lead story in the center of a three-column homepage hero. Two image-led supporting stories sit on each side, with concise metadata, headline, and summary. At tablet widths, the lead spans above the two supporting columns; phones show the lead first and stack the supporting groups. The existing compact image caps and fictional-content disclosures remain.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all 58 tests, and the production build. Hero coverage checks the centered lead's structure, two distinct stories per side, media, language labels, deduplication, and absence of the removed banner and secondary row. `git diff --check` passed.
- **Review:** Checked main-story hierarchy, responsive grid regions, balanced supporting content, accessible story links, label localization, and the existing monochrome palette. No live feed or non-fictional stories were added.
- **Verify:** The local homepage returned HTTP 200. Server-rendered HTML contains the lead H1 and exactly two story cards in each side rail; the served CSS includes the desktop left-center-right grid rule. The browser capture runtime failed to initialize, so screenshot review remains for the owner.
- **Exit:** Implementation and automated checks are complete. Await owner review before starting another task.

### Task 1.27 — Add the provided logo to the shared brand lockup — implementation and checks complete; owner visual review pending

- **Build:** Replaced the header and footer logo placeholders with the supplied `/logo.jpg` asset. CSS crops its centered mark inside the existing responsive brand slot and inverts it in dark mode. The wordmark remains as selectable, localized text.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all 58 tests, and the production build. The shared-shell test checks that the header brand loads the supplied logo; `git diff --check` passed.
- **Review:** Confirmed both header and footer use the same local image and the accessible home link retains its localized name. The image remains decorative to assistive technology because the link already has a localized accessible name.
- **Verify:** Verify the homepage and `/logo.jpg` return HTTP 200, both brand locations reference the provided asset, and the served stylesheet includes responsive sizing and dark-mode treatment. The browser capture runtime failed to initialize, so screenshot review remains for the owner.
- **Exit:** The supplied logo is wired into the shared header and footer. Await owner review before starting another task.

### Task 1.28 — Remove redundant story-kind badges — implementation and checks complete; owner visual review pending

- **Build:** Removed the generic “समाचार” badge from general news cards and hid the duplicate “विचार” badge when the story already has the Opinion category. Kept useful distinctions such as breaking, analysis, fact-check, guide, and explainer labels.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all 59 tests, and the production build. Added coverage for general-news label removal, duplicate opinion/category suppression, and retaining analysis and breaking labels. `git diff --check` passed.
- **Review:** Confirmed category links remain visible and editorial labels continue to show information not conveyed by a category. Empty editorial-label lists are omitted.
- **Verify:** Confirm the homepage returns HTTP 200, has no generic news or duplicate opinion badges, and continues to show meaningful editorial labels where applicable. Browser visual review remains with the owner.
- **Exit:** Redundant tags are removed from story cards. Await owner review before starting another task.

### Task 1.29 — Remove editorial chips from public story cards — implementation and checks complete; owner visual review pending

- **Build:** Removed editorial-kind and editorial-label chips, including “विश्लेषण” and “ब्रेकिङ”, from lead and supporting public story cards. Category pills, headlines, summaries, author bylines, publication times, and correction notices remain. Editorial distinctions remain in the article detail view and newsroom prototype.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all automated tests, and the production build. Component coverage checks that labeled story and lead cards omit every editorial chip while keeping the category link. `git diff --check` passed.
- **Review:** Confirmed the change is presentation-only: fixture labels/contracts remain available for article detail and future backend behavior; newsroom workflow status styling remains separate.
- **Verify:** Confirm the homepage returns HTTP 200, story cards retain their category pills and story content, and no card renders an editorial label list or breaking chip. Browser visual review remains with the owner.
- **Exit:** Public story cards show category pills without editorial chip rows. Await owner review before starting another task.

### Task 1.30 — Slightly widen the homepage reels cards — implementation and checks complete; owner visual review pending

- **Build:** Increased the responsive reels-card width range slightly, from `clamp(9rem, 18vw, 13.5rem)` to `clamp(9.5rem, 19vw, 14.5rem)`. The horizontal scroll and snap behavior remain in place.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all automated tests, and the production build. `git diff --check` passed.
- **Review:** Confirmed the increase remains capped at the container's horizontal scroll area and preserves the portrait reel aspect ratio and carousel controls.
- **Verify:** Confirm the homepage returns HTTP 200 and its served stylesheet contains the updated responsive card width. Owner visual review remains pending.
- **Exit:** Homepage reel cards are slightly wider across responsive sizes. Await owner review before starting another task.

### Task 1.31 — Further widen and slightly shorten the homepage reels cards — implementation and checks complete; owner visual review pending

- **Build:** Increased the responsive card width to `clamp(10.5rem, 20vw, 15.5rem)` and changed the portrait poster ratio from `9 / 14` to `2 / 3`, making the video panels slightly shorter. Horizontal scrolling and snap behavior remain.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all automated tests, and the production build. `git diff --check` passed.
- **Review:** Confirmed the wider cards remain contained in the horizontal scrolling track and the shorter poster retains a portrait format; carousel controls and video cropping are unchanged.
- **Verify:** Confirm the homepage returns HTTP 200 and the served stylesheet contains the new width and poster ratio. Owner visual review remains pending.
- **Exit:** Reels cards are wider and their video panels slightly shorter at responsive sizes. Await owner review before starting another task.

### Task 1.32 — Fill homepage category sections with more stories — implementation and checks complete; owner visual review pending

- **Build:** Added one clearly fictional sample story to each of the six homepage category sections, producing a balanced two-card grid on desktop and a one-column stack on narrow screens. Added the fixtures to category pages, search, and article-detail lookup so each card remains browsable.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all automated tests, and the production build. Gateway coverage confirms each section has two unique stories in the correct category and supplemental fixtures can open as articles. `git diff --check` passed.
- **Review:** Checked that all added headlines and summaries remain explicitly fictional, categories do not show stories from another category, and each story uses existing attributed stock media.
- **Verify:** Confirm the homepage returns HTTP 200, every category section renders two stories, and supplemental article and category routes return HTTP 200. Owner visual review remains pending.
- **Exit:** Homepage category rows use the available desktop width with a consistent two-card grid and retain responsive stacking on phones. Await owner review before starting another task.

### Task 1.33 — Add a sponsored-placement preview below the homepage hero — implementation and checks complete; owner visual review pending

- **Build:** Added a centered, clearly labeled advertisement slot directly below the hero, following the supplied dark-panel reference. Its heading and supporting copy follow the site's Nepali/English language toggle; it is a static design preview, not a live advertisement integration.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all automated tests, and the production build. Added coverage for both language states and an Axe accessibility scan. `git diff --check` passed.
- **Review:** Checked contrast, responsive wrapping, landmark naming, and that the placement is disclosed as sponsored content without presenting a live advertiser or external ad provider.
- **Verify:** Confirm the homepage returns HTTP 200 and the advertisement slot appears after the hero and before latest updates. Owner visual review remains pending.
- **Exit:** The reference-style static advertising placement appears below the hero and localizes with the site language. Await owner review before starting another task.

### Task 1.34 — Rotate dummy advertisements in a left-to-right loop — implementation and checks complete; owner visual review pending

- **Build:** Added two fictional sample advertisements that slide left to right in a repeating carousel. Added a pause/resume control and pauses the rotation when the reader prefers reduced motion.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all automated tests, and the production build. Component coverage verifies both ad slides, wraparound, pause/resume, localization, and Axe accessibility. `git diff --check` passed.
- **Review:** Confirmed only the active ad is exposed to assistive technology, the duplicate content is not announced, transitions respect reduced-motion preferences, and no advertising provider or live campaign is connected.
- **Verify:** Confirm the homepage returns HTTP 200, the carousel advances and loops, the pause control stops/resumes it, and the language toggle localizes both sample ads. Owner visual review remains pending.
- **Exit:** Dummy ads slide left to right and repeat until paused. Await owner review before starting another task.

### Task 1.35 — Add photos and a working destination to dummy advertisements — implementation and checks complete; owner visual review pending

- **Build:** Added two local stock-preview photos to the fictional sponsored slides, with localized descriptive alt text and visible creator credits. Added a localized call-to-action linking to the contact page on each ad. The carousel still loops left to right and retains its pause/resume control. The photo and copy reflow into a single column on narrow screens.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all 60 Vitest tests, and the production build. Advertisement coverage checks both languages, photo alt/credit, contact destinations, slide rotation, pause/resume, and accessibility. `git diff --check` passed (Git emitted existing LF-to-CRLF working-copy notices).
- **Review:** Confirmed both items remain disclosed as sample sponsored placements, image provenance is visible, and the link stays within the site. No advertiser, live campaign, or ad provider is represented as real.
- **Verify:** On the running site, `/` and `/contact` returned HTTP 200. Both source images and both Next.js optimized image responses returned HTTP 200. Headless Chrome screenshots at desktop 1440px and phone 390px widths show the responsive ad layout and working contact CTA. The loaded stylesheet contains the narrow-screen stacked layout rule.
- **Exit:** The two fictional ad slides show credited photos and link to contact in both languages. Await owner review before starting another task.

### Task 1.36 — Match the homepage hero to the lead-and-headlines reference — implementation and checks complete; owner visual review pending

- **Build:** Reworked the hero into one large lead story on the left and a single right-side panel with three important headlines, image thumbnails, categories, and publication times. The hero uses Nep Darpan's existing ink-and-paper palette without red accents. At narrow widths, the lead and compact headline list stack vertically. Added a full-story link to the lead and a neutral initials mark because no author portrait is supplied. Removed the correction callout from the homepage lead card at the owner's request; article pages retain correction notices.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all 60 Vitest tests, and the production build. Homepage hero tests cover the three-story panel, image alternatives, navigation, language changes, correction-callout omission, and Axe accessibility.
- **Review:** Confirmed the lead remains the page's only level-one headline, side stories are capped at three and are not duplicated in the latest feed, and sample content remains disclosed as fictional. Confirmed correction notices remain on non-home lead/article views.
- **Verify:** The running homepage returned HTTP 200. Headless Chrome renders at desktop 1440px and phone 390px widths show the desktop lead-plus-sidebar composition and narrow-screen stacked layout. Owner visual review remains pending.
- **Exit:** The hero follows the supplied composition in the current palette and removes the selected correction callout. Await owner review before starting another task.

### Task 1.37 — Refine homepage reels and responsive story-card media — implementation and checks complete; owner visual review pending

- **Build:** Redesigned the reels strip with wider portrait cards, a clearer section heading, category and duration overlays, readable headlines, visible fictional/stock disclosures, and credits. Removed an extra nested width wrapper so the strip aligns with its parent content. Story-card images now use a consistent 8:5 crop positioned at the top; on narrow phones, compact story cards place the image above the text, while wider layouts retain the image at the top-right.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all 61 Vitest tests, and the production build. Component tests cover reel controls, localization, disclosures, duration display, attribution, and the story-card image frame. `git diff --check` passed.
- **Review:** Confirmed the ink-and-paper palette, visible fictional-content labels and stock-media credits, keyboard-operable carousel controls, and responsive story hierarchy. No automatic video playback was added.
- **Verify:** The running homepage returned HTTP 200. Headless Edge review at 390px, 820px, and 1440px showed `documentElement.scrollWidth === clientWidth` at each size. Visual review confirmed phone cards place images above story copy and larger cards align images at the top-right; reel cards remain horizontally scrollable.
- **Exit:** Reels and story-card media fit the responsive editorial layout. Await owner review before starting another task.

### Task 1.38 — Stack story-card media and copy in one column — implementation and checks complete; owner visual review pending

- **Build:** Updated compact story cards so the image and its caption span the card above the category, headline, summary, and metadata at every viewport width. Standard story cards use the same single-column hierarchy. The outer page may still place multiple independent cards side by side when space allows.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all 62 Vitest tests, and the production build. Component coverage verifies story media precedes its copy.
- **Review:** Confirmed the photo is no longer a separate side column inside a story card, the image remains cropped in its responsive media frame, captions and credits remain visible, and sample content disclosures are unchanged.
- **Verify:** The running homepage and `/latest` returned HTTP 200. Headless Edge checks at 390px, 820px, and 1440px confirmed compact and standard cards each render as one CSS grid column with media above copy and no horizontal overflow. Desktop visual review confirms the new stacked card layout.
- **Exit:** Story-card media and copy remain in one column on phone, tablet, and desktop. Await owner review before starting another task.

### Task 1.39 — Expand the homepage editor's picks panel — implementation and checks complete; owner visual review pending

- **Build:** Expanded the “Trending / चर्चामा” panel from two items to five by selecting additional existing fictional homepage stories. Kept the numbered editorial list, category labels, and fictional-sample disclosure for every item.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all 62 Vitest tests, and the production build. Mock gateway coverage verifies five unique trending items, each with a sample-labeled headline.
- **Review:** Confirmed all added links resolve to existing demo articles, story headlines remain explicitly fictional, categories are shown, and the panel uses the existing responsive layout without introducing new providers or live data.
- **Verify:** The running homepage returned HTTP 200. Browser review at phone and desktop widths confirms the panel shows five numbered picks and uses the previously empty vertical space.
- **Exit:** The homepage editor's picks panel shows five disclosed sample stories. Await owner review before starting another task.

### Task 1.40 — Align the editor-picks divider with the adjacent story cards — implementation and checks complete; owner visual review pending

- **Build:** Reduced vertical padding between the five editor picks so the panel's left divider no longer extends as far below the adjacent latest-story cards. Preserved the numbered headlines, category labels, and fictional-sample disclosures.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all 62 Vitest tests, and the production build.
- **Review:** Confirmed only the editor-picks list spacing changed; story text, five-item count, links, labels, and mobile stacking remain intact.
- **Verify:** At 1440px, browser measurements confirm the divider bottom and latest-story card row end at the same pixel. Phone (390px), tablet (820px), and desktop (1440px) layouts remain free of horizontal overflow.
- **Exit:** The divider and neighboring story cards finish at approximately the same level. Await owner review before starting another task.

### Task 1.41 — Build a complete responsive latest-news page — owner-approved

- **Build:** Replace the basic `/latest` list with a Nepali-first editorial feed using the public content contract and fictional fixtures. Merge and de-duplicate homepage and category stories; add keyword search, section filters, newest/oldest sorting, URL-backed pagination, an image-led featured sample, timestamped headline rows, editor picks, category counts, and an information-hub link.
- **Test:** `npm run check` passed lint, formatting, TypeScript, all 67 Vitest tests, and the production build. Focused feed tests cover de-duplication, Nepali and English query matching, category filters, chronological order, pagination, and malformed/repeated parameters.
- **Review:** Confirmed the page uses existing typed public data and stock-preview media, labels story fixtures as fictional, and adds no live-news claims, backend services, or persistent publishing behavior. Search and select controls have explicit accessible labels; the layout stacks at mobile widths.
- **Verify:** The production build generated `/latest`, and the development server started on `http://localhost:3003/`. The in-app browser declined local navigation under its URL security policy, so phone/tablet/desktop visual measurements remain for owner review.
- **Exit:** Latest-feed interactions are implemented and automated checks pass. The owner approved moving on to the Politics page.

### Task 1.42 — Build a complete responsive Politics page — owner-approved

- **Build:** Extend the fictional preview fixtures and add a Nepali-first `/category/politics` page using the public content contract. Include a lead policy explainer, timestamped non-live briefing, chronological story feed, keyword search, format filters for news, analysis, opinion, explainers, fact checks, and guides, newest/oldest sorting, URL-backed pagination, editor-selected reading, civic context links, editorial-standards link, and responsive layouts. Keep the international reference's separation of live updates, analysis, and opinion while using the chronological stories, timestamps, and local-topic orientation common to Nepali news portals.
- **Test:** `npm run check` passes lint, formatting, TypeScript, all 70 Vitest tests, and the production build. Focused feed tests cover Nepali/English search, content-type filters, ordering, pagination, and malformed/repeated parameters; fixture tests confirm explicit fictional labels and unique stories.
- **Review:** Confirm all politics sample headlines are labeled fictional, reused stock images are disclosed as illustrative, editor picks are not presented as popularity data, and no real claims, breaking/live feed, external provider, persistence, or backend service was introduced. Controls have accessible labels and localized Nepali/English text.
- **Verify:** The production build registers the dynamic category route and the existing development server remains listening on port 3003. Browser navigation to localhost is blocked by the in-app browser's URL security policy; viewport measurements remain for owner review.
- **Exit:** Politics page interactions and responsive styling are implemented and automated checks pass. Await owner review before starting another task.

**Design references reviewed for Task 1.42:** [The Guardian Politics](https://www.theguardian.com/politics), [eKantipur Politics](https://ekantipur.com/politics), and [The Kathmandu Post](https://kathmandupost.com/).

### Task 1.43 — Build a complete responsive Economy page — implementation, checks, and cross-device review complete; owner visual acceptance pending

- **Build:** Add a Nepali-first `/category/economy` experience with a featured fictional business/economy story, a timestamped fictional briefing, topic/category navigation, accessible search, story-kind filters, newest/oldest ordering, URL-backed pagination, selected reading, and economy explainers in the information hub. Add eight clearly fictional economy story fixtures and two contextual hub entries. Show NEPSE, exchange rates, precious metals, and price indicators as unavailable placeholders with no fabricated values, approved-source attribution, or financial recommendations.
- **Test:** `npm run check` passed lint, format, strict TypeScript, all 75 Vitest tests, and the production build. Economy coverage includes Nepali/English query matching, story-kind filters, sort order, pagination, malformed/repeated parameters, fictional fixture disclosures, unavailable market-data copy, English switching, and an Axe accessibility scan.
- **Review:** Adapt category structure and economic coverage themes from Nepali business desks and international economy analysis while retaining Nep Darpan's paper-and-ink system. Confirm all added copy is disclosed as fictional, stock media captions state they are illustrative, live market values stay absent, and no provider, backend, or persistence is introduced.
- **Verify:** Reviewed `/category/economy` at phone, tablet, and desktop widths in the running app; the layout reflows without page-level horizontal overflow. The final repository check passed 104 tests and the production build.
- **Exit:** Economy page implementation, automated checks, and agent visual review are complete. Await owner visual acceptance before closing the UI review gate.

**Design references reviewed for Task 1.43:** [eKantipur Business](https://ekantipur.com/business), [The Kathmandu Post Money](https://kathmandupost.com/money), and [The Guardian Economics](https://www.theguardian.com/business/series/economicsmonday%2Bbusiness).

### Task 1.44 — Build a complete responsive Society page — owner-approved

- **Build:** Add a Nepali-first `/category/society` experience for people-first reporting themes such as education, health access, inclusion, public information, and community life. Include a featured story, clearly non-live timestamped briefing, topic shortcuts, accessible search, story-kind filters, newest/oldest ordering, URL-backed pagination, selected reading, and context links in the information hub. Add eight clearly fictional Society story fixtures and two fictional hub entries. Reuse credited illustrative media and disclose that it does not depict the fictional story. Do not invent real people, events, service availability, health guidance, or public-service information.
- **Test:** `npm run check` passes lint, formatting, strict TypeScript, all 80 Vitest tests, and the production build. Focused coverage checks Nepali and translated English topic search, content-kind filters, ordering, pagination, malformed and repeated parameters, fictional fixture disclosures, Society information-hub filtering, language switching, and an Axe accessibility scan.
- **Review:** Adapt people-first coverage breadth and context links from Nepali social-issues reporting and the broad Society desk of international outlets. Confirm the page prioritizes topic-based navigation and context, keeps fictional previews distinguishable from verified reporting, credits illustrative media, and introduces no live health or public-service claims, external feeds, backend services, or persistence.
- **Verify:** The production build registers the dynamic `/category/[slug]` route; confirm `/category/society` using the current development server on port 3003. Automated tests and build pass. The in-app browser blocks localhost navigation under its URL security policy, so phone, tablet, and desktop visual review remains for the owner.
- **Exit:** Society page interactions, bilingual sample copy, responsive layout, and accessibility checks are implemented and automated checks pass. The owner approved the Society page and moved to World; Economy visual review remains pending.

**Design references reviewed for Task 1.44:** [The Kathmandu Post National](https://kathmandupost.com/national), [eKantipur news coverage](https://ekantipur.com/news), and [The Guardian Society](https://www.theguardian.com/society).

### Task 1.45 — Build a complete responsive World page — owner-approved

- **Build:** Add a Nepali-first `/category/world` desk with region navigation (South Asia, Asia Pacific, Europe, Africa, the Americas, Middle East, and global), an image-led lead story, a compact briefing, a searchable and filterable latest feed, newest/oldest ordering, URL-backed pagination, selected reading, and information-hub context. Add eight fictional international story fixtures and two fictional context entries, alongside the existing two World fixtures. Provide translated English preview copy and mark every story, date, and region mapping as fictional design material. Keep regional filters and controls usable at phone, tablet, and desktop widths.
- **Test:** `npm run check` passes lint, formatting, strict TypeScript, all 85 Vitest tests, and the production build. Focused coverage checks Nepali/English search, region and story-kind filters, ordering, pagination, malformed/repeated/overlong parameters, complete fictional fixture coverage, hub counts, bilingual switching, and an Axe accessibility scan.
- **Review:** Use geographic desk navigation common to international coverage and Nepali World desks, while distinguishing the lead, quick briefing, latest feed, and explanatory context. Check that all dates and stories are expressly fictional, stock images remain illustrative, and the UI does not imply live feeds or verified reporting.
- **Verify:** The production build registers the dynamic `/category/[slug]` route and resolves `/category/world`; the existing development server is verified on port 3003. Automated tests and production build pass. In-app browser localhost navigation remains unavailable under its URL security policy, so the owner should complete visual review across phone, tablet, and desktop widths.
- **Exit:** World page content, English/Nepali preview, filters, region navigation, responsive styles, and accessibility checks are implemented; automated checks pass. The owner approved it before moving to Technology. Economy visual review remains pending.

**Design references reviewed for Task 1.45:** [eKantipur World](https://ekantipur.com/world), [The Guardian World](https://www.theguardian.com/world/all), and [The Kathmandu Post](https://kathmandupost.com/).

### Task 1.46 — Build a complete responsive Technology page — owner-approved

- **Build:** Create a Nepali-first `/category/technology` desk with topic navigation for AI and algorithms, digital life, connectivity and infrastructure, and devices and innovation. Add an image-led lead report, compact technology briefing, accessible search, topic and story-kind filters, newest/oldest ordering, URL-backed pagination, selected reading, and links to Technology-focused information-hub entries. Add eight fictional technology stories and two fictional context entries alongside the existing two Technology fixtures. Include translated English preview copy and identify all dates and sample content as fictional. Use responsive layouts for phones, tablets, and desktops.
- **Test:** `npm run check` passes lint, formatting, strict TypeScript, all 90 Vitest tests, and the production build. Focused coverage checks Nepali/English search, topic/type filtering, ordering, pagination, malformed/repeated/overlong parameters, fictional fixture and hub data, language switching, and an Axe accessibility scan.
- **Review:** Adapt broad technology coverage—AI, devices, science, digital rights, and everyday impact—from Nepali and international technology desks. Confirm that fictional examples do not resemble current reporting about real companies, products, people, policies, or events; stock images remain disclosed as illustrative; and no live feed or security/consumer advice is implied.
- **Verify:** The production build registers the dynamic `/category/[slug]` route; `/category/technology?topic=ai` returns HTTP 200 on the development server at port 3003 and includes the expected fixture and fiction disclosure. `git diff --check` is clean. Automated checks pass; owner visual review across phone, tablet, and desktop remains pending.
- **Exit:** Technology content, English/Nepali interface, topic and story filters, responsive styles, hub context, and accessibility checks are implemented. The owner approved the page and moved to Opinion. Economy visual review remains pending.

**Design references reviewed for Task 1.46:** [eKantipur Technology](https://ekantipur.com/technology/), [The Kathmandu Post Science & Technology](https://kathmandupost.com/science-technology), and [The Guardian Technology](https://www.theguardian.com/technology/all).

### Task 1.47 — Build a complete responsive Opinion page — implementation, checks, and cross-device review complete; owner visual acceptance pending

- **Build:** Add a Nepali-first `/category/opinion` desk with topic navigation for politics, society, economy, technology, world, and culture/education. Include a featured column, an editorial-desk sample reading list, an image-led opinion and analysis feed, accessible bilingual search, topic and format filters, newest/oldest ordering, URL-backed pagination, and a reader guide that distinguishes opinion from reported news. Add eight clearly fictional opinion/analysis fixtures with generic sample-columnist identities, alongside the two existing opinion fixtures. Mark every sample headline, author, and view as fictional. Make the layout responsive for phone, tablet, and desktop widths.
- **Test:** `npm run check` passes lint, formatting, strict TypeScript, all 96 Vitest tests, and the production build. Focused coverage checks Nepali and English search, topic/format filters, ordering, pagination, invalid and repeated query parameters, fictional fixture disclosures, translated preview copy, responsive markup, and an Axe scan. Add deterministic localized-number rendering and use it in page navigation so server and browser digits hydrate consistently.
- **Review:** Reference Nepali opinion desks and international columns/commentary pages. Keep opinion and analysis visibly distinct from reported news, attribute each column to a clearly fictional sample writer, and show the sample-content notice near the page. Avoid inventing real authors, positions, endorsements, or current-affairs claims.
- **Verify:** `/category/opinion` renders the Opinion lead and fiction notice. Phone (375×812), tablet (820×1000), and desktop (1440×1000) layouts reflow without horizontal overflow. Grid checks show a single column at phone width, paired content columns on wider screens, and two story cards per row on desktop. No browser errors appeared after using the stable number formatter. The final repository check passed 104 tests and the production build.
- **Exit:** Opinion content, Nepali/English preview, topic and format filters, responsive styles, reader guidance, automated checks, and agent visual review are complete. Await owner visual acceptance; the frontend/API contract must also be approved before backend work.

**Design references reviewed for Task 1.47:** [eKantipur Opinion](https://ekantipur.com/opinion/2026/06/01/), [The Kathmandu Post Columns](https://kathmandupost.com/opinion/columns), and [The Guardian Opinion](https://www.theguardian.com/commentisfree/all).

### Task 1.48 — Audit current frontend functionality — implementation, checks, and re-audit complete; owner acceptance pending

- **Build:** Audited the PRD P0 reader paths against the running frontend and public contract. Fixed English query matching for the English UI preview of Nepali fixtures while keeping the explicit English-edition filter empty until reviewed English articles exist. Fixed browser-tab title localization when Next.js replaces the title node during navigation. Limited Vitest to four workers so the repository check does not time out large accessibility tests on this host.
- **Test:** `npm run check` passes lint, formatting, strict TypeScript, all 104 tests, and the production build. New regression tests cover English preview search and title localization after a title-node replacement; the staff matrix responsive behavior is covered by a component test.
- **Review:** Confirmed search still filters only Nepali-edition records; English fixture text is used for query matching only and remains disclosed as preview copy. Sign-in, publishing, corrections, and media selection remain explicitly labeled in-memory prototypes. PostgreSQL, Redis, Cloudinary, staff authentication, live notifications/feeds, and persisted editorial workflows remain deferred. RSS, sitemap, robots, social cards, and article JSON-LD remain in planned Task 2.5 because that task requires persisted published-only records and an approved canonical origin.
- **Verify:** Re-audited 32 public/newsroom routes at phone width and key reader/admin routes at tablet and desktop widths. All inspected routes rendered their expected heading without page-level horizontal overflow. Checked the staff role matrix scroll controls in the browser and found no console errors. Existing route smoke checks and the production build pass.
- **Exit:** The current frontend's public navigation, search, localization, reader pages, and clearly disclosed newsroom previews pass the technical audit. Owner acceptance and the frontend/API contract sign-off remain gates before backend and distribution work.

### Task 1.49 — Document newsroom/admin panel functionality and layout — complete; owner review pending

- **Build:** Added [the newsroom/admin panel guide](admin/README.md) with a current-versus-target functionality inventory, current and planned routes, responsive admin shell, dashboard, story editor, editorial and fact-check review, homepage curation, information-hub management, media library, correction history, staff roles, audit trail, security boundaries, and UI acceptance checklist. Updated the root README and documentation index to link to the guide.
- **Test:** Documentation-only task. Checked the feature inventory against the PRD, TRD, public frontend contract, implementation plan, and current newsroom routes/components; no application code changed.
- **Review:** Marked temporary prototype behavior separately from target capabilities and backend-dependent features. Kept the role matrix aligned with the technical requirements and called out decisions still needing editorial-owner approval.
- **Verify:** Checked internal links, route names, and status terminology against repository documents and current route tree; `git diff --check` and the repository's formatting check pass.
- **Exit:** The admin panel has a reviewable frontend layout/functionality specification. The owner authorized Task 1.50; retain the planned backend gate.

### Task 1.50 — Implement the responsive newsroom/admin layout — implementation, checks, and cross-device review complete; owner visual acceptance pending

- **Build:** Implemented a separate newsroom shell that matches the site's paper-and-ink design, with grouped desktop navigation, a mobile drawer, page title, language/theme controls, public-site link, active route states, and a persistent prototype disclosure. Added a fixture dashboard, searchable story library with status/section filters, story editing metadata, homepage lead/breaking/trending preview, hub and category sample management, correction form, role matrix, searchable sample audit log, and settings/service-status screens. Kept all changes in temporary client state and used explicitly fictional fixtures; authentication, server permissions, persistent publishing, PostgreSQL, Redis, and Cloudinary remain deferred.
- **Test:** `npm run check` passed Biome lint/format, strict TypeScript, all 104 Vitest tests across 25 files, and the production build. Added newsroom interaction coverage for homepage placement preview, hub/category sample additions, story-library filtering, settings preview, and staff matrix containment. `git diff --check` passed.
- **Review:** Compared route coverage and responsibilities with `docs/admin/README.md`, the PRD/TRD, and frontend contract. Checked Nepali/English copy, keyboard-operable controls, focus-managed mobile navigation, fictional-data labels, and explicit non-persistence notices. Fixed the staff role matrix so it stays within the phone viewport with accessible scroll controls and fits at desktop width.
- **Verify:** The development server returned HTTP 200 for all 18 smoke-checked newsroom routes, including filtered stories, create/edit/detail/preview, review, media, corrections, homepage, hub, categories, staff, audit, settings, sign-in, and denied views. Rechecked all 32 public/newsroom routes at phone width and the key reader/admin routes at 820px and 1440px; no page-level overflow or browser console errors appeared. Exercised the staff matrix scroll buttons: they scroll the table and return it to the starting edge while keeping the page width unchanged.
- **Exit:** Admin shell and frontend-only modules are ready for owner visual acceptance. No real authentication, authorization, upload, saving, or publishing is connected. Keep Task 2.1 gated on owner approval of the complete UI and frontend/API contract.

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

All Phase 1 frontend implementation tasks (1.1–1.50) are complete. The compact hero change in Task 1.25 remains reverted at the owner's request. The home, latest, Politics, Society, World, and Technology pages have previously received owner approval. This final review rechecked Economy (1.43), Opinion (1.47), and the newsroom/admin interface (1.50) at phone, tablet, and desktop sizes; all inspected routes reflow without page-level horizontal overflow. The admin staff permission matrix now remains contained on phone screens, exposes localized left/right scroll controls, and fits at desktop width. The final `npm run check` passed formatting/lint, strict TypeScript, all 104 tests across 25 files, and the production build. The frontend functionality audit and newsroom/admin guide are complete; owner visual acceptance of Economy, Opinion, and the admin UI, review of the guide, and approval of frontend/API contract v1.2 remain outstanding.

The application remains Nepali-first and uses clearly fictional editorial fixtures; illustrative stock media is not verified reporting. English preview translations are not approved reporting. The notification control is preview-only and there is no live-news feed. The newsroom is a frontend-only prototype: authentication, permissions, uploads, persistent edits, and publishing are not implemented. Do not begin Task 2.1 until the owner approves the complete UI and frontend/API contract baseline. PostgreSQL, Redis, Cloudinary, staff authentication, and real publishing stay deferred to Phase 2.
