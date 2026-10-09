import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import type { ArticleCard, CorrectionNotice, SourceReference } from "@/lib/content/contracts";
import { ArticleMedia } from "@/components/content/article-media";
import { AdvertisementSlot } from "@/components/content/advertisement-slot";
import { SitePreferencesProvider } from "@/components/layout/site-preferences";
import { SiteUtilityBar } from "@/components/layout/site-utility-bar";
import { CorrectionNoticePanel } from "@/components/content/correction-notice";
import { RelatedStories } from "@/components/content/related-stories";
import { SourceAttribution } from "@/components/content/source-attribution";
import { HomepageHero, selectHomepageHeroStories } from "@/components/content/homepage-hero";
import { LeadStory, StoryCard } from "@/components/content/story-card";

const story: ArticleCard = {
  id: "fixture-01",
  storyGroupId: "fixture-group-01",
  slug: "fixture-story",
  locale: "ne-NP",
  kind: "news",
  headline: "काल्पनिक समाचार: परीक्षणका लागि राखिएको शीर्षक",
  summary: "यो कथा केवल कम्पोनेन्ट परीक्षणका लागि तयार गरिएको काल्पनिक नमुना हो।",
  href: "/ne-NP/news/fixture-story",
  category: { id: "fixture-category", name: "डेमो विषय", slug: "demo", locale: "ne-NP" },
  authors: [
    { id: "author-01", name: "डेमो पत्रकार", slug: "demo-author", roleLabel: "काल्पनिक नमुना" },
  ],
  publishedAt: "2026-10-05T06:00:00.000Z",
  labels: [],
  hasCorrection: false,
};

describe("story cards and editorial labels", () => {
  it("renders story category, labels, byline, and a timezone-aware publication time", () => {
    const { container } = render(<StoryCard article={story} />);
    expect(screen.getByRole("link", { name: story.headline })).toHaveAttribute("href", story.href);
    expect(screen.queryByText("समाचार", { exact: true })).not.toBeInTheDocument();
    expect(container.querySelector(".story-labels")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "डेमो विषय" })).toHaveAttribute(
      "href",
      "/category/demo",
    );
    expect(screen.getByText("डेमो पत्रकार")).toBeInTheDocument();
    expect(container.querySelector(".story-author__role")).toHaveTextContent("काल्पनिक नमुना");
    expect(screen.getByText("प्रकाशित:").parentElement?.querySelector("time")).toHaveAttribute(
      "datetime",
      story.publishedAt,
    );
  });

  it("handles missing optional fields and an empty author list", () => {
    const minimalStory: ArticleCard = {
      ...story,
      summary: undefined,
      authors: [],
      updatedAt: undefined,
      leadMedia: undefined,
    };
    const { container } = render(<StoryCard article={minimalStory} density="compact" />);
    expect(screen.getByText("लेखक जानकारी उपलब्ध छैन")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "यहाँ तस्बिर थपिनेछ" })).toBeInTheDocument();
    expect(container).not.toHaveTextContent(story.summary ?? "");
    expect(container.querySelector("figure")).not.toBeInTheDocument();
  });

  it("fits story card photos into a consistent top-aligned frame", () => {
    const storyWithMedia: ArticleCard = {
      ...story,
      leadMedia: {
        id: "story-photo",
        kind: "image",
        src: "/stock-preview/library-students-pexels.jpg",
        alt: "काल्पनिक पुस्तकालय",
        width: 1200,
        height: 800,
        credit: "Pexels",
      },
    };
    const { container } = render(<StoryCard article={storyWithMedia} density="compact" />);

    expect(container.querySelector(".article-media__visual")).toHaveStyle({
      aspectRatio: "8 / 5",
    });
    expect(container.querySelector(".article-media__image")).toBeInTheDocument();
  });

  it("renders story media before the story copy", () => {
    const storyWithMedia: ArticleCard = {
      ...story,
      leadMedia: {
        id: "story-photo",
        kind: "image",
        src: "/stock-preview/library-students-pexels.jpg",
        alt: "काल्पनिक पुस्तकालय",
        width: 1200,
        height: 800,
        credit: "Pexels",
      },
    };
    const { container } = render(<StoryCard article={storyWithMedia} density="compact" />);
    const card = container.querySelector(".story-card");

    expect(card?.children[0]).toHaveClass("article-media");
    expect(card?.children[1]).toHaveClass("story-card__body");
  });

  it("omits editorial label chips from story cards and keeps the category link", () => {
    const labeledStory: ArticleCard = {
      ...story,
      kind: "analysis",
      labels: ["analysis", "breaking", "opinion", "fact_check", "sponsored"],
    };
    const { container, rerender } = render(<StoryCard article={labeledStory} />);
    expect(screen.getByRole("link", { name: "डेमो विषय" })).toHaveAttribute(
      "href",
      "/category/demo",
    );
    expect(container.querySelector(".story-labels")).not.toBeInTheDocument();
    for (const label of ["विश्लेषण", "ब्रेकिङ", "विचार", "तथ्य जाँच", "प्रायोजित"]) {
      expect(screen.queryByText(label, { exact: true })).not.toBeInTheDocument();
    }

    rerender(<LeadStory article={labeledStory} variant="home" />);
    expect(screen.getByRole("link", { name: "डेमो विषय" })).toBeInTheDocument();
    expect(container.querySelector(".story-labels")).not.toBeInTheDocument();
    expect(container.querySelector(".lead-story__labels")).toHaveTextContent("डेमो विषय");
    for (const label of ["विश्लेषण", "ब्रेकिङ", "विचार", "तथ्य जाँच", "प्रायोजित"]) {
      expect(screen.queryByText(label, { exact: true })).not.toBeInTheDocument();
    }
  });

  it("keeps long Nepali headlines and author names within the story content", () => {
    const longStory = {
      ...story,
      headline:
        "नेपालको समसामयिक घटनाक्रम र सार्वजनिक छलफलका सबै पक्षलाई समेटेर तयार गरिएको परीक्षणका लागि लामो काल्पनिक शीर्षक हो",
      authors: [
        {
          ...story.authors[0],
          name: "डेमो पत्रकारको धेरै लामो काल्पनिक पूरा नाम परीक्षणका लागि राखिएको छ",
        },
      ],
      hasCorrection: true,
    };
    render(<StoryCard article={longStory} />);
    expect(screen.getByRole("heading", { name: longStory.headline })).toBeInTheDocument();
    expect(screen.getByText(longStory.authors[0].name)).toBeInTheDocument();
    expect(screen.getByText(/सम्पादकीय सुधार सूचना/)).toBeInTheDocument();
  });
});

