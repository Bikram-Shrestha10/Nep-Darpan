import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { OpinionCategoryPage } from "@/components/content/opinion-category-page";
import { SitePreferencesProvider, useSitePreferences } from "@/components/layout/site-preferences";
import { mockContentGateway } from "@/lib/content/mock-gateway";

async function opinionPageProps(searchParams: Record<string, string> = {}) {
  const [categoryPage, categories] = await Promise.all([
    mockContentGateway.getCategory("ne-NP", "opinion"),
    mockContentGateway.listCategories("ne-NP"),
  ]);
  if (!categoryPage) throw new Error("The Opinion fixture category is missing.");
  return { categoryPage, categories, searchParams };
}

function LanguageToggle() {
  const { toggleLanguage } = useSitePreferences();
  return (
    <button onClick={toggleLanguage} type="button">
      Switch preview language
    </button>
  );
}

describe("Opinion category page", () => {
  it("presents a complete fictional Opinion desk and keeps opinion separate from reporting", async () => {
    window.localStorage.clear();
    const props = await opinionPageProps();
    const { container } = render(
      <SitePreferencesProvider>
        <OpinionCategoryPage {...props} />
      </SitePreferencesProvider>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "विचार" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "विचारको मुख्य लेख" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "विचार डेस्कबाट" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ताजा विचार र स्तम्भ" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "विचार र स्तम्भ खोज्नुहोस्" })).toBeInTheDocument();
    expect(screen.getByText("समाचार रिपोर्टिङ फरक विधा हुन्", { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText("वास्तविक व्यक्तिको धारणा वा समाचार रिपोर्ट होइनन्", { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/काल्पनिक स्तम्भकार|Fictional columnist/u).length).toBeGreaterThan(0);
    expect((await axe(container)).violations).toEqual([]);
  });

  it("localizes the page and applies topic plus format filters", async () => {
    window.localStorage.clear();
    const props = await opinionPageProps({ topic: "society", kind: "opinion" });
    render(
      <SitePreferencesProvider>
        <LanguageToggle />
        <OpinionCategoryPage {...props} />
      </SitePreferencesProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Switch preview language" }));
    expect(screen.getByRole("heading", { level: 1, name: "Opinion" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Latest opinion and columns" })).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Search opinion and columns" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Lead opinion" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Culture and education/u })).toHaveAttribute(
      "href",
      "/category/opinion?topic=culture&kind=opinion",
    );
    expect(
      screen.getByText("Fictional opinion: making shared city spaces work for everyone"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Fictional analysis: the place for local voices in regional dialogue"),
    ).not.toBeInTheDocument();
  });
});
