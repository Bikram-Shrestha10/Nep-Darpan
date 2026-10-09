import type { ArticleCard, CategorySummary } from "@/lib/content/contracts";
import { describe, expect, it } from "vitest";
import {
  parseEconomyParams,
  selectEconomyStories,
  type EconomyFilters,
} from "@/lib/content/economy-feed";

const economy: CategorySummary = {
  id: "economy",
  name: "अर्थतन्त्र",
  slug: "economy",
  locale: "ne-NP",
};

function story(
  id: string,
  headline: string,
  kind: ArticleCard["kind"],
  publishedAt: string,
): ArticleCard {
  return {
    id,
    storyGroupId: id,
    slug: id,
    locale: "ne-NP",
    kind,
    headline,
    summary: "काल्पनिक आर्थिक समाचारको नमुना।",
    href: `/ne-NP/news/${id}`,
    category: economy,
    authors: [],
    publishedAt,
    labels: [],
    hasCorrection: false,
  };
}

const stories = [
  story(
    "budget",
    "काल्पनिक व्याख्या: सार्वजनिक बजेटका मुख्य शीर्षक कसरी बुझ्ने",
    "explainer",
    "2026-10-08T09:00:00.000Z",
  ),
  story("household", "काल्पनिक नमुना: घरपरिवारको खर्च योजना", "guide", "2026-10-07T09:00:00.000Z"),
  story("business", "काल्पनिक नमुना: स्थानीय व्यवसायको खर्च", "news", "2026-10-06T09:00:00.000Z"),
];

describe("economy fixture feed", () => {
  it("matches Nepali and translated English queries and filters by story kind", () => {
    const filters: EconomyFilters = { query: "BUDGET", sort: "newest", page: 1 };
    expect(selectEconomyStories(stories, filters).stories.map((item) => item.id)).toEqual([
      "budget",
    ]);
    expect(
      selectEconomyStories(stories, { ...filters, query: "बजेट" }).stories.map((item) => item.id),
    ).toEqual(["budget"]);
    expect(
      selectEconomyStories(stories, { ...filters, query: "", kind: "guide" }).stories.map(
        (item) => item.id,
      ),
    ).toEqual(["household"]);
  });

  it("sorts oldest first and returns page metadata", () => {
    const result = selectEconomyStories(stories, { query: "", sort: "oldest", page: 2 }, 2);
    expect(result.stories.map((item) => item.id)).toEqual(["budget"]);
    expect(result.pageInfo).toEqual({ page: 2, pageSize: 2, totalItems: 3, totalPages: 2 });
  });

  it("parses supported filters and resets duplicate or invalid URL values", () => {
    expect(parseEconomyParams({ q: "खर्च", kind: "analysis", sort: "oldest", page: "2" })).toEqual({
      filters: { query: "खर्च", kind: "analysis", sort: "oldest", page: 2 },
      issues: [],
    });

    const invalid = parseEconomyParams({
      q: ["first", "second"],
      kind: "unknown",
      sort: "trending",
      page: "0",
    });
    expect(invalid.filters).toEqual({ query: "", sort: "newest", page: 1 });
    expect(invalid.issues).toEqual(
      expect.arrayContaining(["duplicate", "invalid_filter", "invalid_page"]),
    );
  });
});
