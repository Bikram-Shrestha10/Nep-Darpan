import type { LocaleCode, SearchFilters, StoryKind } from "@/lib/content/contracts";
import { FIXTURE_QUERY_MAX_LENGTH } from "@/lib/content/search-fixtures";

export type SearchParamIssue = "duplicate" | "query_too_long" | "invalid_filter" | "invalid_page";
export type SearchParamRecord = Record<string, string | string[] | undefined>;

const categorySlugs = new Set(["society", "economy", "technology", "politics", "world", "opinion"]);
const kinds = new Set<StoryKind>([
  "news",
  "analysis",
  "opinion",
  "explainer",
  "fact_check",
  "guide",
]);

export interface ParsedSearchParams {
  filters: SearchFilters;
  issues: SearchParamIssue[];
  rawQuery: string;
}

export function parseSearchParams(params: SearchParamRecord): ParsedSearchParams {
  const issues: SearchParamIssue[] = [];
  const read = (key: string): string => {
    const value = params[key];
    if (Array.isArray(value)) {
      issues.push("duplicate");
      return "";
    }
    return value ?? "";
  };

  const rawQuery = read("q").trim();
  const rawLocale = read("locale");
  const rawCategory = read("category");
  const rawKind = read("kind");
  const rawSort = read("sort");
  const rawPage = read("page");
  const locale: LocaleCode = rawLocale === "en" ? "en" : "ne-NP";
  const categorySlug = categorySlugs.has(rawCategory) ? rawCategory : undefined;
  const kind = kinds.has(rawKind as StoryKind) ? (rawKind as StoryKind) : undefined;
  const sort = rawSort === "newest" ? "newest" : "relevance";
  const page = rawPage && /^\d+$/u.test(rawPage) && Number(rawPage) > 0 ? Number(rawPage) : 1;

  if (rawQuery.length > FIXTURE_QUERY_MAX_LENGTH) issues.push("query_too_long");
  if (
    (rawLocale && !["ne-NP", "en"].includes(rawLocale)) ||
    (rawCategory && !categorySlug) ||
    (rawKind && !kind) ||
    (rawSort && !["newest", "relevance"].includes(rawSort))
  ) {
    issues.push("invalid_filter");
  }
  if (rawPage && page === 1 && rawPage !== "1") issues.push("invalid_page");

  return {
    rawQuery: rawQuery.slice(0, FIXTURE_QUERY_MAX_LENGTH),
    issues: [...new Set(issues)],
    filters: {
      query: rawQuery.slice(0, FIXTURE_QUERY_MAX_LENGTH),
      locale,
      ...(categorySlug ? { categorySlug } : {}),
      ...(kind ? { kind } : {}),
      sort,
      page,
    },
  };
}
