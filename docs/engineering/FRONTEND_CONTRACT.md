# Nep Darpan — Frontend Content and API Contract

Version: 0.1  
Date: 2026-10-05  
Status: Phase 0 working contract; backend implementation must preserve these public behavior guarantees.

## 1. Purpose

Define the typed boundary between the responsive Next.js frontend, mock fixtures used in the frontend-first phase, and the backend that will be added later. The frontend must depend on these domain types and a replaceable data gateway, not on PostgreSQL, Redis, Cloudinary credentials, or a particular provider SDK.

All examples and fixture content must be clearly fictional. Dates are ISO 8601 UTC strings. Public contracts never contain drafts, staff notes, credentials, internal auth data, or unapproved media.

## 2. Approved Phase 0 working decisions

- Nepali is the default locale: `ne-NP`. English: `en`, is available only for a separately reviewed translation. If a translation does not exist, the interface clearly offers the available edition rather than implying translated content.
- Every story requires editor approval before publication. Fact-check entries use a separate fact-check workflow. An editor may flag a high-risk explainer for fact-check review; the newsroom will define the high-risk criteria before backend workflow implementation.
- The first frontend milestone includes home, categories, articles, search, explainers/guides/fact-checks, corrections, and newsroom prototypes. Newsletter signup and live market/weather data modules are deferred until provider, policy, and product decisions are approved.
- Public reading is anonymous. Newsroom screens in the frontend milestone are prototypes using fixtures and are not secure or persistent until backend authentication and authorization are implemented.
- Trending, lead, and breaking placement is editor-curated for launch.
- The site is responsive web only; no native mobile app is included.

These are working defaults based on the user's instruction to proceed with the recommended Phase 0 options. They can be changed by an explicit product decision before implementation.

## 3. TypeScript domain types

The following is the initial source-of-truth shape for view/API contracts. Application types should be placed in a shared domain module when implementation starts and runtime-validated when data crosses a network or provider boundary.

~~~ts
export type LocaleCode = "ne-NP" | "en";

export type StoryKind =
  | "news"
  | "analysis"
  | "opinion"
  | "explainer"
  | "fact_check"
  | "guide";

export type EditorialLabel =
  | "breaking"
  | "opinion"
  | "analysis"
  | "fact_check"
  | "sponsored";

export interface AuthorSummary {
  id: string;
  name: string;
  slug: string;
  roleLabel?: string;
  biography?: string;
  portrait?: ImageMedia;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  locale: LocaleCode;
}

export interface ImageMedia {
  id: string;
  kind: "image";
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  width: number;
  height: number;
}

export interface VideoMedia {
  id: string;
  kind: "video";
  src: string;
  poster: ImageMedia;
  title: string;
  caption?: string;
  credit?: string;
  durationSeconds?: number;
  captionsUrl?: string;
  transcriptUrl?: string;
}

export type PublicMedia = ImageMedia | VideoMedia;

export interface CorrectionNotice {
  id: string;
  text: string;
  correctedAt: string;
  reason?: string;
}

export interface ArticleCard {
  id: string;
  storyGroupId: string;
  slug: string;
  locale: LocaleCode;
  kind: StoryKind;
  headline: string;
  summary?: string;
  href: string;
  category: CategorySummary;
  authors: AuthorSummary[];
  publishedAt: string;
  updatedAt?: string;
  labels: EditorialLabel[];
  leadMedia?: PublicMedia;
  hasCorrection: boolean;
}

export type ArticleBodyBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "image"; media: ImageMedia }
  | { type: "video"; media: VideoMedia }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; ordered: boolean; items: string[] };

export interface SourceReference {
  label: string;
  // Runtime validation must allow only safe http(s) URLs.
  href: string;
  publisher?: string;
  accessedAt?: string;
}

export interface PublishedArticle extends ArticleCard {
  status: "published";
  body: ArticleBodyBlock[];
  corrections: CorrectionNotice[];
  sources: SourceReference[];
  related: ArticleCard[];
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
    socialImage?: ImageMedia;
  };
}

export interface HubEntry {
  id: string;
  slug: string;
  locale: LocaleCode;
  kind: "explainer" | "guide" | "fact_check";
  title: string;
  summary: string;
  reviewedAt: string;
  nextReviewAt?: string;
  conclusion?: string;
  evidence: SourceReference[];
  body: ArticleBodyBlock[];
  related: ArticleCard[];
}

export interface PageInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface SearchFilters {
  query: string;
  locale: LocaleCode;
  categorySlug?: string;
  kind?: StoryKind;
  sort?: "relevance" | "newest";
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD; must not precede from
  page: number;
}

export interface SearchPage {
  filters: SearchFilters;
  results: ArticleCard[];
  pageInfo: PageInfo;
}

