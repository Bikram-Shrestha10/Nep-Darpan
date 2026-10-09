import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { SitePreferencesProvider, useSitePreferences } from "@/components/layout/site-preferences";
import { WorldCategoryPage } from "@/components/content/world-category-page";
import { mockContentGateway } from "@/lib/content/mock-gateway";

async function worldPageProps(searchParams: Record<string, string> = {}) {
  const [categoryPage, categories, hubPage] = await Promise.all([
    mockContentGateway.getCategory("ne-NP", "world"),
    mockContentGateway.listCategories("ne-NP"),
    mockContentGateway.listHub("ne-NP"),
  ]);
  if (!categoryPage) throw new Error("The World fixture category is missing.");
  return { categoryPage, categories, hubEntries: hubPage.entries, searchParams };
}

function LanguageToggle() {
  const { toggleLanguage } = useSitePreferences();
  return (
    <button onClick={toggleLanguage} type="button">
      Switch preview language
    </button>
  );
}

describe("World category page", () => {
  it("presents regional navigation, fictional lead coverage, and context resources", async () => {
    const props = await worldPageProps();
    const { container } = render(
      <SitePreferencesProvider>
        <WorldCategoryPage {...props} />
      </SitePreferencesProvider>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "विश्व" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "विश्वको मुख्य समाचार" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "विश्व संक्षेप" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "विश्वका ताजा समाचार" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "विश्व समाचार खोज्नुहोस्" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /दक्षिण एसिया/u })).toHaveAttribute(
      "href",
      "/category/world?region=south-asia",
    );
    expect(
      screen.getByRole("link", {
        name: "काल्पनिक मार्गदर्शिका: अन्तर्राष्ट्रिय समाचारको स्रोत जाँच्ने",
      }),
    ).toHaveAttribute("href", "/information-hub/demo-world-source-guide");
    expect(
      screen.getByText("प्रत्यक्ष अन्तर्राष्ट्रिय समाचार फिड होइन।", { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("सबै शीर्षक, समय, क्षेत्र-वर्गीकरण र विवरण काल्पनिक", { exact: false }),
    ).toBeInTheDocument();
    expect((await axe(container)).violations).toEqual([]);
  });

  it("localizes the page and supports an English regional search", async () => {
    window.localStorage.clear();
    const props = await worldPageProps({ q: "South Asia" });
    render(
      <SitePreferencesProvider>
        <LanguageToggle />
        <WorldCategoryPage {...props} />
      </SitePreferencesProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Switch preview language" }));
    expect(screen.getByRole("heading", { level: 1, name: "World" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Search results/u })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search world stories" })).toBeInTheDocument();
    expect(screen.getAllByText("South Asia").length).toBeGreaterThan(0);
    expect(
      screen.getByText("Fictional sample: a regional calendar for student exchanges"),
    ).toBeInTheDocument();
  });
});
