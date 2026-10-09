import { describe, expect, it } from "vitest";
import { mockContentGateway } from "@/lib/content/mock-gateway";
import {
  type OpinionFilters,
  parseOpinionParams,
  selectOpinionStories,
} from "@/lib/content/opinion-feed";

async function opinionStories() {
  const page = await mockContentGateway.getCategory("ne-NP", "opinion");
  if (!page) throw new Error("The Opinion fixture category is missing.");
  return page.articles;
}

describe("Opinion fixture feed", () => {
  it("matches Nepali and English searches across opinion topics", async () => {
    const stories = await opinionStories();
    const base: OpinionFilters = { query: "", topic: "all", sort: "newest", page: 1 };

    expect(selectOpinionStories(stories, { ...base, query: "जवाफदेहिता" }).stories[0]?.id).toBe(
      "demo-opinion-accountable-public-decisions",
    );
    expect(
      selectOpinionStories(stories, { ...base, query: "strengthening accountability" }).stories[0]
        ?.id,
    ).toBe("demo-opinion-accountable-public-decisions");
    expect(
      selectOpinionStories(stories, { ...base, query: "sample writer 01" }).stories[0]?.id,
    ).toBe("demo-opinion-accountable-public-decisions");
    expect(
      selectOpinionStories(stories, { ...base, query: "culture and education" }).pageInfo
        .totalItems,
    ).toBe(3);
  });

  it("filters by topic and format, sorts by date, and paginates", async () => {
    const stories = await opinionStories();
    const filtered = selectOpinionStories(
      stories,
      { query: "", topic: "society", kind: "opinion", sort: "newest", page: 1 },
      2,
    );
    expect(filtered.stories.map((story) => story.id)).toEqual([
      "demo-opinion-city-public-space",
      "demo-opinion-public-transport",
    ]);
    expect(filtered.pageInfo).toEqual({ page: 1, pageSize: 2, totalItems: 3, totalPages: 2 });

    const older = selectOpinionStories(
      stories,
      { query: "", topic: "society", kind: "opinion", sort: "oldest", page: 2 },
      2,
    );
    expect(older.stories[0]?.id).toBe("demo-opinion-city-public-space");
  });

  it("parses supported parameters and reports invalid, repeated, and overlong values", () => {
    expect(
      parseOpinionParams({
        q: "समाज",
        topic: "society",
        kind: "analysis",
        sort: "oldest",
        page: "2",
      }),
    ).toEqual({
      filters: { query: "समाज", topic: "society", kind: "analysis", sort: "oldest", page: 2 },
      issues: [],
    });

    const invalid = parseOpinionParams({
      q: ["one", "two"],
      topic: "unknown",
      kind: "news",
      sort: "popular",
      page: "0",
    });
    expect(invalid.filters).toEqual({ query: "", topic: "all", sort: "newest", page: 1 });
    expect(invalid.issues).toEqual(
      expect.arrayContaining(["duplicate", "invalid_topic", "invalid_filter", "invalid_page"]),
    );

    const tooLong = parseOpinionParams({ q: "विचार".repeat(30) });
    expect(tooLong.issues).toContain("query_too_long");
    expect(tooLong.filters.query.length).toBe(120);
  });
});
