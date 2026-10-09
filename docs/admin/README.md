# Nep Darpan Newsroom and Admin Panel

This document is the product and layout guide for Nep Darpan's newsroom/admin panel. The responsive frontend layout is now implemented as a prototype; this guide records the website functionality it must support, current versus target behavior, staff workflows, and acceptance checks for future backend work.

## 1. Scope and status

Nep Darpan is a responsive news website and information hub. The public frontend is Nepali-first and supports phone, tablet, and desktop browsers. The newsroom is a separate staff workspace in the same Next.js application.

The existing newsroom is a **frontend prototype** built with fictional fixture data. Its sign-in screen does not authenticate anyone; draft edits and review decisions exist only in temporary React state; and the media picker does not upload files. It is useful for designing the admin experience, but it is not secure, persistent, or ready for real editorial work.

This README defines the complete target layout. It does not authorize connecting a database, Redis, Cloudinary, authentication provider, live news feed, or real publishing workflow before the frontend and contracts are approved. Do not present prototype actions or fixture records as real newsroom activity.

## 2. Website functionality inventory

### Public reader website

| Area | Reader functionality | Current frontend status |
|---|---|---|
| Home | Lead story, breaking/latest placement, editor-curated trending, category collections, information-hub highlights, reels, and ad preview placement. | Responsive fixture-driven design. Headlines and media examples are fictional/illustrative. |
| Latest | Browse recent stories, search, filter by section and story type, change ordering, and navigate result pages using URL state. | Implemented with fixture data. |
| Sections | Politics, Economy, Society, World, Technology, and Opinion desks with section-specific lead content, topic navigation, search/filters, sorting, and pagination. | Implemented with fictional fixtures and responsive layouts. |
| Article | Read the headline, summary, byline, section, timestamps, article body, media credits, sources, related coverage, and correction/update notices. Share the current article URL. | Reader routes and article interactions use fixture content. |
| Search | Search Nepali fixture text and English UI-preview copy; filter by language edition, category, content type, inclusive date range, and order; retain state in the URL; show empty/error/loading states. | Implemented against the local fixture adapter. No English-edition stories are invented. |
| Information hub | Find explainers, guides, and fact-check entries with type filters, source/evidence details, review dates, related stories, and pagination. | Implemented with fictional examples; no real fact-check verdict is claimed. |
| Localization | Switch the interface between Nepali and an English UI/fixture preview, with localized labels, dates, numbers, and document language. | Implemented. English preview text is not reviewed journalism. |
| Theme and navigation | Switch appearance theme; use desktop navigation, compact/mobile navigation, skip link, breadcrumbs, and shared footer links. | Implemented in the responsive shell. |
| Reels and video | Browse the reels carousel and video preview cards with descriptive labels and keyboard controls. | Fixture-driven preview; no newsroom video upload or real media program is connected. |
| Notifications | Open the notification control and understand its preview/unavailable state. | Preview only; no notifications are delivered. |
| Trust and policies | Reach About, Contact, Editorial Standards, Corrections, Privacy, and Terms pages. | Routes exist; owner/editor-approved policy content may still be pending. Never invent ownership, legal, or contact details. |

### Newsroom/admin functionality

