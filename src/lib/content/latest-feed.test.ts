import type { ArticleCard, CategorySummary } from "@/lib/content/contracts";
import { describe, expect, it } from "vitest";
import {
  collectLatestStories,
  parseLatestParams,
  selectLatestStories,
  type LatestFilters,
} from "@/lib/content/latest-feed";

const economy: CategorySummary = {
  id: "economy",
  name: "अर्थतन्त्र",
  slug: "economy",
  locale: "ne-NP",
};
const society: CategorySummary = {
  id: "society",
  name: "समाज",
  slug: "society",
  locale: "ne-NP",
};

function story(id: string, headline: string, category: CategorySummary, publishedAt: string) {
  return {
    id,
    storyGroupId: id,
    slug: id,
    locale: "ne-NP",
    kind: "news",
    headline,
    summary: "यो काल्पनिक नमुना हो।",
    href: `/ne-NP/news/${id}`,
    category,
    authors: [],
    publishedAt,
    labels: [],
    hasCorrection: false,
  } satisfies ArticleCard;
}

const stories = [
  story(
    "older-economy",
    "काल्पनिक नमुना: स्थानीय पुस्तकालयमा डिजिटल पठन कक्ष सुरु",
    economy,
    "2026-10-01T08:00:00.000Z",
  ),
  story("newer-society", "पुस्तकालय नमुना", society, "2026-10-03T08:00:00.000Z"),
  story(
    "newest-economy",
    "काल्पनिक नमुना: साना व्यवसायका लागि डिजिटल भुक्तानीको बदलिँदो प्रयोग",
    economy,
    "2026-10-05T08:00:00.000Z",
  ),
];

describe("latest feed fixtures", () => {
  it("merges homepage and section stories without duplicating story IDs", () => {
    const combined = collectLatestStories(stories.slice(0, 2), [
      { articles: [stories[1], stories[2]] },
    ]);

    expect(combined.map((item) => item.id)).toEqual([
      "older-economy",
      "newer-society",
      "newest-economy",
    ]);
  });

  it("filters headlines by normalized query and category", () => {
    const filters: LatestFilters = {
      query: "  LIBRARY  ",
      categorySlug: "economy",
      sort: "newest",
      page: 1,
    };

    expect(selectLatestStories(stories, filters).stories.map((item) => item.id)).toEqual([
      "older-economy",
    ]);
    expect(
      selectLatestStories(stories, { ...filters, query: "पठन" }).stories.map((item) => item.id),
    ).toEqual(["older-economy"]);

    expect(
      selectLatestStories(stories, { ...filters, query: "SMALL BUSINESSES ADAPT" }).stories.map(
        (item) => item.id,
      ),
    ).toEqual(["newest-economy"]);
  });

  it("sorts old-to-new and paginates the URL-backed result list", () => {
    const result = selectLatestStories(stories, { query: "", sort: "oldest", page: 2 }, 2);

    expect(result.stories.map((item) => item.id)).toEqual(["newest-economy"]);
    expect(result.pageInfo).toEqual({ page: 2, pageSize: 2, totalItems: 3, totalPages: 2 });
  });

  it("clamps unavailable pages and returns a clear empty-page contract", () => {
    const result = selectLatestStories(
      stories,
      { query: "no matching sample", sort: "newest", page: 4 },
      2,
    );

    expect(result.stories).toEqual([]);
    expect(result.pageInfo).toEqual({ page: 1, pageSize: 2, totalItems: 0, totalPages: 0 });
  });

  it("accepts supported URL filters and reports malformed or repeated values", () => {
    expect(
      parseLatestParams({ q: "book", category: "society", sort: "oldest", page: "2" }, [
        "society",
        "economy",
      ]),
    ).toEqual({
      filters: { query: "book", categorySlug: "society", sort: "oldest", page: 2 },
      issues: [],
    });

    const invalid = parseLatestParams(
      { q: ["one", "two"], category: "unknown", sort: "soonest", page: "nope" },
      ["society", "economy"],
    );
    expect(invalid.filters).toEqual({ query: "", sort: "newest", page: 1 });
    expect(invalid.issues).toEqual(
      expect.arrayContaining(["duplicate", "invalid_filter", "invalid_page"]),
    );
  });
});
