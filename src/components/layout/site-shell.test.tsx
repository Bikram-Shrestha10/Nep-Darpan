import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader, primaryNavigation } from "@/components/layout/site-header";
import { SitePreferencesProvider } from "@/components/layout/site-preferences";

describe("shared site shell", () => {
  it("renders the Nepali masthead and complete primary navigation", () => {
    render(<SiteHeader />);
    const brand = screen.getByRole("link", { name: "नेप दर्पण गृहपृष्ठ" });
    expect(brand).toHaveAttribute("href", "/");
    expect(brand.querySelector("img")).toHaveAttribute("alt", "");
    expect(brand.querySelector("img")).toHaveAttribute("src", expect.stringContaining("logo.jpg"));
    expect(
      screen.getByRole("navigation", { name: "मुख्य नेभिगेसन" }).querySelectorAll("a"),
    ).toHaveLength(primaryNavigation.length);
    expect(screen.getByRole("link", { name: "समाचार खोज्नुहोस्" })).toHaveAttribute("href", "/search");
  });
  it("opens the localized notification preview from the header bell", async () => {
    window.localStorage.clear();
    const { container } = render(
      <SitePreferencesProvider>
        <SiteHeader />
      </SitePreferencesProvider>,
    );
    const notificationToggle = screen.getByText("सूचनाहरू खोल्नुहोस्").closest("summary");
    if (!notificationToggle)
      throw new Error("Notification control is missing its summary element.");
    fireEvent.click(notificationToggle);
    expect(screen.getByRole("heading", { name: "सूचनाहरू" })).toBeInTheDocument();
    expect(screen.getByText("यो पूर्वावलोकनमा सूचना सुविधा उपलब्ध छैन।")).toBeInTheDocument();
    expect(screen.getByText("सूचनाहरू उपलब्ध भएपछि यहाँ देखिनेछन्।")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "अंग्रेजीमा बदल्नुहोस्" }));
    expect(screen.getByRole("heading", { name: "Notifications" })).toBeInTheDocument();
    expect(
      screen.getByText("Notifications are not available in this preview yet."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Updates will appear here when notifications are enabled."),
    ).toBeInTheDocument();
    expect((await axe(container)).violations).toEqual([]);
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
