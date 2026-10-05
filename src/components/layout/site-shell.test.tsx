import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader, primaryNavigation } from "@/components/layout/site-header";

describe("shared site shell", () => {
  it("renders the Nepali masthead and complete primary navigation", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "नेप दर्पण गृहपृष्ठ" })).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("navigation", { name: "मुख्य नेभिगेसन" }).querySelectorAll("a"),
    ).toHaveLength(primaryNavigation.length);
    expect(screen.getByRole("link", { name: "समाचार खोज्नुहोस्" })).toHaveAttribute("href", "/search");
  });
  it("provides labeled mobile and footer navigation", () => {
    render(
      <>
        <MobileNavigation />
        <SiteFooter />
      </>,
    );
    expect(screen.getByRole("navigation", { name: "सानो पर्दाको छिटो नेभिगेसन" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /जानकारी/ }).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "समाचार" })).toBeInTheDocument();
  });
  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <>
        <SiteHeader />
        <main>
          <h1>परीक्षण</h1>
        </main>
        <SiteFooter />
        <MobileNavigation />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
