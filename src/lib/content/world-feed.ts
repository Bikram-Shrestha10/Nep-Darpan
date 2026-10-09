import type { ArticleCard, PageInfo, StoryKind } from "@/lib/content/contracts";
import { FIXTURE_QUERY_MAX_LENGTH } from "@/lib/content/search-fixtures";
import { translateToEnglish } from "@/lib/i18n/english";

export type WorldSort = "newest" | "oldest";
export type WorldStoryKind = StoryKind;
export type WorldRegion =
  | "all"
  | "south-asia"
  | "asia-pacific"
  | "europe"
  | "africa"
  | "americas"
  | "middle-east"
  | "global";
export type WorldParamIssue =
  | "duplicate"
  | "query_too_long"
  | "invalid_filter"
  | "invalid_page"
  | "invalid_region";
export type WorldSearchParams = Record<string, string | string[] | undefined>;

export interface WorldFilters {
  query: string;
  region: WorldRegion;
  kind?: WorldStoryKind;
  sort: WorldSort;
  page: number;
}

export interface ParsedWorldParams {
  filters: WorldFilters;
  issues: WorldParamIssue[];
}

export interface WorldFeedPage {
  stories: ArticleCard[];
  pageInfo: PageInfo;
}

export const WORLD_PAGE_SIZE = 6;
export const WORLD_STORY_KINDS: readonly WorldStoryKind[] = [
  "news",
  "analysis",
  "opinion",
  "explainer",
  "fact_check",
  "guide",
];

export const WORLD_REGIONS: ReadonlyArray<{
  slug: WorldRegion;
  ne: string;
  en: string;
}> = [
  { slug: "all", ne: "सबै क्षेत्र", en: "All regions" },
  { slug: "south-asia", ne: "दक्षिण एसिया", en: "South Asia" },
  { slug: "asia-pacific", ne: "एसिया प्रशान्त", en: "Asia Pacific" },
  { slug: "europe", ne: "युरोप", en: "Europe" },
  { slug: "africa", ne: "अफ्रिका", en: "Africa" },
  { slug: "americas", ne: "अमेरिका", en: "Americas" },
  { slug: "middle-east", ne: "मध्यपूर्व", en: "Middle East" },
  { slug: "global", ne: "विश्व डेस्क", en: "Global desk" },
];

const storyRegions: Readonly<Record<string, Exclude<WorldRegion, "all">>> = {
  "demo-story-005": "global",
  "demo-section-world-02": "south-asia",
  "demo-world-city-resilience": "asia-pacific",
  "demo-world-himalayan-information": "south-asia",
  "demo-world-border-reporting-guide": "europe",
  "demo-world-library-cooperation": "africa",
  "demo-world-technology-dialogue": "americas",
  "demo-world-water-context": "middle-east",
  "demo-world-source-guide": "global",
  "demo-world-student-exchange": "south-asia",
};

export function getWorldRegion(story: ArticleCard): Exclude<WorldRegion, "all"> {
  return storyRegions[story.id] ?? "global";
}

export function parseWorldParams(params: WorldSearchParams): ParsedWorldParams {
  const issues: WorldParamIssue[] = [];
  const read = (key: string) => {
    const value = params[key];
    if (Array.isArray(value)) {
      issues.push("duplicate");
      return "";
    }
    return value ?? "";
  };

  const rawQuery = read("q").trim();
  const rawRegion = read("region");
  const rawKind = read("kind");
  const rawSort = read("sort");
  const rawPage = read("page");
  const region = WORLD_REGIONS.some((item) => item.slug === rawRegion)
    ? (rawRegion as WorldRegion)
    : "all";
  const kind = WORLD_STORY_KINDS.includes(rawKind as WorldStoryKind)
    ? (rawKind as WorldStoryKind)
    : undefined;
  const sort: WorldSort = rawSort === "oldest" ? "oldest" : "newest";
  const validPage = /^[1-9]\d*$/u.test(rawPage) && Number.isSafeInteger(Number(rawPage));
  const page = validPage ? Number(rawPage) : 1;

  if (rawQuery.length > FIXTURE_QUERY_MAX_LENGTH) issues.push("query_too_long");
  if (rawRegion && region === "all") issues.push("invalid_region");
  if ((rawKind && !kind) || (rawSort && !["newest", "oldest"].includes(rawSort))) {
    issues.push("invalid_filter");
  }
  if (rawPage && !validPage) issues.push("invalid_page");

  return {
    filters: {
      query: rawQuery.slice(0, FIXTURE_QUERY_MAX_LENGTH),
      region,
      ...(kind ? { kind } : {}),
      sort,
      page,
    },
    issues: [...new Set(issues)],
  };
}

export function selectWorldStories(
  stories: readonly ArticleCard[],
  filters: WorldFilters,
  pageSize = WORLD_PAGE_SIZE,
): WorldFeedPage {
  const query = filters.query.trim().normalize("NFC").toLocaleLowerCase();
  const matches = stories.filter((story) => {
    if (filters.kind && story.kind !== filters.kind) return false;
    if (filters.region !== "all" && getWorldRegion(story) !== filters.region) return false;
    if (!query) return true;
    const searchableText =
      `${story.headline} ${story.summary ?? ""} ${story.category.name} ${translateToEnglish(story.headline)} ${translateToEnglish(story.summary ?? "")} ${translateToEnglish(story.category.name)} ${WORLD_REGIONS.find((region) => region.slug === getWorldRegion(story))?.en ?? ""}`
        .normalize("NFC")
        .toLocaleLowerCase();
    return searchableText.includes(query);
  });

  matches.sort((left, right) => {
    const difference =
      Date.parse(left.updatedAt ?? left.publishedAt) -
      Date.parse(right.updatedAt ?? right.publishedAt);
    if (difference === 0) return left.id.localeCompare(right.id);
    return filters.sort === "newest" ? -difference : difference;
  });

  const totalItems = matches.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const page = Math.min(filters.page, Math.max(totalPages, 1));
  const pageInfo: PageInfo = { page, pageSize, totalItems, totalPages };
  const offset = (page - 1) * pageSize;
  return { stories: matches.slice(offset, offset + pageSize), pageInfo };
}
