import type { ArticleCard, SearchFilters, SearchPage, StoryKind } from "@/lib/content/contracts";
import { translateToEnglish } from "@/lib/i18n/english";

export const FIXTURE_SEARCH_PAGE_SIZE = 3;
export const FIXTURE_QUERY_MAX_LENGTH = 120;

const searchableKinds: StoryKind[] = [
  "news",
  "analysis",
  "opinion",
  "explainer",
  "fact_check",
  "guide",
];

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFC")
    .toLocaleLowerCase("ne-NP")
    .replace(/[\p{P}\p{S}\p{C}]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function kathmanduCalendarDate(value: string): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function score(article: ArticleCard, terms: string[]): number {
  const headline = normalizeSearchText(article.headline);
  const headlineEn = normalizeSearchText(translateToEnglish(article.headline));
  const summary = normalizeSearchText(article.summary ?? "");
  const summaryEn = normalizeSearchText(translateToEnglish(article.summary ?? ""));
  const category = normalizeSearchText(article.category.name);
  const categoryEn = normalizeSearchText(translateToEnglish(article.category.name));
  const authors = normalizeSearchText(article.authors.map((author) => author.name).join(" "));
  const authorsEn = normalizeSearchText(
    article.authors.map((author) => translateToEnglish(author.name)).join(" "),
  );
  return terms.reduce((total, term) => {
    if (headline.includes(term) || headlineEn.includes(term)) return total + 5;
    if (summary.includes(term) || summaryEn.includes(term)) return total + 2;
    if (
      category.includes(term) ||
      categoryEn.includes(term) ||
      authors.includes(term) ||
      authorsEn.includes(term)
    ) {
      return total + 1;
    }
    return total;
  }, 0);
}

export function searchFixtureStories(articles: ArticleCard[], filters: SearchFilters): SearchPage {
  const query = filters.query.trim();
  const normalizedQuery = normalizeSearchText(query);
  const terms = normalizedQuery.split(" ").filter(Boolean);
  const hasFilters = Boolean(
    query || filters.categorySlug || filters.kind || filters.from || filters.to,
  );
  const validKind = !filters.kind || searchableKinds.includes(filters.kind);

  let matches = articles.filter((article) => {
    if (article.locale !== filters.locale) return false;
    if (!validKind) return false;
    if (filters.categorySlug && article.category.slug !== filters.categorySlug) return false;
    if (filters.kind && article.kind !== filters.kind) return false;
    const publishedDate = kathmanduCalendarDate(article.publishedAt);
    if (filters.from && publishedDate < filters.from) return false;
    if (filters.to && publishedDate > filters.to) return false;
    if (!hasFilters) return false;
    if (query.length > FIXTURE_QUERY_MAX_LENGTH || (query && !terms.length)) return false;
    const originalFields = [
      article.headline,
      article.summary,
      article.category.name,
      article.kind.replaceAll("_", " "),
      ...article.authors.map((author) => author.name),
    ].filter((field): field is string => Boolean(field));
    // The Nepali fixture edition has an English UI preview. Let readers search
    // those preview translations without presenting them as a separate English edition.
    const indexedFields =
      filters.locale === "ne-NP"
        ? [...originalFields, ...originalFields.map((field) => translateToEnglish(field))]
        : originalFields;
    const indexed = normalizeSearchText(indexedFields.join(" "));
    return terms.every((term) => indexed.includes(term));
  });

  if (filters.sort === "newest") {
    matches = matches.toSorted(
      (left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt),
    );
  } else if (terms.length) {
    matches = matches.toSorted((left, right) => score(right, terms) - score(left, terms));
  } else {
    matches = matches.toSorted(
      (left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt),
    );
  }

  const totalItems = matches.length;
  const totalPages = Math.ceil(totalItems / FIXTURE_SEARCH_PAGE_SIZE);
  const page = Math.max(1, Math.min(filters.page, Math.max(1, totalPages)));
  const start = (page - 1) * FIXTURE_SEARCH_PAGE_SIZE;
  return {
    filters: { ...filters, page },
    results: matches.slice(start, start + FIXTURE_SEARCH_PAGE_SIZE),
    pageInfo: { page, pageSize: FIXTURE_SEARCH_PAGE_SIZE, totalItems, totalPages },
  };
}