| Area | Target staff capability | Current frontend status |
|---|---|---|
| Dashboard | See clearly labeled workflow totals, work needing attention, recently changed demo stories, and a create-story shortcut. | Responsive fixture dashboard with workflow cards, story queue, quick links, and prototype notes. Counts are not operational metrics. |
| Staff sign-in and access | Authenticate named staff, maintain sessions, enforce role and desk scope on every protected read/write, and show access-denied/help states. | Sign-in and denied pages are visual previews only. No identity or permission checks exist. |
| Story library | Find stories by headline, section, author, type, locale, status, and time; open, edit, preview, and paginate results. | Fixture list supports headline/summary/author search, section/status filters, clear filters, details, edit, and preview. Type/locale/date filters and pagination remain future work. |
| Story editor | Edit headline, summary, structured body, language edition, category, type/labels, author, sources, media, accessibility text, metadata, schedule, and preview. | Headline, summary, body, locale, category, type, author, source notes, schedule, and preview are modeled locally in temporary React state. Media fields and a production content schema are deferred. |
| Editorial review | Review submitted work, inspect sourcing and media, request changes with notes, perform fact-check review, approve, and route approved work to scheduling/publication. | A simple approve/return preview exists; no comments, assignments, persistent decision, or actual publication. |
| Homepage curation | Set the lead, breaking placement, editor-curated trending list, and section order, with preview and change history. | Local-only lead/breaking/trending controls and an editorial preview are implemented. No homepage data is saved or published. |
| Information hub | Create and review explainers, guides, and fact-check records, including evidence, review dates, conclusion policy, and story/topic links. | Search/type filter and add-entry preview work against local sample state; review and persistence are deferred. |
| Media library | Search/select assets, upload images/videos through authorized Cloudinary flow, review rights, set alt text/captions/credits, and approve or reject assets. | Local file-selection preview only. It sends no file to a service. |
| Corrections and updates | Add attributed, timestamped correction/update records, record a reason, preview the notice, and retain the change history. | A local correction-entry preview is implemented; entries do not change public stories or persist. |
| Taxonomy and editions | Manage categories/topics and reviewed language editions without creating false translations. | Category listing and add-section preview are implemented in local state; slugs, topics, review, and persistence are deferred. |
| Staff and roles | Invite/deactivate staff, assign the agreed role and desk scope, and review permission changes. | A static proposed permission matrix is shown. There are no accounts, invitations, or enforced roles. |
| Audit and configuration | Review who changed, reviewed, scheduled, published, corrected, archived, or changed permissions; manage approved settings. | Searchable fictional audit examples and local settings previews are implemented. They are not a real audit trail or saved configuration. |

### Explicitly deferred functionality

These features are intentionally outside the frontend-only prototype and must not be represented as currently working:

- PostgreSQL-backed content, account, media, revision, correction, and audit records.
- Redis caching, invalidation, and multi-instance behavior.
- Staff authentication, server-side authorization, role enforcement, and database policies.
- Real draft persistence, revision history, review comments, scheduling, publication, withdrawal, or archive actions.
- Signed Cloudinary upload, asset registration, rights approval, and protected media delivery.
- Live news feeds, real notifications, market/weather data, newsletter sending, analytics, reader accounts, bookmarks, or personalization.
- Production search, RSS/Atom, sitemap, robots policy, canonical/hreflang, social cards, and article structured data. These are planned for implementation-plan Task 2.5 and require persisted approved content and an approved canonical origin.

## 3. Admin information architecture

Use a distinct newsroom workspace so editors can work without the public site's reader navigation taking over the screen. Keep the same Nep Darpan typography, paper-and-ink palette, focus styles, and responsive behavior.

### Persistent navigation

| Group | Navigation item | Target route | Main purpose |
|---|---|---|---|
| Workspace | Dashboard | `/newsroom` | Work summary and actions that need attention. |
| Editorial | Stories | `/newsroom/stories` | Search, filter, create, edit, preview, and track story records. |
| Editorial | New story | `/newsroom/stories/new` | Start a draft in the editor. |
| Editorial | Review queue | `/newsroom/review` | Editor and fact-checker review tasks. |
| Editorial | Corrections | `/newsroom/corrections` | Preview a correction/update notice. |
| Editorial | Homepage & placements | `/newsroom/homepage` | Preview the lead, breaking, and trending selections. |
| Library | Information hub | `/newsroom/hub` | Search and add local demo explainers, guides, and fact-check entries. |
| Library | Media | `/newsroom/media` | Browse, select, upload, attribute, and review assets. |
| Structure | Categories & topics | `/newsroom/categories` | Preview local section management. |
| Administration | Staff & roles | `/newsroom/staff` | Review the proposed role and permission matrix. |
| Administration | Audit log | `/newsroom/audit` | Search fictional audit entries. |
| Administration | Settings | `/newsroom/settings` | Preview defaults and show deferred service connections. |

The prototype includes `/newsroom`, `/newsroom/sign-in`, `/newsroom/denied`, `/newsroom/stories`, `/newsroom/stories/new`, `/newsroom/stories/[id]`, `/newsroom/stories/[id]/edit`, `/newsroom/preview/[id]`, `/newsroom/review`, `/newsroom/media`, `/newsroom/corrections`, `/newsroom/homepage`, `/newsroom/hub`, `/newsroom/categories`, `/newsroom/staff`, `/newsroom/audit`, and `/newsroom/settings`. Every route is a frontend preview using fictional fixtures; no route is protected by real authentication.

### Responsive shell

