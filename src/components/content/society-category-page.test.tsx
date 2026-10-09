import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { SocietyCategoryPage } from "@/components/content/society-category-page";
import { SitePreferencesProvider, useSitePreferences } from "@/components/layout/site-preferences";
import { mockContentGateway } from "@/lib/content/mock-gateway";

async function societyPageProps(searchParams: Record<string, string> = {}) {
  const [categoryPage, categories, hubPage] = await Promise.all([
    mockContentGateway.getCategory("ne-NP", "society"),
    mockContentGateway.listCategories("ne-NP"),
    mockContentGateway.listHub("ne-NP"),
  ]);
  if (!categoryPage) throw new Error("The society fixture category is missing.");
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

describe("society category page", () => {
  it("presents a complete, responsive-layout-ready fictional Society experience", async () => {
    const props = await societyPageProps();
    const { container } = render(
      <SitePreferencesProvider>
        <SocietyCategoryPage {...props} />
      </SitePreferencesProvider>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "समाज" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "समाजको मुख्य समाचार" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "समाजका मुख्य शीर्षक" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "समुदाय जीवनका विविध पाटा" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "समाजका ताजा समाचार" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "समाजका समाचार खोज्नुहोस्" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^शिक्षा/u })).toHaveAttribute(
      "href",
      "/category/society?q=education",
    );
    expect(
      screen.getByRole("link", { name: "काल्पनिक मार्गदर्शिका: सार्वजनिक सूचना सजिलोसँग बुझ्ने" }),
    ).toHaveAttribute("href", "/information-hub/demo-society-accessible-information");
    expect(screen.getByText("प्रत्यक्ष समाचार अपडेट होइनन्", { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText("कुनै वास्तविक व्यक्ति, संस्था, घटना, स्वास्थ्य सेवा", { exact: false }),
    ).toBeInTheDocument();
    expect((await axe(container)).violations).toEqual([]);
  });

  it("localizes the Society page and story search in English", async () => {
    window.localStorage.clear();
    const props = await societyPageProps({ q: "education" });
    render(
      <SitePreferencesProvider>
        <LanguageToggle />
        <SocietyCategoryPage {...props} />
      </SitePreferencesProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Switch preview language" }));
    expect(screen.getByRole("heading", { level: 1, name: "Society" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Search results/u })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search society stories" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", {
        name: "Fictional sample: a shared information board for school and family conversations",
      }).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Fictional sample", { exact: true })).toBeInTheDocument();
  });
});
