import { describe, expect, it } from "vitest";
import { mockContentGateway } from "@/lib/content/mock-gateway";
import {
  parseTechnologyParams,
  selectTechnologyStories,
  type TechnologyFilters,
} from "@/lib/content/technology-feed";

async function technologyStories() {
  const page = await mockContentGateway.getCategory("ne-NP", "technology");
  if (!page) throw new Error("The Technology fixture category is missing.");
  return page.articles;
}

describe("Technology fixture feed", () => {
  it("matches Nepali and English topic searches", async () => {
    const stories = await technologyStories();
    const base: TechnologyFilters = { query: "", topic: "all", sort: "newest", page: 1 };

    expect(selectTechnologyStories(stories, { ...base, query: "नेपाली भाषा" }).stories[0]?.id).toBe(
      "demo-technology-language-ai",
    );
    expect(
      selectTechnologyStories(stories, { ...base, query: "privacy notice" }).stories[0]?.id,
    ).toBe("demo-technology-privacy-controls-guide");
    expect(
      selectTechnologyStories(stories, { ...base, query: "AI and algorithms" }).pageInfo.totalItems,
    ).toBe(3);
  });

  it("filters by topic and kind, sorts by date, and paginates", async () => {
    const stories = await technologyStories();
    const filtered = selectTechnologyStories(
      stories,
      { query: "", topic: "ai", kind: "explainer", sort: "newest", page: 1 },
      1,
    );
    expect(filtered.stories.map((story) => story.id)).toEqual([
      "demo-technology-recommendation-explainer",
    ]);
    expect(filtered.pageInfo).toEqual({ page: 1, pageSize: 1, totalItems: 1, totalPages: 1 });

    const connectivity = selectTechnologyStories(
      stories,
      { query: "", topic: "connectivity", sort: "oldest", page: 2 },
      1,
    );
    expect(connectivity.pageInfo).toMatchObject({ page: 2, totalItems: 2, totalPages: 2 });
    expect(connectivity.stories[0]?.id).toBe("demo-technology-rural-connectivity");
  });

  it("parses supported query parameters and reports invalid or repeated values", () => {
    expect(
      parseTechnologyParams({
        q: "एआई",
        topic: "ai",
        kind: "analysis",
        sort: "oldest",
        page: "2",
      }),
    ).toEqual({
      filters: { query: "एआई", topic: "ai", kind: "analysis", sort: "oldest", page: 2 },
      issues: [],
    });

    const invalid = parseTechnologyParams({
      q: ["one", "two"],
      topic: "unknown",
      kind: "unsupported",
      sort: "popular",
      page: "0",
    });
    expect(invalid.filters).toEqual({ query: "", topic: "all", sort: "newest", page: 1 });
    expect(invalid.issues).toEqual(
      expect.arrayContaining(["duplicate", "invalid_topic", "invalid_filter", "invalid_page"]),
    );

    const longQuery = parseTechnologyParams({ q: "प्रविधि".repeat(30) });
    expect(longQuery.issues).toContain("query_too_long");
    expect(longQuery.filters.query.length).toBe(120);
  });
});
