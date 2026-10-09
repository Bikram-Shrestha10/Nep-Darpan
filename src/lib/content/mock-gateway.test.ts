import { describe, expect, it } from "vitest";
import { MOCK_DATA_NOTICE, mockContentGateway } from "@/lib/content/mock-gateway";

describe("mock public content gateway", () => {
  it("lists only reviewed fixture categories for the requested locale", async () => {
    const categories = await mockContentGateway.listCategories("ne-NP");
    expect(categories.map((category) => category.slug)).toContain("economy");
    expect(await mockContentGateway.listCategories("en")).toEqual([]);
  });

  it("serves clearly disclosed fictional homepage sections and hub highlights", async () => {
    const home = await mockContentGateway.getHome("ne-NP");
    expect(MOCK_DATA_NOTICE).toContain("काल्पनिक");
    expect(home.lead?.headline).toContain("काल्पनिक नमुना");
    expect(home.latest.length).toBeGreaterThan(1);
    expect(home.trending).toHaveLength(5);
    expect(new Set(home.trending.map((story) => story.id)).size).toBe(5);
    expect(home.trending.every((story) => story.headline.includes("नमुना"))).toBe(true);
    expect(home.sections.length).toBeGreaterThan(0);
    const sectionStories = home.sections.flatMap((section) => section.articles);
    expect(sectionStories).toHaveLength(12);
    expect(new Set(sectionStories.map((story) => story.id)).size).toBe(sectionStories.length);
    expect(
      home.sections.every(
        (section) =>
          section.articles.length === 2 &&
          section.articles.every((story) => story.category.slug === section.category.slug),
      ),
    ).toBe(true);
    const supplementalStories = home.sections.map((section) => section.articles[1]);
    expect(supplementalStories.every((story) => story?.headline.includes("काल्पनिक नमुना"))).toBe(
      true,
    );
    const supplementalStory = supplementalStories[0];
    expect(supplementalStory).toBeDefined();
    if (supplementalStory) {
      expect((await mockContentGateway.getArticle("ne-NP", supplementalStory.slug))?.headline).toBe(
        supplementalStory.headline,
      );
    }
    expect(home.breaking).toHaveLength(2);
    expect(
      home.breaking.every(
        (story) => story.labels.includes("breaking") && story.headline.includes("काल्पनिक नमुना"),
      ),
    ).toBe(true);
    expect(home.breaking[0]?.category.slug).toBe("politics");
    const heroSideStories = home.latest.filter(
      (story) => story.id !== home.lead?.id && story.id !== home.breaking[0]?.id,
    );
    expect(heroSideStories.slice(0, 4).every((story) => Boolean(story.leadMedia))).toBe(true);
    expect(home.reels).toHaveLength(5);
    expect(home.reels.slice(-2).map((reel) => reel.media?.credit)).toEqual([
      "Laura Tancredi / Pexels",
      "Tim Samuel / Pexels",
    ]);
    expect(home.reels.slice(-2).every((reel) => reel.headline.includes("काल्पनिक नमुना"))).toBe(true);
    expect(
      home.reels
        .slice(-2)
        .every((reel) => Boolean(reel.headlineEn && reel.media?.titleEn && reel.media?.captionEn)),
    ).toBe(true);
    expect(home.reels.slice(-2).every((reel) => reel.media?.caption?.includes("स्टक दृश्य"))).toBe(
      true,
    );
    expect(home.hubHighlights.map((entry) => entry.kind)).toEqual([
      "explainer",
      "guide",
      "fact_check",
    ]);
  });

  it("does not silently provide unreviewed English fixtures", async () => {
    await expect(mockContentGateway.getHome("en")).rejects.toThrow("No reviewed fixture content");
    expect(await mockContentGateway.getArticle("en", "demo-story")).toBeNull();
  });

  it("returns only fixture categories and visible published articles", async () => {
    const economy = await mockContentGateway.getCategory("ne-NP", "economy");
    expect(economy?.articles[0]?.category.slug).toBe("economy");
    expect(economy?.articles).toHaveLength(10);
    expect(economy?.articles.every((story) => story.headline.includes("काल्पनिक"))).toBe(true);
    expect(new Set(economy?.articles.map((story) => story.id)).size).toBe(10);
    expect(economy?.articles.map((story) => story.kind)).toEqual(
      expect.arrayContaining(["news", "analysis", "opinion", "explainer", "fact_check", "guide"]),
    );
    const society = await mockContentGateway.getCategory("ne-NP", "society");
    expect(society?.articles).toHaveLength(10);
    expect(society?.articles.every((story) => story.headline.includes("काल्पनिक"))).toBe(true);
    expect(new Set(society?.articles.map((story) => story.id)).size).toBe(10);
    expect(society?.articles.map((story) => story.kind)).toEqual(
      expect.arrayContaining(["news", "analysis", "opinion", "explainer", "fact_check", "guide"]),
    );
    const world = await mockContentGateway.getCategory("ne-NP", "world");
    expect(world?.category.name).toBe("विश्व");
    expect(world?.articles).toHaveLength(10);
    expect(world?.articles.every((story) => story.headline.includes("काल्पनिक"))).toBe(true);
    expect(new Set(world?.articles.map((story) => story.id)).size).toBe(10);
    expect(world?.articles.map((story) => story.kind)).toEqual(
      expect.arrayContaining(["news", "analysis", "opinion", "explainer", "fact_check", "guide"]),
    );
    const technology = await mockContentGateway.getCategory("ne-NP", "technology");
    expect(technology?.category.name).toBe("प्रविधि");
    expect(technology?.articles).toHaveLength(10);
    expect(technology?.articles.every((story) => story.headline.includes("काल्पनिक"))).toBe(true);
    expect(new Set(technology?.articles.map((story) => story.id)).size).toBe(10);
    expect(technology?.articles.map((story) => story.kind)).toEqual(
      expect.arrayContaining(["news", "analysis", "opinion", "explainer", "fact_check", "guide"]),
    );
    const opinion = await mockContentGateway.getCategory("ne-NP", "opinion");
    expect(opinion?.articles[0]?.kind).toBe("opinion");
    expect(opinion?.articles).toHaveLength(10);
    expect(
      opinion?.articles.every(
        (story) => story.headline.includes("काल्पनिक") || story.headline.includes("नमुना"),
      ),
    ).toBe(true);
    expect(new Set(opinion?.articles.map((story) => story.id)).size).toBe(10);
    expect(opinion?.articles.map((story) => story.kind)).toEqual(
      expect.arrayContaining(["opinion", "analysis"]),
    );
    expect(
      opinion?.articles.every((story) => story.authors[0]?.roleLabel?.includes("काल्पनिक")),
    ).toBe(true);
    const politics = await mockContentGateway.getCategory("ne-NP", "politics");
    expect(politics?.articles).toHaveLength(8);
    expect(politics?.articles.every((story) => story.headline.includes("काल्पनिक"))).toBe(true);
    expect(new Set(politics?.articles.map((story) => story.id)).size).toBe(8);
    expect(politics?.articles.map((story) => story.kind)).toEqual(
      expect.arrayContaining(["analysis", "opinion", "explainer", "fact_check"]),
    );
    expect(await mockContentGateway.getCategory("ne-NP", "missing")).toBeNull();
    const lastCategoryPage = await mockContentGateway.getCategory("ne-NP", "economy", 99);
    expect(lastCategoryPage?.pageInfo.page).toBe(1);
    expect((await mockContentGateway.getArticle("ne-NP", "demo-story"))?.status).toBe("published");
    expect(await mockContentGateway.getArticle("ne-NP", "draft-or-missing")).toBeNull();
  });

  it("keeps corrections, source notes and related reporting on the article fixture", async () => {
    const story = await mockContentGateway.getArticle("ne-NP", "demo-story");
    expect(story?.corrections).toHaveLength(1);
    expect(story?.corrections[0]?.reason).toContain("काल्पनिक");
    expect(story?.sources[0]?.publisher).toContain("वास्तविक स्रोत होइन");
    expect(story?.related.length).toBeGreaterThan(0);
  });

  it("labels the fact-check layout without inventing a finding", async () => {
    const entry = await mockContentGateway.getHubEntry("ne-NP", "demo-fact-check");
    expect(entry?.kind).toBe("fact_check");
    expect(entry?.summary).toContain("कुनै वास्तविक दाबी");
    expect(entry?.conclusion).toBeUndefined();
  });

  it("clamps hub pagination to available fixture pages", async () => {
    const page = await mockContentGateway.listHub("ne-NP", 99);
    expect(page.pageInfo).toMatchObject({ page: 2, pageSize: 10, totalItems: 11, totalPages: 2 });
    expect(page.entries).toHaveLength(1);
    const factChecks = await mockContentGateway.listHub("ne-NP", 1, "fact_check");
    expect(factChecks.entries.map((entry) => entry.kind)).toEqual(["fact_check"]);
    expect(factChecks.pageInfo.totalItems).toBe(1);
    const guides = await mockContentGateway.listHub("ne-NP", 1, "guide");
    expect(guides.pageInfo.totalItems).toBe(5);
    expect(guides.entries.map((entry) => entry.kind)).toEqual([
      "guide",
      "guide",
      "guide",
      "guide",
      "guide",
    ]);
    const societyGuides = guides.entries.filter((entry) =>
      entry.related.some((story) => story.category.slug === "society"),
    );
    expect(societyGuides.map((entry) => entry.slug)).toEqual([
      "demo-society-accessible-information",
    ]);
    const technologyGuides = guides.entries.filter((entry) =>
      entry.related.some((story) => story.category.slug === "technology"),
    );
    expect(technologyGuides.map((entry) => entry.slug)).toEqual([
      "demo-guide",
      "demo-technology-ai-transparency",
    ]);
  });
});
