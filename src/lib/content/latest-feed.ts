import type { ArticleCard, PageInfo } from "@/lib/content/contracts";
import { FIXTURE_QUERY_MAX_LENGTH } from "@/lib/content/search-fixtures";
import { translateToEnglish } from "@/lib/i18n/english";

export type LatestSort = "newest" | "oldest";

export interface LatestFilters {
  query: string;
  categorySlug?: string;
  sort: LatestSort;
  page: number;
}

export type LatestParamIssue = "duplicate" | "query_too_long" | "invalid_filter" | "invalid_page";
export type LatestSearchParamRecord = Record<string, string | string[] | undefined>;

export interface ParsedLatestParams {
  filters: LatestFilters;
  issues: LatestParamIssue[];
}

export interface LatestFeedResult {
  stories: ArticleCard[];
  pageInfo: PageInfo;
}

export const LATEST_PAGE_SIZE = 6;

export function parseLatestParams(
  params: LatestSearchParamRecord,
  categorySlugs: readonly string[],
): ParsedLatestParams {
  const issues: LatestParamIssue[] = [];
  const read = (key: string) => {
    const value = params[key];
    if (Array.isArray(value)) {
      issues.push("duplicate");
      return "";
    }
    return value ?? "";
  };

  const rawQuery = read("q").trim();
  const rawCategory = read("category");
  const rawSort = read("sort");
  const rawPage = read("page");
  const categorySlug = categorySlugs.includes(rawCategory) ? rawCategory : undefined;
  const sort: LatestSort = rawSort === "oldest" ? "oldest" : "newest";
  const validPage = /^\d+$/u.test(rawPage) && Number.isSafeInteger(Number(rawPage));
  const page = validPage && Number(rawPage) > 0 ? Number(rawPage) : 1;

  if (rawQuery.length > FIXTURE_QUERY_MAX_LENGTH) issues.push("query_too_long");
  if ((rawCategory && !categorySlug) || (rawSort && !["newest", "oldest"].includes(rawSort))) {
    issues.push("invalid_filter");
  }
  if (rawPage && (!validPage || (page === 1 && rawPage !== "1"))) issues.push("invalid_page");

  return {
    filters: {
      query: rawQuery.slice(0, FIXTURE_QUERY_MAX_LENGTH),
      ...(categorySlug ? { categorySlug } : {}),
      sort,
      page,
    },
    issues: [...new Set(issues)],
  };
}

export function collectLatestStories(
  latest: readonly ArticleCard[],
  sections: readonly { articles: readonly ArticleCard[] }[],
): ArticleCard[] {
  const storiesById = new Map<string, ArticleCard>();
  for (const story of [...latest, ...sections.flatMap((section) => section.articles)]) {
    if (!storiesById.has(story.id)) storiesById.set(story.id, story);
  }
  return [...storiesById.values()];
}

export function selectLatestStories(
  stories: readonly ArticleCard[],
  filters: LatestFilters,
  pageSize = LATEST_PAGE_SIZE,
): LatestFeedResult {
  const query = filters.query.trim().normalize("NFC").toLocaleLowerCase();
  const matches = stories.filter((story) => {
    if (filters.categorySlug && story.category.slug !== filters.categorySlug) return false;
    if (!query) return true;

    const searchableText =
      `${story.headline} ${story.summary ?? ""} ${story.category.name} ${translateToEnglish(story.headline)} ${translateToEnglish(story.summary ?? "")} ${translateToEnglish(story.category.name)}`
        .normalize("NFC")
        .toLocaleLowerCase();
    return searchableText.includes(query);
  });

  matches.sort((left, right) => {
    const difference = Date.parse(left.publishedAt) - Date.parse(right.publishedAt);
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
