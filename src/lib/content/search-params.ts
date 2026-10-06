import type { LocaleCode, SearchFilters, StoryKind } from "@/lib/content/contracts";
import { FIXTURE_QUERY_MAX_LENGTH } from "@/lib/content/search-fixtures";

export type SearchParamIssue =
  | "duplicate"
  | "query_too_long"
  | "invalid_filter"
  | "invalid_page"
  | "invalid_date"
  | "invalid_date_range";
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

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1000) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

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
  const rawFrom = read("from");
  const rawTo = read("to");
  const locale: LocaleCode = rawLocale === "en" ? "en" : "ne-NP";
  const categorySlug = categorySlugs.has(rawCategory) ? rawCategory : undefined;
  const kind = kinds.has(rawKind as StoryKind) ? (rawKind as StoryKind) : undefined;
  const sort = rawSort === "newest" ? "newest" : "relevance";
  const page = rawPage && /^\d+$/u.test(rawPage) && Number(rawPage) > 0 ? Number(rawPage) : 1;
  const validFrom = !rawFrom || isCalendarDate(rawFrom);
  const validTo = !rawTo || isCalendarDate(rawTo);
  const validRange = validFrom && validTo && (!rawFrom || !rawTo || rawFrom <= rawTo);

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
  if (!validFrom || !validTo) issues.push("invalid_date");
  if (validFrom && validTo && !validRange) issues.push("invalid_date_range");

  return {
    rawQuery: rawQuery.slice(0, FIXTURE_QUERY_MAX_LENGTH),
    issues: [...new Set(issues)],
    filters: {
      query: rawQuery.slice(0, FIXTURE_QUERY_MAX_LENGTH),
      locale,
      ...(categorySlug ? { categorySlug } : {}),
      ...(kind ? { kind } : {}),
      ...(validRange && rawFrom ? { from: rawFrom } : {}),
      ...(validRange && rawTo ? { to: rawTo } : {}),
      sort,
      page,
    },
  };
}
