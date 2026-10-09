import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ReelsCarousel } from "@/components/content/reels-carousel";
import { SitePreferencesProvider } from "@/components/layout/site-preferences";
import { SiteUtilityBar } from "@/components/layout/site-utility-bar";
import type { ReelCard } from "@/lib/content/contracts";

const reels: ReelCard[] = [
  {
    id: "reel-sample-01",
    headline: "काल्पनिक नमुना: स्थानीय पुस्तकालयमा डिजिटल पठन कक्ष सुरु",
    headlineEn: "Fictional sample: digital reading room at a local library",
    href: "/ne-NP/news/demo-story",
    category: { id: "category-society", name: "समाज", slug: "society", locale: "ne-NP" },
    media: {
      id: "video-sample-01",
      kind: "video",
      src: "/stock-preview/classroom-discussion-pexels.mp4",
      poster: {
        id: "poster-sample-01",
        kind: "image",
        src: "/stock-preview/classroom-discussion-pexels-poster.jpg",
        alt: "कक्षाकोठामा विद्यार्थी",
        altEn: "Students in a classroom",
        width: 900,
        height: 1600,
      },
      title: "कक्षाकोठामा विद्यार्थी",
      titleEn: "Students in a classroom",
      caption: "यो केवल डिजाइन पूर्वावलोकनको स्टक दृश्य हो।",
      captionEn: "Stock footage for the design preview only.",
      credit: "Ivan S / Pexels",
      durationSeconds: 14,
    },
  },
  {
    id: "reel-sample-02",
    headline: "काल्पनिक नमुना: सामुदायिक केन्द्रमा निःशुल्क डिजिटल सीप कक्षा",
    headlineEn: "Fictional sample: free digital skills class",
    href: "/ne-NP/news/demo-community",
    category: { id: "category-technology", name: "प्रविधि", slug: "technology", locale: "ne-NP" },
    media: {
      id: "video-sample-02",
      kind: "video",
      src: "/stock-preview/typing-macbook-coverr.mp4",
      poster: {
        id: "poster-sample-02",
        kind: "image",
        src: "/stock-preview/typing-coverr-image.webp",
        alt: "ल्यापटपमा टाइप गरिरहेका हात",
        altEn: "Hands typing on a laptop",
        width: 1920,
        height: 1080,
      },
      title: "ल्यापटपमा टाइप गरिँदै",
      titleEn: "Typing on a laptop",
      caption: "यो केवल डिजाइन पूर्वावलोकनको स्टक दृश्य हो।",
      captionEn: "Stock footage for the design preview only.",
      credit: "Coverr",
      durationSeconds: 15,
    },
  },
  {
    id: "reel-sample-03",
    headline: "काल्पनिक नमुना: डिजिटल भुक्तानीको अनुभव",
    headlineEn: "Fictional sample: digital payment experiences",
    href: "/ne-NP/news/demo-story-details",
    category: { id: "category-economy", name: "अर्थतन्त्र", slug: "economy", locale: "ne-NP" },
    media: {
      id: "video-sample-03",
      kind: "video",
      src: "/stock-preview/typing-closeup-pexels.mp4",
      poster: {
        id: "poster-sample-03",
        kind: "image",
        src: "/stock-preview/typing-closeup-pexels-poster.jpg",
        alt: "किबोर्डमा टाइप गरिरहेका हात",
        altEn: "Hands typing on a keyboard",
        width: 900,
        height: 1600,
      },
      title: "किबोर्डमा टाइप गरिँदै",
      titleEn: "Typing on a keyboard",
      caption: "यो केवल डिजाइन पूर्वावलोकनको स्टक दृश्य हो।",
      captionEn: "Stock footage for the design preview only.",
      credit: "Alena Darmel / Pexels",
      durationSeconds: 10,
    },
  },
];

function renderCarousel() {
  return render(
    <SitePreferencesProvider>
      <SiteUtilityBar />
      <ReelsCarousel reels={reels} />
    </SitePreferencesProvider>,
  );
}

describe("reels carousel", () => {
  it("shows polished fictional reel previews and scrolls the horizontal track", async () => {
    const { container } = renderCarousel();
    const track = container.querySelector<HTMLUListElement>(".home-reels__track");
    expect(track).not.toBeNull();
    const scrollBy = vi.fn();
    Object.defineProperty(track, "scrollBy", { configurable: true, value: scrollBy });

    expect(screen.getByRole("heading", { level: 2, name: "नेप दर्पण रिल्स" })).toBeInTheDocument();
    expect(screen.getByText("छोटो भिडियो समाचार")).toBeInTheDocument();
    expect(screen.getAllByText("काल्पनिक नमुना · स्टक भिडियो")).toHaveLength(3);
    expect(container.querySelectorAll(".home-reel__duration")).toHaveLength(3);
    expect(
      Array.from(
        container.querySelectorAll(".home-reel__duration"),
        (duration) => duration.textContent,
      ),
    ).toEqual(["००:१४", "००:१५", "००:१०"]);
    expect(screen.getByRole("link", { name: reels[0].headline })).toHaveAttribute(
      "href",
      reels[0].href,
    );
    const videos = Array.from(container.querySelectorAll("video"));
    expect(videos).toHaveLength(3);
    for (const video of videos) {
      expect(video).toHaveAttribute("controls");
      expect(video).toHaveAttribute("preload", "none");
      expect(video).toHaveAttribute("playsinline");
      expect(video.querySelector("source")).toBeInTheDocument();
    }
    expect(
      Array.from(container.querySelectorAll(".home-reel__credit"), (credit) => credit.textContent),
    ).toEqual(["भिडियो: Ivan S / Pexels", "भिडियो: Coverr", "भिडियो: Alena Darmel / Pexels"]);
    fireEvent.click(screen.getByRole("button", { name: "रिल्स दायाँ सार्नुहोस्" }));
    expect(scrollBy).toHaveBeenCalledWith({ left: 220, behavior: "smooth" });
    expect((await axe(container)).violations).toEqual([]);
  });

  it("switches its labels, disclosures, and fixture headlines to English", async () => {
    const { container } = renderCarousel();

    fireEvent.click(await screen.findByRole("button", { name: "अंग्रेजीमा बदल्नुहोस्" }));

    expect(screen.getByRole("heading", { level: 2, name: "Nep Darpan Reels" })).toBeInTheDocument();
    expect(screen.getByText("Short-form video")).toBeInTheDocument();
    expect(screen.getAllByText("Fictional sample · stock video")).toHaveLength(3);
    expect(container.querySelector(".home-reel__duration")).toHaveTextContent("00:14");
    expect(screen.getByRole("link", { name: reels[0].headlineEn })).toBeInTheDocument();
    expect(
      Array.from(container.querySelectorAll(".home-reel__credit"), (credit) => credit.textContent),
    ).toEqual(["Video: Ivan S / Pexels", "Video: Coverr", "Video: Alena Darmel / Pexels"]);
  });
});