describe("homepage advertisement slot", () => {
  it("shows a clearly labeled sponsored placement and follows the language toggle", async () => {
    window.localStorage.clear();
    const { container } = render(
      <SitePreferencesProvider>
        <SiteUtilityBar />
        <AdvertisementSlot />
      </SitePreferencesProvider>,
    );

    expect(screen.getByRole("heading", { level: 2, name: "विज्ञापन" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "नेप दर्पण विज्ञापन साझेदार · प्रायोजित स्थान",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "काउन्टरमा स्मार्टफोनबाट भुक्तानी गरिँदै" }),
    ).toBeInTheDocument();
    expect(screen.getByText("तस्बिर: iMin Technology / Pexels")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "विज्ञापनबारे सोधपुछ गर्नुहोस्" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect((await axe(container)).violations).toEqual([]);

    fireEvent.click(await screen.findByRole("button", { name: "अंग्रेजीमा बदल्नुहोस्" }));
    expect(screen.getByRole("heading", { level: 2, name: "ADVERTISEMENT" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Nep Darpan Advertising Partner · Sponsored Placement",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Reach Nepal's most influential decision-makers and readers."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "A customer using a smartphone at a payment terminal" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Photo: iMin Technology / Pexels")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ask about advertising" })).toHaveAttribute(
      "href",
      "/contact",
    );
    window.localStorage.clear();
  });

  it("loops through the dummy ads from left to right and can pause", () => {
    window.localStorage.clear();
    vi.useFakeTimers();

    try {
      const { container } = render(
        <SitePreferencesProvider>
          <AdvertisementSlot />
        </SitePreferencesProvider>,
      );
      const activeHeading = () => container.querySelector(".home-advertisement__slide--active h3");
      const activeLink = () =>
        container.querySelector<HTMLAnchorElement>(".home-advertisement__slide--active a");

      expect(activeHeading()).toHaveTextContent("नेप दर्पण विज्ञापन साझेदार · प्रायोजित स्थान");
      expect(activeLink()).toHaveAttribute("href", "/contact");
      act(() => vi.advanceTimersByTime(6500));
      expect(activeHeading()).toHaveTextContent("नेप दर्पण साझेदार · ब्रान्ड अभियान");
      expect(activeLink()).toHaveAttribute("href", "/contact");
      expect(container.querySelector(".home-advertisement__slide--active img")).toHaveAttribute(
        "alt",
        "पुस्तकालयमा अध्ययन गरिरहेका विद्यार्थी",
      );
      expect(container.querySelector(".home-advertisement__slide--exiting h3")).toHaveTextContent(
        "नेप दर्पण विज्ञापन साझेदार · प्रायोजित स्थान",
      );

      fireEvent.click(screen.getByRole("button", { name: "विज्ञापन रोक्नुहोस्" }));
      expect(screen.getByRole("button", { name: "विज्ञापन पुनः चलाउनुहोस्" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      act(() => vi.advanceTimersByTime(13000));
      expect(activeHeading()).toHaveTextContent("नेप दर्पण साझेदार · ब्रान्ड अभियान");

      fireEvent.click(screen.getByRole("button", { name: "विज्ञापन पुनः चलाउनुहोस्" }));
      act(() => vi.advanceTimersByTime(6500));
      expect(activeHeading()).toHaveTextContent("नेप दर्पण विज्ञापन साझेदार · प्रायोजित स्थान");
    } finally {
      vi.useRealTimers();
      window.localStorage.clear();
    }
  });
});

describe("lead story, media, corrections, and references", () => {
  it("renders the supplied preview image with localized description and credit", () => {
    const { container } = render(
      <ArticleMedia
        media={{
          id: "image-01",
          kind: "image",
          src: "/stock-preview/library-students-pexels.jpg",
          alt: "काल्पनिक नगर भवनको बाहिरी दृश्य",
          altEn: "A fictional civic building",
          caption: "परीक्षणका लागि राखिएको तस्बिर क्याप्सन।",
          captionEn: "An illustrative photo caption for testing.",
          credit: "डेमो डेस्क",
          width: 1200,
          height: 800,
        }}
      />,
    );
    expect(screen.getByRole("img", { name: "काल्पनिक नगर भवनको बाहिरी दृश्य" })).toBeInTheDocument();
    expect(screen.getByText("परीक्षणका लागि राखिएको तस्बिर क्याप्सन।")).toBeInTheDocument();
    expect(screen.getByText("तस्बिर: डेमो डेस्क")).toBeInTheDocument();
    expect(container.querySelector(".article-media__placeholder")).not.toBeInTheDocument();
    expect(container.querySelector("video")).not.toBeInTheDocument();
  });

  it("localizes stock image alternative text and disclosure when the language changes", async () => {
    render(
      <SitePreferencesProvider>
        <SiteUtilityBar />
        <ArticleMedia
          media={{
            id: "image-localized",
            kind: "image",
            src: "/stock-preview/library-students-pexels.jpg",
            alt: "पुस्तकालयमा विद्यार्थी",
            altEn: "Students in a library",
            caption: "नमुना दृश्यका लागि स्टक तस्बिर।",
            captionEn: "Stock photo for the sample preview.",
            credit: "Pexels",
            width: 1440,
            height: 900,
          }}
        />
      </SitePreferencesProvider>,
    );

    expect(screen.getByRole("img", { name: "पुस्तकालयमा विद्यार्थी" })).toBeInTheDocument();
    fireEvent.click(await screen.findByRole("button", { name: "अंग्रेजीमा बदल्नुहोस्" }));
    expect(screen.getByRole("img", { name: "Students in a library" })).toBeInTheDocument();
    expect(screen.getByText("Stock photo for the sample preview.")).toBeInTheDocument();
  });

  it("renders video controls without loading the clip before the reader plays it", () => {
    const { container } = render(
      <ArticleMedia
        media={{
          id: "video-01",
          kind: "video",
          src: "/stock-preview/classroom-discussion-pexels.mp4",
          poster: {
            id: "poster-01",
            kind: "image",
            src: "/stock-preview/classroom-discussion-pexels-poster.jpg",
            alt: "काल्पनिक पहाडी दृश्य",
            altEn: "A fictional classroom scene",
            width: 1600,
            height: 900,
          },
          title: "डेमो भिडियो पूर्वावलोकन",
          titleEn: "Video preview",
          caption: "परीक्षणका लागि स्टक दृश्य।",
          captionEn: "Stock footage for testing.",
          credit: "डेमो डेस्क",
          durationSeconds: 72,
        }}
      />,
    );
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute(
      "poster",
      "/stock-preview/classroom-discussion-pexels-poster.jpg",
    );
    expect(video?.querySelector("source")).toHaveAttribute(
      "src",
      "/stock-preview/classroom-discussion-pexels.mp4",
    );
    expect(screen.getByText("परीक्षणका लागि स्टक दृश्य।")).toBeInTheDocument();
    expect(screen.getByText("७२ सेकेन्ड")).toBeInTheDocument();
    expect(screen.getByText("भिडियो: डेमो डेस्क")).toBeInTheDocument();
  });

  it("presents a lead story, correction detail, and related coverage", () => {
    const { container } = render(
      <>
        <LeadStory
          article={{
            ...story,
            leadMedia: {
              id: "image-02",
              kind: "image",
              src: "/fixture.jpg",
              alt: "काल्पनिक सम्पादकीय तस्बिर",
              width: 800,
              height: 500,
            },
            hasCorrection: true,
          }}
          variant="home"
        />
        <CorrectionNoticePanel
          notice={{
            id: "correction-01",
            text: "यो केवल UI परीक्षणका लागि लेखिएको सुधार नमुना हो।",
            correctedAt: "2026-10-05T07:00:00.000Z",
            reason: "काल्पनिक कारण",
          }}
        />
        <RelatedStories articles={[{ ...story, id: "related-01" }]} />
      </>,
    );
    expect(screen.getByRole("heading", { level: 2, name: story.headline })).toBeInTheDocument();
    const lead = container.querySelector<HTMLElement>(".lead-story");
    expect(lead).toBeInTheDocument();
    expect(lead).toHaveClass("lead-story--home");
    expect(within(lead as HTMLElement).getByRole("link", { name: "डेमो विषय" })).toBeInTheDocument();
    expect(lead?.querySelector(".lead-story__labels .story-label")).toBeNull();
    expect(
      within(lead as HTMLElement).getByRole("img", { name: "काल्पनिक सम्पादकीय तस्बिर" }),
    ).toBeInTheDocument();
    expect(lead?.firstElementChild).toHaveClass("lead-story__visual");
    expect(screen.getByLabelText("सम्पादकीय सुधार सूचना")).toHaveTextContent("काल्पनिक कारण");
    expect(screen.getByRole("heading", { name: "सम्बन्धित समाचार" })).toBeInTheDocument();
  });

  it("renders a lead with three important headlines and keeps remaining stories in the feed", async () => {
    window.localStorage.clear();
    const lead: ArticleCard = {
      ...story,
      id: "home-lead",
      headline: "मुख्य नमुना शीर्षक",
      href: "/lead",
      leadMedia: {
        id: "lead-image",
        kind: "image",
        src: "/stock-preview/library-students-pexels.jpg",
        alt: "मुख्य नमुना तस्बिर",
        altEn: "Lead sample image",
        caption: "काल्पनिक मुख्य कथा",
        captionEn: "Fictional lead story",
        credit: "डेमो स्रोत",
        width: 1440,
        height: 900,
      },
      hasCorrection: true,
    };
    const supportingStories = Array.from({ length: 4 }, (_, index) => ({
      ...story,
      id: `support-${index + 1}`,
      headline: `समर्थक नमुना समाचार ${index + 1}`,
      href: `/support-${index + 1}`,
      leadMedia: {
        id: `support-image-${index + 1}`,
        kind: "image" as const,
        src: "/stock-preview/library-students-pexels.jpg",
        alt: `समर्थक नमुना तस्बिर ${index + 1}`,
        altEn: `Supporting sample image ${index + 1}`,
        caption: "लेआउट परीक्षणका लागि स्टक तस्बिर।",
        captionEn: "Stock photo for layout testing.",
        credit: "डेमो स्रोत",
        width: 1440,
        height: 900,
      },
    }));
    const remainingStory: ArticleCard = {
      ...story,
      id: "latest-after-hero",
      headline: "होमपेजको बाँकी नमुना अपडेट",
      href: "/latest-after-hero",
    };
    const latest = [lead, ...supportingStories, remainingStory];
    const { container } = render(
      <SitePreferencesProvider>
        <SiteUtilityBar />
        <HomepageHero lead={lead} latest={latest} />
      </SitePreferencesProvider>,
    );

    const leadCard = container.querySelector(".home-hero-layout__lead .lead-story");
    const importantStories = screen.getByRole("complementary", { name: "महत्त्वपूर्ण शीर्षकहरू" });
    const layout = container.querySelector(".home-hero-layout");
    expect(layout).toHaveClass("home-hero-layout");
    expect(layout?.children[0]).toHaveClass("home-hero-layout__lead");
    expect(layout?.children[1]).toHaveClass("home-hero-side--important");
    expect(leadCard).toBeInTheDocument();
    expect(leadCard?.querySelector(".story-card__correction")).not.toBeInTheDocument();
    expect(container.querySelector(".home-hero-layout__lead")).toHaveAttribute(
      "aria-labelledby",
      "lead-home-lead",
    );
    expect(screen.getByRole("heading", { level: 1, name: lead.headline })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "मुख्य नमुना तस्बिर" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "विस्तृत पढ्नुहोस्" }).getAttribute("href")).toBe(lead.href);
    expect(importantStories.querySelectorAll(".home-hero-side__item")).toHaveLength(3);
    expect(container.querySelectorAll(".home-side-story__media")).toHaveLength(3);
    expect(container.querySelectorAll(".home-side-story .article-media__image")).toHaveLength(3);
    for (const supportingStory of supportingStories.slice(0, 3)) {
      expect(
        within(importantStories).getByRole("link", { name: supportingStory.headline }),
      ).toHaveAttribute("href", supportingStory.href);
      expect(
        within(importantStories).getByRole("img", {
          name: supportingStory.leadMedia?.alt as string,
        }),
      ).toBeInTheDocument();
    }

    const selected = selectHomepageHeroStories({ lead, latest });
    expect(selected.usedStoryIds.has(remainingStory.id)).toBe(false);
    expect(selected.usedStoryIds.has(supportingStories[2].id)).toBe(true);
    expect(selected.usedStoryIds.has(supportingStories[3].id)).toBe(false);
    expect(latest.filter((item) => !selected.usedStoryIds.has(item.id))).toEqual([
      supportingStories[3],
      remainingStory,
    ]);
    expect(container.querySelector(".home-breaking")).not.toBeInTheDocument();
    expect(container.querySelector(".home-secondary")).not.toBeInTheDocument();
    expect((await axe(container)).violations).toEqual([]);

    fireEvent.click(await screen.findByRole("button", { name: "अंग्रेजीमा बदल्नुहोस्" }));
    expect(screen.getByRole("complementary", { name: "Important headlines" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Switch to Nepali" }));
    expect(screen.getByRole("complementary", { name: "महत्त्वपूर्ण शीर्षकहरू" })).toBeInTheDocument();
  });

  it("handles an empty related list and does not link unsafe source URLs", () => {
    const maliciousSource: SourceReference = {
      label: "असुरक्षित परीक्षण स्रोत",
      href: "javascript:alert(1)",
    };
    const { rerender } = render(<RelatedStories articles={[]} />);
    expect(screen.getByText("सम्बन्धित समाचार उपलब्ध छैन")).toBeInTheDocument();
    rerender(<SourceAttribution sources={[maliciousSource]} />);
    expect(screen.getByText("असुरक्षित परीक्षण स्रोत").closest("a")).toBeNull();
  });

  it("passes automated accessibility scans for representative content states", async () => {
    const notice: CorrectionNotice = {
      id: "axe-correction",
      text: "काल्पनिक सुधार सूचना।",
      correctedAt: "2026-10-05T07:00:00.000Z",
    };
    const { container } = render(
      <>
        <LeadStory article={story} />
        <CorrectionNoticePanel notice={notice} />
        <SourceAttribution
          sources={[
            {
              label: "डेमो सन्दर्भ",
              href: "https://example.test/reference",
              publisher: "काल्पनिक प्रकाशक",
            },
          ]}
        />
        <RelatedStories articles={[story]} />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
