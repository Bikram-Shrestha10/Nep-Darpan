import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { EconomyCategoryPage } from "@/components/content/economy-category-page";
import { SitePreferencesProvider, useSitePreferences } from "@/components/layout/site-preferences";
import { mockContentGateway } from "@/lib/content/mock-gateway";

async function economyPageProps() {
  const [categoryPage, categories, hubPage] = await Promise.all([
    mockContentGateway.getCategory("ne-NP", "economy"),
    mockContentGateway.listCategories("ne-NP"),
    mockContentGateway.listHub("ne-NP"),
  ]);
  if (!categoryPage) throw new Error("The economy fixture category is missing.");
  return { categoryPage, categories, hubEntries: hubPage.entries, searchParams: {} };
}

function LanguageToggle() {
  const { toggleLanguage } = useSitePreferences();
  return (
    <button onClick={toggleLanguage} type="button">
      Switch preview language
    </button>
  );
}

describe("economy category page", () => {
  it("shows the full fictional economy feed and unavailable market data clearly", async () => {
    const props = await economyPageProps();
    const { container } = render(
      <SitePreferencesProvider>
        <EconomyCategoryPage {...props} />
      </SitePreferencesProvider>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "अर्थतन्त्र" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "बजार संकेतक" })).toBeInTheDocument();
    expect(screen.getByText("लाइभ डाटा छैन")).toBeInTheDocument();
    expect(
      screen.getByText(
        "बजार, विनिमय दर र मूल्यका लागि स्वीकृत स्रोत जडान गरिएको छैन। ड्यासबोर्ड लेआउट मात्र हो; यो लगानी सल्लाह होइन।",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "अर्थतन्त्रका मुख्य शीर्षक" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "अर्थतन्त्रका ताजा समाचार" })).toBeInTheDocument();
    expect(screen.getAllByText("काल्पनिक नमुना", { exact: true }).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "काल्पनिक व्याख्या: बजेटका आम्दानी र खर्च शीर्षक" }),
    ).toHaveAttribute("href", "/information-hub/demo-economy-budget-basics");
    expect((await axe(container)).violations).toEqual([]);
  });

  it("localizes economy labels, story copy, and search access in English", async () => {
    window.localStorage.clear();
    const props = await economyPageProps();
    render(
      <SitePreferencesProvider>
        <LanguageToggle />
        <EconomyCategoryPage {...props} />
      </SitePreferencesProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Switch preview language" }));
    expect(screen.getByRole("heading", { level: 1, name: "Economy" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Market snapshot" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search economy stories" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", {
        name: "Fictional sample: a simple cost-record template for local businesses",
      }),
    ).toHaveLength(1);
    expect(
      screen.getByText("No approved source is connected", { exact: false }),
    ).toBeInTheDocument();
  });
});