- **Desktop:** persistent left sidebar with grouped navigation; top bar with page title/breadcrumb, current demo/user status, language control, and account menu; content area with a readable maximum width. Avoid horizontally scrolling the whole workspace.
- **Tablet:** collapsible sidebar and two-column dashboard cards where they fit; keep primary actions visible.
- **Phone:** sidebar becomes an accessible drawer; use stacked cards and forms, explicit back navigation, and large touch targets. Wide tables may scroll inside their own labeled container or switch to stacked record cards.
- **All widths:** include a skip link, one main landmark, visible keyboard focus, active navigation state, breadcrumbs for deep routes, and explicit loading/empty/error/success/permission-denied states.
- Keep the prototype disclosure visible in the newsroom until authenticated backend services replace the prototype.

## 4. Dashboard layout

The dashboard should answer: “What needs my attention, and what can I safely do next?”

1. **Header:** localized page title, short newsroom context, and a primary `New story` action.
2. **Workflow cards:** draft, in review, scheduled, published today, and correction items needing attention. Use real values only after backend integration; fixture/demo values must say so.
3. **My work / review queue:** role-appropriate list of items with title, section, author, updated time, state, and a direct next action.
4. **Recent activity:** latest changes with actor, action, item, and timestamp. Do not fake audit events; hide this section or label it as sample data in the prototype.
5. **Editorial placement summary:** current lead/breaking/trending state and a link to homepage curation. Do not imply a breaking story exists when the feed is unavailable.
6. **System status:** reserved area for actual service health after operations work exists; omit or mark unavailable in the frontend prototype.

Never use page views, popularity, or demo counters as evidence of journalistic importance. Lead, breaking, and trending placements are editor-curated at launch.

## 5. Story workflow and editor requirements

### Status model

Use the approved workflow vocabulary and display both label and text; never rely on color alone:

`Draft → In review → Approved → Scheduled → Published → Archived`

- `In review` can return to draft/changes requested with an editor note.
- Fact-check review is a distinct review path; a fact checker does not publish by default.
- Approval and publication are separate actions. Only an authorized editor/admin may schedule or publish under the agreed policy.
- A correction is a separate, timestamped public record linked to the article, not a silent body overwrite.
- Withdrawal behavior and exact state transitions require editorial-owner approval before backend workflow implementation.
- Public routes expose published, approved, locale-matched content only. Drafts, schedules, internal notes, and restricted media remain private.

### Story list

Provide:

- Search by headline/slug and filters for section, story type, language, state, author, and date.
- Stable sort choices such as recently updated, newest publication, and scheduled time.
- URL-backed filters/pagination where the list is navigable; clear filters and no-results state.
- Columns/cards for headline, type/labels, category, edition, author, state, last change, and permitted actions.
- Actions gated by role: open, edit, preview, review, schedule, publish, correct, or archive. UI visibility is not authorization.
- Confirmation for high-impact actions and clear success/error feedback.

### Story editor

Organize the editor into focused sections or tabs with an unsaved-changes indicator:

1. **Story content:** headline, summary/deck, structured body blocks, category, topic tags, story kind, and editorial labels (breaking, opinion, analysis, fact-check, sponsored).
2. **Edition and attribution:** locale-specific title/body/slug, shared story-group identity, named author/byline, desk owner, and publication/update times. English is a separate reviewed edition, not automatic translation.
3. **Sources and review:** source references, internal editorial notes (staff-only), fact-check status/evidence, reviewer comments, and checklist completion.
4. **Media:** attach only approved assets; require useful alternative text and applicable caption, credit, source, and rights/license information.
5. **Publication:** preview, save draft, submit for review, request changes, approve, schedule, publish, unpublish/withdraw per policy, or archive according to role and current state.
6. **Search/share metadata:** title, description, canonical path, and social preview fields. Production metadata must be validated with Task 2.5; do not expose draft metadata publicly.

Validate required fields inline and summarize errors at the top. Warn before leaving with unsaved work. Show a confirmation and clear status after an action. In the current prototype, state is temporary and disappears on refresh; do not call that autosave or persistence.

## 6. Review, fact-check, correction, and curation screens

### Review queue

- Split regular editorial review from fact-check review or provide an explicit review-type filter.
- Show queue age, assigned reviewer, author/desk, state, due/priority indicator, and title.
- Detail view includes preview, sources, citations, media rights/accessibility checks, content labels, locale status, and revision context.
- Offer `Approve`, `Request changes` (with required note), and a permitted route to fact-check. Approval must not silently publish.
- Record reviewer identity, decision, time, and reason in the backend audit trail.

