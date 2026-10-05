import { describe, expect, it } from "vitest";
import { LocaleUnavailableError, mockContentGateway } from "@/lib/content/mock-gateway";

describe("mock public content gateway", () => {
  it("returns the Nepali fixture and advertises only available translations", async () => {
    const home = await mockContentGateway.getHome("ne-NP");

    expect(home.locale).toBe("ne-NP");
    expect(home.availableLocales).toEqual(["ne-NP"]);
    expect(home.lead?.headline).toContain("डेमो");
  });

  it("does not silently serve Nepali as an English translation", async () => {
    await expect(mockContentGateway.getHome("en")).rejects.toBeInstanceOf(LocaleUnavailableError);
  });

  it("does not let callers mutate the shared fixture", async () => {
    const firstRead = await mockContentGateway.getHome("ne-NP");
    firstRead.latest.pop();

    const secondRead = await mockContentGateway.getHome("ne-NP");
    expect(secondRead.latest).toHaveLength(1);
  });
});
