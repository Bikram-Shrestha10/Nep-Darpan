import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  LocalizedDate,
  LocalizedNumber,
  LocalizedText,
  SitePreferencesProvider,
} from "@/components/layout/site-preferences";
import { SiteUtilityBar } from "@/components/layout/site-utility-bar";
import { formatLocalizedDate } from "@/lib/i18n/dates";

function renderUtilityBar() {
  return render(
    <SitePreferencesProvider>
      <SiteUtilityBar />
    </SitePreferencesProvider>,
  );
}

describe("site utility preferences", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = "ne-NP";
    document.title = "नेप दर्पण";
    delete document.documentElement.dataset.theme;
  });

  it("formats Nepali dates with Devanagari names and numerals", () => {
    expect(
      formatLocalizedDate(new Date("2026-10-07T08:05:00.000Z"), "ne-NP", {
        dateStyle: "full",
        timeZone: "Asia/Kathmandu",
      }),
    ).toBe("२०२६ अक्टोबर ७, बुधबार");
  });

  it("formats numbers with stable Nepali and English digits", async () => {
    render(
      <SitePreferencesProvider>
        <SiteUtilityBar />
        <p>
          <LocalizedNumber value={1001} />
        </p>
      </SitePreferencesProvider>,
    );

    expect(screen.getByText("१,००१")).toBeInTheDocument();
    fireEvent.click(await screen.findByRole("button", { name: "अंग्रेजीमा बदल्नुहोस्" }));
    expect(await screen.findByText("1,001")).toBeInTheDocument();
  });

  it("switches between Nepali and English and applies the selected document language", async () => {
    renderUtilityBar();

    const date = document.querySelector(".site-utility-bar__date time") as HTMLTimeElement;
    await waitFor(() => expect(date.getAttribute("datetime")).toBeTruthy());
    const dateValue = new Date(date.dateTime);
    expect(date).toHaveTextContent(
      formatLocalizedDate(dateValue, "ne-NP", {
        dateStyle: "full",
        timeZone: "Asia/Kathmandu",
      }),
    );

    fireEvent.click(await screen.findByRole("button", { name: "अंग्रेजीमा बदल्नुहोस्" }));
    expect(await screen.findByRole("button", { name: "Switch to Nepali" })).toHaveTextContent(
      "English",
    );
    await waitFor(() => expect(document.documentElement.lang).toBe("en"));
    expect(window.localStorage.getItem("nep-darpan:language")).toBe("en");
    await waitFor(() =>
      expect(date).toHaveTextContent(
        formatLocalizedDate(dateValue, "en", {
          dateStyle: "full",
          timeZone: "Asia/Kathmandu",
        }),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "Switch to Nepali" }));
    expect(await screen.findByRole("button", { name: "अंग्रेजीमा बदल्नुहोस्" })).toHaveTextContent(
      "नेपाली",
    );
    await waitFor(() => expect(document.documentElement.lang).toBe("ne-NP"));
    expect(window.localStorage.getItem("nep-darpan:language")).toBe("ne-NP");
  });

  it("localizes a title node replaced during client-side navigation", async () => {
    window.localStorage.setItem("nep-darpan:language", "en");
    document.title = "ताजा समाचार | Nep Darpan";
    renderUtilityBar();

    await waitFor(() => expect(document.documentElement.lang).toBe("en"));
    await waitFor(() => expect(document.title).toBe("Latest news | Nep Darpan"));

    const previousTitle = document.querySelector("title");
    const nextTitle = document.createElement("title");
    nextTitle.textContent = "समाचार खोज | Nep Darpan";
    if (previousTitle) document.head.replaceChild(nextTitle, previousTitle);

    await waitFor(() => expect(document.title).toBe("Search news | Nep Darpan"));
  });

  it("translates fictional fixture copy and date formatting in both directions", async () => {
    render(
      <SitePreferencesProvider>
        <SiteUtilityBar />
        <h1>
          <LocalizedText ne="काल्पनिक नमुना: स्थानीय पुस्तकालयमा डिजिटल पठन कक्ष सुरु" />
        </h1>
        <time>
          <LocalizedDate value="2026-10-01T00:00:00.000Z" />
        </time>
      </SitePreferencesProvider>,
    );

    expect(
      screen.getByRole("heading", {
        name: "काल्पनिक नमुना: स्थानीय पुस्तकालयमा डिजिटल पठन कक्ष सुरु",
      }),
    ).toBeInTheDocument();
    fireEvent.click(await screen.findByRole("button", { name: "अंग्रेजीमा बदल्नुहोस्" }));
    expect(
      await screen.findByRole("heading", {
        name: "Fictional sample: Digital reading room opens at a local library",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Oct 1, 2026")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Switch to Nepali" }));
    expect(
      await screen.findByRole("heading", {
        name: "काल्पनिक नमुना: स्थानीय पुस्तकालयमा डिजिटल पठन कक्ष सुरु",
      }),
    ).toBeInTheDocument();
  });

  it("toggles light and dark themes, then restores both saved preferences", async () => {
    const firstRender = renderUtilityBar();
    fireEvent.click(await screen.findByRole("button", { name: "गाढा मोडमा बदल्नुहोस्" }));
    expect(await screen.findByRole("button", { name: "उज्यालो मोडमा बदल्नुहोस्" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("dark"));
    expect(window.localStorage.getItem("nep-darpan:theme")).toBe("dark");

    fireEvent.click(screen.getByRole("button", { name: "अंग्रेजीमा बदल्नुहोस्" }));
    await screen.findByRole("button", { name: "Switch to Nepali" });
    firstRender.unmount();

    renderUtilityBar();
    expect(await screen.findByRole("button", { name: "Switch to Nepali" })).toHaveTextContent(
      "English",
    );
    expect(await screen.findByRole("button", { name: "Switch to light mode" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await waitFor(() => {
      expect(document.documentElement.lang).toBe("en");
      expect(document.documentElement.dataset.theme).toBe("dark");
    });
  });
});
