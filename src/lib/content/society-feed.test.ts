import { describe, expect, it } from "vitest";
import { mockContentGateway } from "@/lib/content/mock-gateway";
import {
  parseSocietyParams,
  selectSocietyStories,
  type SocietyFilters,
} from "@/lib/content/society-feed";

async function societyStories() {
  const page = await mockContentGateway.getCategory("ne-NP", "society");
  if (!page) throw new Error("The society fixture category is missing.");
  return page.articles;
}

describe("society fixture feed", () => {
  it("matches Nepali and English topic searches for the fictional stories", async () => {
    const stories = await societyStories();
    const base: SocietyFilters = { query: "", sort: "newest", page: 1 };

    expect(selectSocietyStories(stories, { ...base, query: "शिक्षा" }).stories[0]?.id).toBe(
      "demo-society-school-family-dialogue",
    );
    expect(selectSocietyStories(stories, { ...base, query: "education" }).stories[0]?.id).toBe(
      "demo-society-school-family-dialogue",
    );
    expect(selectSocietyStories(stories, { ...base, query: "health" }).stories[0]?.id).toBe(
      "demo-society-health-access-analysis",
    );
    expect(selectSocietyStories(stories, { ...base, query: "accessible" }).stories[0]?.id).toBe(
      "demo-society-accessibility-guide",
    );
    expect(
      selectSocietyStories(stories, { ...base, query: "community" }).pageInfo.totalItems,
    ).toBeGreaterThan(0);
  });

  it("filters by kind, sorts by publication date, and paginates", async () => {
    const stories = await societyStories();
    const result = selectSocietyStories(
      stories,
      { query: "", kind: "guide", sort: "oldest", page: 2 },
      1,
    );
    expect(result.stories.map((story) => story.id)).toEqual(["demo-society-accessibility-guide"]);
    expect(result.pageInfo).toEqual({ page: 2, pageSize: 1, totalItems: 2, totalPages: 2 });
  });

  it("parses supported parameters and reports malformed, repeated, or long values", () => {
    expect(parseSocietyParams({ q: "समुदाय", kind: "analysis", sort: "oldest", page: "2" })).toEqual(
      {
        filters: { query: "समुदाय", kind: "analysis", sort: "oldest", page: 2 },
        issues: [],
      },
    );

    const invalid = parseSocietyParams({
      q: ["first", "second"],
      kind: "unknown",
      sort: "popular",
      page: "0",
    });
    expect(invalid.filters).toEqual({ query: "", sort: "newest", page: 1 });
    expect(invalid.issues).toEqual(
      expect.arrayContaining(["duplicate", "invalid_filter", "invalid_page"]),
    );

    const longQuery = parseSocietyParams({ q: "समाज".repeat(40) });
    expect(longQuery.issues).toContain("query_too_long");
    expect(longQuery.filters.query.length).toBe(120);
  });
});
