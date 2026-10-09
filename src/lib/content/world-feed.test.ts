import { describe, expect, it } from "vitest";
import { mockContentGateway } from "@/lib/content/mock-gateway";
import { parseWorldParams, selectWorldStories, type WorldFilters } from "@/lib/content/world-feed";

async function worldStories() {
  const page = await mockContentGateway.getCategory("ne-NP", "world");
  if (!page) throw new Error("The World fixture category is missing.");
  return page.articles;
}

describe("World fixture feed", () => {
  it("matches Nepali and English searches across sample headlines and regions", async () => {
    const stories = await worldStories();
    const base: WorldFilters = { query: "", region: "all", sort: "newest", page: 1 };

    expect(selectWorldStories(stories, { ...base, query: "हिमाली" }).stories[0]?.id).toBe(
      "demo-world-himalayan-information",
    );
    expect(selectWorldStories(stories, { ...base, query: "Himalayan" }).stories[0]?.id).toBe(
      "demo-world-himalayan-information",
    );
    expect(selectWorldStories(stories, { ...base, query: "South Asia" }).pageInfo.totalItems).toBe(
      3,
    );
    expect(selectWorldStories(stories, { ...base, query: "fact-check" }).pageInfo.totalItems).toBe(
      2,
    );
  });

  it("filters by region and kind, orders results, and paginates", async () => {
    const stories = await worldStories();
    const result = selectWorldStories(
      stories,
      { query: "", region: "south-asia", kind: "news", sort: "oldest", page: 1 },
      1,
    );

    expect(result.stories).toHaveLength(1);
    expect(result.stories[0]?.id).toBe("demo-section-world-02");
    expect(result.pageInfo).toEqual({ page: 1, pageSize: 1, totalItems: 2, totalPages: 2 });

    const regionResults = selectWorldStories(
      stories,
      {
        query: "",
        region: "south-asia",
        sort: "oldest",
        page: 2,
      },
      1,
    );
    expect(regionResults.pageInfo).toMatchObject({ page: 2, totalItems: 3, totalPages: 3 });
    expect(regionResults.stories).toHaveLength(1);
    expect(regionResults.stories[0]?.id).toBe("demo-world-student-exchange");
  });

  it("parses valid parameters and reports repeated, invalid, and overlong values", () => {
    expect(
      parseWorldParams({
        q: "हिमाल",
        region: "south-asia",
        kind: "analysis",
        sort: "oldest",
        page: "2",
      }),
    ).toEqual({
      filters: {
        query: "हिमाल",
        region: "south-asia",
        kind: "analysis",
        sort: "oldest",
        page: 2,
      },
      issues: [],
    });

    const invalid = parseWorldParams({
      q: ["first", "second"],
      region: "antarctica",
      kind: "unknown",
      sort: "popular",
      page: "0",
    });
    expect(invalid.filters).toEqual({ query: "", region: "all", sort: "newest", page: 1 });
    expect(invalid.issues).toEqual(
      expect.arrayContaining(["duplicate", "invalid_region", "invalid_filter", "invalid_page"]),
    );

    const longQuery = parseWorldParams({ q: "समाचार".repeat(30) });
    expect(longQuery.issues).toContain("query_too_long");
    expect(longQuery.filters.query.length).toBe(120);
  });
});