### Corrections and updates

- Start from a published story; capture correction/update text, reason, authorizing editor, effective timestamp, and affected locale.
- Preview the public correction notice before committing it.
- Preserve earlier notices/revisions and show the correction prominently on the public article.
- Require confirmation; a correction must invalidate public page/search/feed/cache surfaces when backend integration is implemented.

### Homepage placements

- Curate lead, breaking, trending, and section ordering with drag/reorder or explicit order controls that also work with keyboard.
- Preview the public homepage at phone/tablet/desktop breakpoints.
- Provide start/end or expiry controls for time-sensitive breaking placement and show a warning when a placement expires or references unpublished content.
- Record who changed a placement and when. Trending remains editorially curated unless a later approved, clearly labeled ranking is implemented.

### Information hub

- Manage explainer, guide, and fact-check entries with locale, topic, evidence, reviewer, review date, next review date, conclusion where appropriate, body, and related stories.
- Do not invent a fact-check conclusion; the newsroom must approve a methodology and labels first.
- Flag stale review dates and missing evidence without making an unsupported accuracy claim.

## 7. Media library

The production media screen must support:

- Search and filters by media kind, review state, category, contributor, and date.
- Image/video preview, dimensions, duration, crop/focal point, alt text, caption, photographer/credit, source, license/rights, expiry/embargo, and usage references.
- Explicit states: uploaded/processing, needs editorial review, approved, rejected, archived/deleted.
- Only approved and rights-cleared assets can be selected for public stories.
- Signed, server-authorized Cloudinary upload; validate type, size, dimensions/duration, and response before registration. Keep secrets/signatures out of browser bundles and logs.
- Accessible video controls, poster, captions/transcript where available, and no autoplay with sound.

Until the Cloudinary task, the current page only selects a local file to display its name/size, sends nothing, and loses selection on refresh.

## 8. Roles and permissions

Use the project role baseline below. A backend must authorize every protected read and write on the server and database boundary; hiding a navigation link does not protect data.

| Capability | Journalist | Fact checker | Editor | Administrator |
|---|---:|---:|---:|---:|
| Read public content | Yes | Yes | Yes | Yes |
| Create/edit own draft | Yes | Limited review fields | Yes | Policy-defined |
| Submit story for review | Yes | No by default | Yes | Policy-defined |
| Perform regular editorial review | No | No | Yes | Yes |
| Perform fact-check review | No | Yes | Yes/assign | Yes/assign |
| Approve/schedule/publish | No | No by default | Yes | Yes |
| Correct/unpublish/archive | No | No | Yes, audited | Yes, audited |
| Approve/upload media | Per approved scope | No by default | Yes | Yes |
| Manage staff/roles/configuration | No | No | No | Yes |

Confirm desk scope, freelancer access, shared editing, administrator policy, and exact permissions before implementing backend auth. Every denied action needs an accessible explanation and safe return path.

## 9. Global interaction, accessibility, and localization requirements

- All links and buttons have one clear purpose, accessible names, visible focus, keyboard operation, and no dead click targets.
- Use semantic headings, forms, tables/lists, landmarks, status/alert announcements, and correctly associated labels.
- Confirm destructive or publication actions; keep errors near fields and provide a top-level error summary.
- Respect reduced motion; do not encode status by color alone; meet the product target of WCAG 2.2 AA.
- All staff-facing interface copy should support Nepali and English. User-entered story content must not be automatically translated or rewritten.
- Preserve Devanagari line-height, long headline wrapping, stable numerals/timestamps, and readable forms at phone widths.
- Make tables usable with keyboard/screen readers and prevent page-level horizontal overflow.
- Handle loading, empty, network error, permission denied, stale data, and retry states. Retry must not accidentally duplicate a publish/upload/correction action.

## 10. Data, trust, and security boundaries

- Use the public types in [FRONTEND_CONTRACT.md](../engineering/FRONTEND_CONTRACT.md); define separate reviewed newsroom command/read contracts before connecting APIs.
- Public records contain only approved published content. Staff notes, drafts, auth data, upload signatures, and internal state are never part of public DTOs.
- Keep PostgreSQL authoritative and Redis as an optional server-side cache; cache only eligible public data and invalidate after relevant editorial changes.
- Store media bytes in Cloudinary, metadata/rights in PostgreSQL; do not proxy uploaded binaries through the browser-facing app or expose credentials.
- Preserve revisions, append-only correction/audit records, actor, timestamp, and reason for protected changes.
- Never trust client-supplied role, state, asset approval, or publication status.
- Keep sample stories, staff, counts, and actions visibly labeled fictional/demo until real services are reviewed.

