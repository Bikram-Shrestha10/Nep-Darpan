export type LocaleCode = "ne-NP" | "en";

export type StoryKind = "news" | "analysis" | "opinion" | "explainer" | "fact_check" | "guide";

export type EditorialLabel = "breaking" | "opinion" | "analysis" | "fact_check" | "sponsored";

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  locale: LocaleCode;
}

export interface AuthorSummary {
  id: string;
  name: string;
  slug: string;
  roleLabel?: string;
  biography?: string;
  portrait?: ImageMedia;
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
  // Validate as a safe http(s) URL before rendering external links.
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
  from?: string; // inclusive calendar date in Asia/Kathmandu (YYYY-MM-DD)
  to?: string; // inclusive calendar date in Asia/Kathmandu; must not precede from
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

export interface PublicContentGateway {
  listCategories(locale: LocaleCode): Promise<CategorySummary[]>;
  getHome(locale: LocaleCode): Promise<HomePageData>;
  getCategory(locale: LocaleCode, slug: string, page?: number): Promise<CategoryPageData | null>;
  getArticle(locale: LocaleCode, slug: string): Promise<PublishedArticle | null>;
  search(filters: SearchFilters): Promise<SearchPage>;
  getHubEntry(locale: LocaleCode, slug: string): Promise<HubEntry | null>;
  listHub(locale: LocaleCode, page?: number, kind?: HubEntry["kind"]): Promise<HubPageData>;
}
