import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { SitePreferencesProvider, useSitePreferences } from "@/components/layout/site-preferences";
import { TechnologyCategoryPage } from "@/components/content/technology-category-page";
import { mockContentGateway } from "@/lib/content/mock-gateway";

async function technologyPageProps(searchParams: Record<string, string> = {}) {
  const [categoryPage, categories, firstHubPage, secondHubPage] = await Promise.all([
    mockContentGateway.getCategory("ne-NP", "technology"),
    mockContentGateway.listCategories("ne-NP"),
    mockContentGateway.listHub("ne-NP"),
    mockContentGateway.listHub("ne-NP", 2),
  ]);
  if (!categoryPage) throw new Error("The Technology fixture category is missing.");
  return {
    categoryPage,
    categories,
    hubEntries: [...firstHubPage.entries, ...secondHubPage.entries],
    searchParams,
  };
}

function LanguageToggle() {
  const { toggleLanguage } = useSitePreferences();
  return (
    <button onClick={toggleLanguage} type="button">
      Switch preview language
    </button>
  );
}

describe("Technology category page", () => {
  it("presents a complete fictional Technology desk with topics and context", async () => {
    const props = await technologyPageProps();
    const { container } = render(
      <SitePreferencesProvider>
        <TechnologyCategoryPage {...props} />
      </SitePreferencesProvider>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "प्रविधि" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "प्रविधि मुख्य समाचार" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "प्रविधि संक्षेप" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "प्रविधिका ताजा समाचार" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "प्रविधि समाचार खोज्नुहोस्" })).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link", { name: /एआई र एल्गोरिदम/u })
        .some((link) => link.getAttribute("href") === "/category/technology?topic=ai"),
    ).toBe(true);
    expect(
      screen.getByRole("link", {
        name: "काल्पनिक मार्गदर्शिका: एआई सामग्रीको स्रोत र समीक्षा देखाउने",
      }),
    ).toHaveAttribute("href", "/information-hub/demo-technology-ai-transparency");
    expect(
      screen.getByText("प्रत्यक्ष प्रविधि समाचार फिड होइन।", { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("सबै शीर्षक, मिति र विवरण काल्पनिक डिजाइन नमुना", { exact: false }),
    ).toBeInTheDocument();
    expect((await axe(container)).violations).toEqual([]);
  });

  it("localizes the Technology page and supports English topic searches", async () => {
    window.localStorage.clear();
    const props = await technologyPageProps({ q: "privacy notice" });
    render(
      <SitePreferencesProvider>
        <LanguageToggle />
        <TechnologyCategoryPage {...props} />
      </SitePreferencesProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Switch preview language" }));
    expect(screen.getByRole("heading", { level: 1, name: "Technology" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Search results/u })).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Search technology stories" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Fictional guide: understanding privacy notices in digital services")
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Devices and innovation").length).toBeGreaterThan(0);
  });
});