export interface HomePageData {
  locale: LocaleCode;
  availableLocales: LocaleCode[];
  breaking: ArticleCard[];
  lead?: ArticleCard;
  latest: ArticleCard[];
  trending: ArticleCard[];
  sections: Array<{
    category: CategorySummary;
    lead?: ArticleCard;
    articles: ArticleCard[];
  }>;
  hubHighlights: HubEntry[];
}

export interface CategoryPageData {
  locale: LocaleCode;
  category: CategorySummary;
  lead?: ArticleCard;
  articles: ArticleCard[];
  pageInfo: PageInfo;
}

export interface HubPageData {
  locale: LocaleCode;
  entries: HubEntry[];
  pageInfo: PageInfo;
}

export interface ApiProblem {
  code: string;
  message: string;
  requestId?: string;
  fieldErrors?: Record<string, string>;
}
~~~

## 4. Frontend data gateway

Public Server Components call a server-side gateway interface. During Phase 1, its implementation reads local fictional fixtures. In Phase 2, the same interface reads through authorized server-side data-access modules. Client Components receive only the serializable data needed for their interaction.

~~~ts
export interface PublicContentGateway {
  getHome(locale: LocaleCode): Promise<HomePageData>;
  getCategory(locale: LocaleCode, slug: string, page?: number): Promise<CategoryPageData | null>;
  getArticle(locale: LocaleCode, slug: string): Promise<PublishedArticle | null>;
  search(filters: SearchFilters): Promise<SearchPage>;
  getHubEntry(locale: LocaleCode, slug: string): Promise<HubEntry | null>;
  listHub(locale: LocaleCode, page?: number): Promise<HubPageData>;
}
~~~

The fixture adapter may implement simplified filtering, but it must return the same shapes and visibility rules. Never simulate persistence as if it were real: newsroom mock actions must be labeled as prototypes and must not suggest a story has actually been published.

## 5. Public visibility and localization rules

- Public article and hub methods return published content only. There is no public draft, preview, staff-note, unpublished-media, or role field in these shapes.
- A published translation has its own locale and slug and links to the shared `storyGroupId`. Do not infer that a translation exists from a locale switcher option.
- When no translation exists, route to an available edition or locale landing page and explain the fallback. Do not silently translate or set hreflang for missing translations.
- Corrections are visible data attached to the published story. Material corrections are not represented by silently overwriting the correction history.
- Media URLs in these public shapes point only to cleared, approved deliverables. Cloudinary IDs, upload signatures, API secrets, licensing notes, and internal review status are not public fields.
- Timestamps are UTC ISO strings; presentation localizes them for the reader while retaining an accessible exact timestamp.
- Opinion, analysis, sponsored content, and fact checks retain their explicit labels on cards, search results, metadata, and article pages.

## 6. Page and endpoint mapping

| Frontend view | Gateway method / later data source | Public behavior |
|---|---|---|
| Home | `getHome(locale)` | Editor-selected lead, latest, curated trending, sections, breaking, and hub highlights. |
| Category | `getCategory(locale, slug, page)` | Published category collection with stable pagination. |
| Article | `getArticle(locale, slug)` | Published article with authors, media, sources, correction history, and related stories. |
| Search | `search(filters)` | URL-backed filters and published-only results. |
| Information hub | `listHub(locale, page)` / `getHubEntry(locale, slug)` | Explainers, guides, and fact checks with review date and evidence. |
| About and editorial policy pages | Static, version-controlled content or an approved CMS source | About, contact, editorial standards, corrections, privacy, and terms pages. Do not fill policy pages with invented legal/editorial text. |
| Newsroom prototype | Fixture-only until Phase 2 | No persistence or security claim before authenticated backend is connected. |

The gateway is an internal application boundary, not a promise that every page must use a browser-facing REST endpoint. The server may render pages by calling domain services directly. Any later HTTP response must preserve these shapes or introduce a reviewed versioned contract. Newsletter and live-data routes/modules are outside the initial frontend contract.

## 7. Frontend contract acceptance checks

- Every Phase 1 page and P0 journey maps to a gateway method or an explicitly static content source.
- Fixtures satisfy the TypeScript types and contain no real-looking unverified reporting, personal data, or live values.
- Public data shapes cannot encode draft/preview content or expose staff-only fields.
- Devanagari and Latin content, missing translations, long titles, missing optional media, and corrections have defined UI behavior.
- Backend can replace the fixture adapter without changing page components or weakening publication/access rules.

## 8. Related documents

- [PRD](../product/PRD.md)
- [TRD](TRD.md)
- [System Design](../architecture/SYSTEM_DESIGN.md)
- [Frontend-first implementation plan](../IMPLEMENTATION_PLAN.md)
