import { describe, expect, it } from "vitest";
import type { SearchFilters } from "@/lib/content/contracts";
import { mockContentGateway } from "@/lib/content/mock-gateway";
import { normalizeSearchText, searchFixtureStories } from "@/lib/content/search-fixtures";
import { parseSearchParams } from "@/lib/content/search-params";

const baseFilters: SearchFilters = {
  query: "",
  locale: "ne-NP",
  sort: "relevance",
  page: 1,
};

describe("fictional search adapter", () => {
  it("matches Nepali query words when punctuation is attached", async () => {
    const result = await mockContentGateway.search({ ...baseFilters, query: "डिजिटल!" });
    expect(result.pageInfo.totalItems).toBeGreaterThan(0);
    expect(result.results.some((article) => article.headline.includes("डिजिटल"))).toBe(true);
  });

  it("normalizes Unicode, case, punctuation, and repeated whitespace", () => {
    expect(normalizeSearchText("  DIGITAL—Opinion!!  ")).toBe("digital opinion");
    expect(normalizeSearchText("नमुना, समाचार।")).toBe("नमुना समाचार");
  });

  it("supports English search terms for English editorial kind labels", async () => {
    const result = await mockContentGateway.search({ ...baseFilters, query: "opinion" });
    expect(result.results.map((article) => article.slug)).toContain("demo-opinion");
  });

  it("matches English queries against the labeled English preview of Nepali fixtures", async () => {
    const result = await mockContentGateway.search({ ...baseFilters, query: "library" });
    expect(result.results.map((article) => article.slug)).toContain("demo-story");
  });

  it("applies category, content kind, and locale filters", async () => {
    const categoryResults = await mockContentGateway.search({
      ...baseFilters,
      categorySlug: "economy",
    });
    expect(categoryResults.results.every((article) => article.category.slug === "economy")).toBe(
      true,
    );
    const combined = await mockContentGateway.search({
      ...baseFilters,
      categorySlug: "economy",
      kind: "fact_check",
    });
    expect(combined.pageInfo.totalItems).toBe(1);
    const english = await mockContentGateway.search({
      ...baseFilters,
      query: "opinion",
      locale: "en",
    });
    expect(english.results).toEqual([]);
    expect(english.pageInfo.totalItems).toBe(0);
  });

  it("filters inclusively by Kathmandu calendar date, including date-only searches", async () => {
    const result = await mockContentGateway.search({
      ...baseFilters,
      from: "2026-10-05",
      to: "2026-10-05",
    });
    // Opinion preview fixtures also appear in the all-site search date window.
    expect(result.pageInfo.totalItems).toBe(5);
    expect(result.filters).toMatchObject({ from: "2026-10-05", to: "2026-10-05" });
    expect(result.results.every((story) => story.publishedAt.slice(0, 10) === "2026-10-05")).toBe(
      true,
    );
  });

  it("uses Kathmandu rather than UTC day boundaries for date filters", async () => {
    const fixture = await mockContentGateway.getArticle("ne-NP", "demo-story");
    expect(fixture).not.toBeNull();
    if (!fixture) throw new Error("Expected a fictional article fixture");
    const nearMidnight = { ...fixture, publishedAt: "2026-10-04T18:30:00.000Z" };
    const result = searchFixtureStories([nearMidnight], {
      ...baseFilters,
      from: "2026-10-05",
      to: "2026-10-05",
    });
    expect(result.results).toHaveLength(1);
  });

  it("sorts newest first and paginates without dropping filters", async () => {
    const first = await mockContentGateway.search({
      ...baseFilters,
      query: "नमुना",
      sort: "newest",
    });
    const second = await mockContentGateway.search({
      ...baseFilters,
      query: "नमुना",
      sort: "newest",
      page: 2,
    });
    expect(first.pageInfo.totalPages).toBe(
      Math.ceil(first.pageInfo.totalItems / first.pageInfo.pageSize),
    );
    expect(first.results).toHaveLength(3);
    const publishedTimes = first.results.map((article) => Date.parse(article.publishedAt));
    expect(publishedTimes).toEqual([...publishedTimes].sort((left, right) => right - left));
    expect(second.filters.query).toBe("नमुना");
    expect(second.filters.sort).toBe("newest");
    expect(second.pageInfo.page).toBe(2);
    expect(second.results).toHaveLength(3);
    const overflow = await mockContentGateway.search({ ...baseFilters, query: "नमुना", page: 99 });
    expect(overflow.pageInfo.page).toBe(overflow.pageInfo.totalPages);
  });

  it("returns no hits for empty punctuation and oversized query input", async () => {
    const punctuation = await mockContentGateway.search({ ...baseFilters, query: "!!!" });
    const oversized = await mockContentGateway.search({ ...baseFilters, query: "क".repeat(121) });
    expect(punctuation.results).toEqual([]);
    expect(oversized.results).toEqual([]);
  });
});

describe("search URL state parser", () => {
  it("preserves valid URL backed query, filters, locale, sort, and page", () => {
    const parsed = parseSearchParams({
      q: "डिजिटल",
      category: "technology",
      kind: "news",
      locale: "ne-NP",
      sort: "newest",
      page: "2",
      from: "2026-10-02",
      to: "2026-10-05",
    });
    expect(parsed.issues).toEqual([]);
    expect(parsed.filters).toMatchObject({
      query: "डिजिटल",
      categorySlug: "technology",
      kind: "news",
      locale: "ne-NP",
      sort: "newest",
      page: 2,
      from: "2026-10-02",
      to: "2026-10-05",
    });
  });

  it("rejects duplicate, invalid, and oversized URL input safely", () => {
    const parsed = parseSearchParams({
      q: ["one", "two"],
      category: "secret",
      page: "-1",
      sort: "random",
      locale: "fr",
    });
    expect(parsed.issues).toContain("duplicate");
    expect(parsed.issues).toContain("invalid_filter");
    expect(parsed.issues).toContain("invalid_page");
    expect(parsed.filters.categorySlug).toBeUndefined();
    expect(parsed.filters.page).toBe(1);
    expect(parseSearchParams({ q: "x".repeat(140) }).issues).toContain("query_too_long");
  });

  it("rejects invalid dates and reversed date ranges", () => {
    const invalidDate = parseSearchParams({ from: "2026-02-30" });
    expect(invalidDate.issues).toContain("invalid_date");
    expect(invalidDate.filters.from).toBeUndefined();

    const reversed = parseSearchParams({ from: "2026-10-06", to: "2026-10-05" });
    expect(reversed.issues).toContain("invalid_date_range");
    expect(reversed.filters.from).toBeUndefined();
    expect(reversed.filters.to).toBeUndefined();
  });
});
