# Nep Darpan — Product Requirements Document

Version: 0.3  
Date: 2026-10-05  
Status: Phase 0 product scope baseline; remaining policy and provider decisions are listed below

## 1. Product summary

Nep Darpan is a modern, mobile-first responsive web publication for timely, trustworthy coverage of Nepal, the region, and international affairs that affect its readers. It combines a news portal with an evergreen information hub: readers can follow what is happening now, understand the context, and find practical reference material. Readers use it in a browser on phones, tablets, and desktop devices; native iOS and Android applications are outside the current scope.

The supplied wireframe establishes an editorial broadsheet direction: warm paper surfaces, strong serif headlines, compact sans-serif utility text, high-contrast rules, restrained color, a clear breaking-news accent, Nepali script support, and responsive web navigation. It depicts a homepage, economy section, search/explore, and article detail. Other visible modules include live updates, market indicators, opinion, fact checks, video, article audio, newsletters, and an information hub. App-store buttons appearing in wireframe material are placeholders and are not launch requirements. Cloudinary is the selected image/video asset platform; TypeScript is required for application code. Delivery is frontend-first: complete the responsive frontend against typed fictional fixtures, review its contracts, then implement the backend and database.

The wireframe is a design reference, not a content specification. Sample stories and displayed data must not be published as real news.

## 2. Vision and principles

### Vision

Be a dependable daily source for Nepali readers who want current affairs reported clearly and explained with context.

### Product principles

- **Trust before velocity:** publish promptly while preserving authorship, timestamps, sourcing, correction history, and editorial control.
- **Clarity over clutter:** prioritize the lead story and useful context; keep urgent markers rare and meaningful.
- **Nepali-first, bilingual-ready:** make Devanagari typography, search, metadata, and workflows first-class. English is shown only when a separately reviewed translation exists.
- **Useful beyond the headline:** connect breaking coverage to explainers, fact checks, data, and related reporting.
- **Fast on mobile networks:** server-render primary content, optimize images, and keep interaction code small.
- **Newsroom-owned ranking:** let editors control the lead and urgent stories. Use audience analytics as a signal, not as the sole definition of importance.
- **Trust made visible:** show authorship, publication/update times, corrections, sourcing and editorial standards; visually distinguish reporting, opinion, analysis, sponsored material, and fact checks.
- **Direct and shareable:** make stories fast, indexable, linkable, subscribable by email/RSS, and useful when reached directly from search or social platforms.
- **Editorial trending:** keep the launch trending list editor-curated or explicitly labeled with its ranking basis; do not let an opaque popularity score override editorial judgment.

## 3. Goals and measures

### Initial goals

1. Readers can find the latest verified reporting by topic and language.
2. Editors can publish, update, correct, and withdraw stories without a developer.
3. Search and the information hub make older reporting and explainers discoverable.
4. Pages are fast and readable on common mobile devices and constrained connections.
5. Public pages expose useful metadata for sharing and search indexing.

### Measures to establish

Record a baseline after launch and review it weekly:

- returning readers and engaged reading sessions;
- article opens from home, category, search, and related-story placements;
- search success rate and zero-result queries by language;
- time from editorial approval to public visibility;
- correction/update publication time;
- newsletter confirmation and unsubscribe rates;
- Core Web Vitals and failed page requests, segmented for phone and desktop browser traffic.

Do not optimize solely for page views or time on page. Define editorial success and privacy-conscious analytics policy before selecting an analytics vendor. Set numeric growth targets after traffic, staffing, and launch period are known.

## 4. Users and needs

| User | Need | Typical tasks |
|---|---|---|
| Daily reader in Nepal | Understand important developments quickly | Scan top stories, breaking updates, topics, and explainers |
| Nepali diaspora reader | Follow Nepal in a convenient language and time context | Switch language, search, share, subscribe |
| Topic-focused reader | Follow economy, politics, society, technology, or world affairs | Browse a section, filter stories, compare coverage |
| Journalist / contributor | Draft and submit accurate reporting | Add text and media, save drafts, respond to editor feedback |
| Editor / desk editor | Review, prioritize, schedule, publish, update, and correct | Manage homepage, categories, ticker, fact-check state, revisions |
| Administrator | Keep accounts, permissions, configuration, and integrations healthy | Manage staff roles, categories, editions, data feeds, settings |

Readers should not need an account to read public journalism. Accounts are required for newsroom work. Reader accounts for bookmarks, alerts, or personalization are a later decision.

## 5. Scope and release plan

### Launch scope (P0)

