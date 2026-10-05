import { describe, expect, it } from "vitest";
import { MOCK_DATA_NOTICE, mockContentGateway } from "@/lib/content/mock-gateway";

describe("mock public content gateway", () => {
  it("serves clearly disclosed fictional homepage sections and hub highlights", async () => {
    const home = await mockContentGateway.getHome("ne-NP");
    expect(MOCK_DATA_NOTICE).toContain("काल्पनिक");
    expect(home.lead?.headline).toContain("काल्पनिक नमुना");
    expect(home.latest.length).toBeGreaterThan(1);
    expect(home.sections.length).toBeGreaterThan(0);
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
    expect(
      (await mockContentGateway.getCategory("ne-NP", "economy"))?.articles[0]?.category.slug,
    ).toBe("economy");
    expect((await mockContentGateway.getCategory("ne-NP", "world"))?.category.name).toBe("विश्व");
    expect((await mockContentGateway.getCategory("ne-NP", "opinion"))?.articles[0]?.kind).toBe(
      "opinion",
    );
    expect(await mockContentGateway.getCategory("ne-NP", "missing")).toBeNull();
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
});
