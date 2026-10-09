import type { ArticleCard, CategorySummary } from "@/lib/content/contracts";
import { describe, expect, it } from "vitest";
import {
  parsePoliticsParams,
  selectPoliticsStories,
  type PoliticsFilters,
} from "@/lib/content/politics-feed";

const politics: CategorySummary = {
  id: "politics",
  name: "राजनीति",
  slug: "politics",
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
    summary: "यो काल्पनिक राजनीति नमुना हो।",
    href: `/ne-NP/news/${id}`,
    category: politics,
    authors: [],
    publishedAt,
    labels: [],
    hasCorrection: false,
  };
}

const stories = [
  story(
    "policy-new",
    "काल्पनिक नमुना: स्थानीय बजेट प्रस्तावमा नागरिक सुझाव संकलन",
    "news",
    "2026-10-05T09:00:00.000Z",
  ),
  story(
    "federal-analysis",
    "काल्पनिक विश्लेषण नमुना: संघीय तहबीच सार्वजनिक सेवा समन्वय",
    "analysis",
    "2026-10-04T09:00:00.000Z",
  ),
  story(
    "accountability-opinion",
    "काल्पनिक विचार नमुना: सार्वजनिक निर्णयमा जवाफदेहिताको भूमिका",
    "opinion",
    "2026-10-03T09:00:00.000Z",
  ),
];

describe("politics fixture feed", () => {
  it("matches Nepali and translated English queries and filters by story kind", () => {
    const filters: PoliticsFilters = { query: "  BUDGET  ", sort: "newest", page: 1 };
    expect(selectPoliticsStories(stories, filters).stories.map((story) => story.id)).toEqual([
      "policy-new",
    ]);
    expect(
      selectPoliticsStories(stories, { ...filters, query: "समन्वय" }).stories.map(
        (story) => story.id,
      ),
    ).toEqual(["federal-analysis"]);
    expect(
      selectPoliticsStories(stories, { ...filters, query: "", kind: "analysis" }).stories.map(
        (story) => story.id,
      ),
    ).toEqual(["federal-analysis"]);
  });

  it("sorts oldest first and returns URL pagination details", () => {
    const result = selectPoliticsStories(stories, { query: "", sort: "oldest", page: 2 }, 2);
    expect(result.stories.map((story) => story.id)).toEqual(["policy-new"]);
    expect(result.pageInfo).toEqual({ page: 2, pageSize: 2, totalItems: 3, totalPages: 2 });
  });

  it("parses supported filters and resets repeated or invalid URL values", () => {
    expect(parsePoliticsParams({ q: "कानून", kind: "analysis", sort: "oldest", page: "2" })).toEqual(
      {
        filters: { query: "कानून", kind: "analysis", sort: "oldest", page: 2 },
        issues: [],
      },
    );

    const invalid = parsePoliticsParams({
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