- Responsive Nepali-first website shell with masthead, section navigation, language control, breaking/latest ticker, footer, and compact phone navigation.
- Homepage with an editor-selected lead, a latest/breaking feed, an editor-curated “Trending now” collection, section collections, and clearly separated opinion and information-hub entry points.
- Topic/category pages, including an economy article layout. Market/weather indicators are deferred until a provider and freshness policy are approved.
- Article page with headline, summary, author/byline, published and updated times, lead image and attribution, readable body, share action, related coverage, and visible correction/update notes.
- Search/explore with query, language, category, content type, and date filters; useful empty and no-results states.
- Information-hub pages for durable explainers, guides, and fact-check items.
- Editorial management to create, preview, review, schedule, publish, update, correct, and archive content, with media management through Cloudinary.
- Named newsroom roles, auditable publication changes, article revisions, and correction workflow.
- Search/social metadata, canonical URLs, XML sitemap, RSS feed, and indexable server-rendered pages.
- Basic performance and error monitoring.
- Cloudinary-backed upload and delivery of approved editorial images and video assets; public video programming/player experience can be enabled as the newsroom is ready.

### Later increments (P1/P2)

- Reader accounts, cross-device bookmarks, saved topics, and personalized notifications.
- Automated audience-based trending with editorial safeguards and documented ranking.
- Push notifications and configurable breaking-news alerts.
- Audio narration, live radio, video/interview library, transcripts, captions, and playlists.
- Regional editions and location-specific coverage.
- Interactive charts, live event dashboards, richer market-data history.
- Advanced newsletters, membership, subscriptions, advertising inventory, and sponsorship reporting.

### Out of current scope

- Native iOS or Android applications, app-store distribution, and app-download calls to action. The responsive website must provide the reader experience across phone, tablet, and desktop browsers.

The wireframe depicts some later-increment features. Their presence in the design does not make them launch requirements. Comments and user-generated posts are not in the proposed launch scope.

## 6. Information architecture

- Home
- Sections: Politics, Economy, Society, Business, Technology, World, Opinion, Multimedia, and other editor-managed topics
- Latest / breaking updates
- Article detail
- Search / explore
- Information hub: explainers, guides, fact checks, and reference pages
- About, contact, editorial standards, corrections policy, privacy, terms, and partnerships
- Newsroom: dashboard, article editor, review queue, media library, categories, staff, configuration

Section names and order are editorial decisions. Wireframe labels are starting examples.

## 7. Functional requirements

Priority: P0 required for launch; P1 planned next; P2 future.

| ID | Priority | Requirement and acceptance outcome |
|---|---|---|
| PR-01 | P0 | A visitor can open home and reach lead, latest, section, and information-hub content through visible links. |
| PR-02 | P0 | Editors can set the lead, breaking status, trending collection, and home order. Trending is editor-curated at launch; any audience-popularity view states its basis and cannot silently replace editor judgment. |
| PR-03 | P0 | Each published story has a stable language-specific URL, title, summary, author, category, publication time, and publish state. Draft and scheduled stories are hidden from anonymous readers. |
| PR-04 | P0 | An article distinguishes original publication time from later updates and displays a correction notice when present. Prior revisions remain auditable to authorized staff. |
| PR-05 | P0 | Editors can preview, request changes, schedule, publish, unpublish, or archive a story; material corrections and withdrawals retain a reason/audit entry. |
| PR-06 | P0 | Search returns published material only, supports selected filters, preserves query in the URL, and has loading, error, empty, and no-results states. Nepali and English quality is measured separately. |
| PR-07 | P0 | Editors can publish evergreen hub pages and link them to stories and topics. Fact-check items show scope, evidence, review date, and conclusion under a newsroom-approved standard. |
| PR-08 | P1 | If approved live indicators are added, each shows provider/source, unit or currency, and last-updated time. Stale or unavailable data is labeled; invented values are never substituted. |
| PR-09 | P0 | A reader can change language where a reviewed translation exists. Where none exists, the product routes clearly to an available edition without implying translation. |
| PR-10 | P0 | Editors can upload/select approved images and video through Cloudinary. PostgreSQL records Cloudinary asset identifiers plus status, alt text, caption, credit, source, license/rights, dimensions, and duration where applicable. Only cleared media can be published. |
| PR-11 | P1 | If newsletter signup is added after provider and privacy approval, a reader can submit an address with explicit consent, receive a clear result, and unsubscribe later. |
| PR-12 | P0 | Staff can sign in. The application enforces permissions on the server and in database policies, not only by hiding controls. |
| PR-13 | P0 | Public pages expose title, description, canonical URL, social preview metadata, and truthful structured article metadata. |
| PR-14 | P0 | Responsive phone and tablet browser layouts support the same core reading, navigation, search, and sharing paths as desktop browsers. |
| PR-15 | P1 | A reader can save and retrieve stories across devices after signing in. |
| PR-16 | P1 | Editors can send opt-in breaking alerts and review delivery outcomes. |
| PR-17 | P1 | Audio/video items provide accessible controls and captions or transcript where available. |
| PR-18 | P2 | A regional edition can select a different lead, local updates, and weather from configured sources. |

