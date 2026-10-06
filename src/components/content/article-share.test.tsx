import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ArticleShare } from "@/components/content/article-share";

describe("article sharing", () => {
  it("uses the native share sheet when available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    render(<ArticleShare />);

    fireEvent.click(screen.getByRole("button", { name: "समाचार साझा गर्नुहोस्" }));

    expect(await screen.findByRole("status")).toHaveTextContent("साझा मेनु खोलियो");
    expect(share).toHaveBeenCalledWith({ title: document.title, url: window.location.href });
  });

  it("copies the article link when native sharing is unavailable", async () => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<ArticleShare />);

    fireEvent.click(screen.getByRole("button", { name: "समाचार साझा गर्नुहोस्" }));

    expect(await screen.findByRole("status")).toHaveTextContent("लिङ्क प्रतिलिपि गरियो");
    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });
});