## 11. Route inventory and implementation status

### Existing reader routes

`/`, `/latest`, `/category/[slug]`, `/search`, `/[locale]/news/[slug]`, `/information-hub`, `/information-hub/[slug]`, `/corrections`, `/about`, `/contact`, `/editorial-standards`, `/privacy`, `/terms`.

### Existing newsroom prototype routes

`/newsroom`, `/newsroom/sign-in`, `/newsroom/denied`, `/newsroom/stories`, `/newsroom/stories/new`, `/newsroom/stories/[id]`, `/newsroom/stories/[id]/edit`, `/newsroom/preview/[id]`, `/newsroom/review`, `/newsroom/media`.

### Implemented admin prototype routes

`/newsroom/corrections`, `/newsroom/homepage`, `/newsroom/hub`, `/newsroom/categories`, `/newsroom/staff`, `/newsroom/audit`, and `/newsroom/settings` now have responsive preview screens. Their controls update local page state only. Role changes, audit records, service settings, correction posts, categories, hub entries, and homepage placements are not saved or published. Backend work begins only after the owner approves the frontend/API contract baseline.

## 12. Admin UI acceptance checklist

- [ ] The panel has a consistent shell and grouped navigation at desktop, tablet, and phone sizes.
- [ ] Each current and planned navigation item resolves to a real page or is clearly marked as not yet available; no dead links.
- [ ] Dashboard counts and activity are clearly demo-labeled until backed by data.
- [ ] Story list filters, sorting, detail, editor, and preview preserve the selected record and state.
- [ ] Story editor validates required fields, warns on unsaved changes, distinguishes locale editions, and exposes sources/media/rights metadata.
- [ ] Review distinguishes editor approval from publication and supports required change-request notes.
- [ ] Fact-check review is separate from ordinary opinion or reporting review.
- [ ] Corrections preserve history and require reason, authorizing editor, and timestamp.
- [ ] Homepage curation controls preview their public result and never elevate unpublished content.
- [ ] Media selection cannot present an unapproved asset as publishable; upload stays disabled until authorized Cloudinary integration.
- [ ] Role matrix and permission-denied states are documented; backend authorization is required before production.
- [ ] Every actionable control has a working result or is clearly disabled with an explanation.
- [ ] Forms and tables are keyboard/screen-reader usable; WCAG 2.2 AA review passes.
- [ ] No horizontal overflow at 320, 375, 820, and 1440 px; test both Nepali and English UI.
- [ ] Fictional data/prototype disclosure remains visible in all newsroom routes.
- [ ] `npm run check`, route smoke checks, keyboard review, and browser verification pass for each implementation task.

## 13. Current implementation stage and next steps

The responsive admin shell and all listed frontend preview routes are implemented with localized labels and fictional fixtures. The story editor, review controls, media picker, correction form, homepage curation, hub/category additions, staff role matrix, activity log, and settings previews remain temporary and do not create persistent records or publish news.

1. Review the admin layout at phone, tablet, and desktop sizes; send visual corrections before continuing.
2. Confirm newsroom roles, fact-check policy, review stages, and production publishing rules with the editorial owner.
3. Approve the public/frontend contract baseline before Task 2.1.
4. Only after approval, follow the backend plan: Docker/PostgreSQL schema, staff auth/permissions, persistent workflow, Cloudinary, search/SEO feeds, Redis caching, and integration tests.

## 14. Related project documents

- [Root README](../../README.md) — install, run, checks, project stage.
- [Product requirements](../product/PRD.md) — launch scope, editorial rules, priorities, and acceptance requirements.
- [Technical requirements](../engineering/TRD.md) — database, workflow, role enforcement, Cloudinary, search, caching, and security requirements.
- [Frontend content/API contract](../engineering/FRONTEND_CONTRACT.md) — public types, gateway, visibility and localization.
- [System design](../architecture/SYSTEM_DESIGN.md) — service boundaries and publishing/media flows.
- [Implementation plan](../IMPLEMENTATION_PLAN.md) — task gates and ordered frontend/backend work.
