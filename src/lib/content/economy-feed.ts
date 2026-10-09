import type { ArticleCard, PageInfo, StoryKind } from "@/lib/content/contracts";
import { FIXTURE_QUERY_MAX_LENGTH } from "@/lib/content/search-fixtures";
import { translateToEnglish } from "@/lib/i18n/english";

export type EconomySort = "newest" | "oldest";
export type EconomyStoryKind = StoryKind;
export type EconomyParamIssue = "duplicate" | "query_too_long" | "invalid_filter" | "invalid_page";
export type EconomySearchParams = Record<string, string | string[] | undefined>;

export interface EconomyFilters {
  query: string;
  kind?: EconomyStoryKind;
  sort: EconomySort;
  page: number;
}

export interface ParsedEconomyParams {
  filters: EconomyFilters;
  issues: EconomyParamIssue[];
}

export interface EconomyFeedPage {
  stories: ArticleCard[];
  pageInfo: PageInfo;
}

export const ECONOMY_PAGE_SIZE = 6;
export const ECONOMY_STORY_KINDS: readonly EconomyStoryKind[] = [
  "news",
  "analysis",
  "opinion",
  "explainer",
  "fact_check",
  "guide",
];

export function parseEconomyParams(params: EconomySearchParams): ParsedEconomyParams {
  const issues: EconomyParamIssue[] = [];
  const read = (key: string) => {
    const value = params[key];
    if (Array.isArray(value)) {
      issues.push("duplicate");
      return "";
    }
    return value ?? "";
  };

  const rawQuery = read("q").trim();
  const rawKind = read("kind");
  const rawSort = read("sort");
  const rawPage = read("page");
  const kind = ECONOMY_STORY_KINDS.includes(rawKind as EconomyStoryKind)
    ? (rawKind as EconomyStoryKind)
    : undefined;
  const sort: EconomySort = rawSort === "oldest" ? "oldest" : "newest";
  const validPage = /^[1-9]\d*$/u.test(rawPage) && Number.isSafeInteger(Number(rawPage));
  const page = validPage ? Number(rawPage) : 1;

  if (rawQuery.length > FIXTURE_QUERY_MAX_LENGTH) issues.push("query_too_long");
  if ((rawKind && !kind) || (rawSort && !["newest", "oldest"].includes(rawSort))) {
    issues.push("invalid_filter");
  }
  if (rawPage && !validPage) issues.push("invalid_page");

  return {
    filters: {
      query: rawQuery.slice(0, FIXTURE_QUERY_MAX_LENGTH),
      ...(kind ? { kind } : {}),
      sort,
      page,
    },
    issues: [...new Set(issues)],
  };
}

export function selectEconomyStories(
  stories: readonly ArticleCard[],
  filters: EconomyFilters,
  pageSize = ECONOMY_PAGE_SIZE,
): EconomyFeedPage {
  const query = filters.query.trim().normalize("NFC").toLocaleLowerCase();
  const matches = stories.filter((story) => {
    if (filters.kind && story.kind !== filters.kind) return false;
    if (!query) return true;
    const searchableText =
      `${story.headline} ${story.summary ?? ""} ${story.category.name} ${translateToEnglish(story.headline)} ${translateToEnglish(story.summary ?? "")} ${translateToEnglish(story.category.name)}`
        .normalize("NFC")
        .toLocaleLowerCase();
    return searchableText.includes(query);
  });

  matches.sort((left, right) => {
    const leftDate = Date.parse(left.updatedAt ?? left.publishedAt);
    const rightDate = Date.parse(right.updatedAt ?? right.publishedAt);
    const difference = leftDate - rightDate;
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