## 8. Editorial rules and content quality

- Every article needs an accountable author or desk byline, publish time, section, and editorial owner.
- Mark analysis, opinion, sponsored content, and corrections distinctly from straight reporting.
- Store source links, media credits, and staff-facing editorial notes in appropriate fields; private notes must not be public.
- Correction history is append-only from the product perspective: add a notice and history instead of silently erasing a material published error.
- A story translation is a separately reviewed language version linked to a shared story group.
- An editor approves every article before publication. Fact-check entries use a fact-check review workflow. Editors may flag high-risk explainers for fact-check review; the newsroom must define high-risk criteria before workflow implementation.
- Use newsroom-approved house style, verification checklist, fact-check methodology, and corrections policy. This document does not prescribe legal or journalistic policy.
- Replace all sample copy and remote image URLs with independently verified reporting and rights-cleared media.

## 9. Non-functional product requirements

Targets below are provisional; confirm against deployment, audience, and budget.

- **Performance:** target “good” Core Web Vitals at the 75th percentile: LCP no more than 2.5 seconds, INP no more than 200 ms, CLS no more than 0.1. Prioritize article text and hero image.
- **Freshness:** normal approved publication appears publicly within 60 seconds; a designated breaking story within 15 seconds. Monitor and test against the selected cache/host.
- **Search:** target 95th-percentile response under 1.5 seconds for the expected corpus and traffic; measure relevance by language.
- **Accessibility:** target WCAG 2.2 AA for core journeys, including keyboard operation, focus, contrast, form errors, landmarks, alternatives, and language metadata.
- **Availability:** set an objective after choosing the host and support owner; provisional planning target is 99.5% monthly for public reading.
- **Security:** no public draft access, no service credentials in browser code, least-privilege newsroom roles, auditable publication changes, tested database policies.
- **Privacy:** collect only data with a defined purpose; document consent and retention; do not collect precise location or reader history by default.
- **Content integrity:** attribution, status, and timestamps remain correct through caching, translation, sharing, and revision.

## 10. Launch acceptance

1. Editors complete the approved draft-to-publication workflow without developer intervention.
2. Anonymous visitors browse home, section, article, search, and hub pages in phone, tablet, and desktop browsers.
3. Draft and scheduled content cannot be read through a public route or database policy.
4. Corrections and updates are visible and preserve change history.
5. Search works for launch content in Nepali and any reviewed English translations, with documented limitations and baseline relevance checks.
6. Performance, accessibility, security, backup, and recovery targets are agreed and reviewed before production.
7. A newsroom user with upload permission completes the signed Cloudinary image/video upload path; unauthorized users cannot upload, and published media has verified rights and useful alternative text/captions.

## 11. Open product decisions

1. Who will translate and review English editions, and when should an English edition be enabled?
2. Which desks/categories and regional editions exist on day one? What criteria make an explainer high-risk and require fact-check review?
3. Which indicators, weather, audio, and expanded video are required later, and who supplies/licenses them?
4. Does a later release need reader accounts, bookmarks, notifications, advertising, or paid access?
5. What audience size, publishing volume, traffic peaks, and response times must be supported?
6. Which editorial standards, correction rules, privacy/retention policy, and jurisdiction-specific reviews apply?
7. Who owns hosting, email, analytics, security response, backups, and production support?
8. Which Cloudinary plan, upload limits, asset retention, video formats, and video-player experience fit launch cost and newsroom capacity?

## 12. Research basis and design benchmarks

This is a pattern review, not a claim that one publisher is universally “best” or a request to copy another publisher's visual identity. The benchmark review was performed on 2026-10-04.

- The [AP News homepage](https://apnews.com/) groups top stories by topic, offers newsletters, gives Fact Check a persistent discovery path, and links editorial standards and a code of conduct. Nep Darpan applies this as clear sections, explainers/fact checks, and visible standards; newsletter signup remains deferred.
- The [Guardian international homepage](https://www.theguardian.com/international) combines live coverage with update times, separates opinion, and makes newsletters, corrections, contact, and accessibility routes findable. Nep Darpan applies these as live/latest affordances, explicit content labels, and reachable correction/contact policies.
- The [Reuters Institute Digital News Report 2025](https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2025/dnr-executive-summary) reports that in its surveyed markets online news consumption is often accessed through third-party platforms, and records persistent trust concerns and audience skepticism about AI-generated news. This is not Nepal-specific research; the product implication is an inference: build direct, fast, shareable, SEO/RSS/newsletter paths while preserving human editorial accountability and source transparency.
- The [Google Article structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/article) recommends accurate article title, image, author, and date metadata; structured data helps search engines understand articles but does not guarantee special placement.

