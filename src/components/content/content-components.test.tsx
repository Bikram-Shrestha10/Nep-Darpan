import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import type { ArticleCard, CorrectionNotice, SourceReference } from "@/lib/content/contracts";
import { ArticleMedia } from "@/components/content/article-media";
import { CorrectionNoticePanel } from "@/components/content/correction-notice";
import { RelatedStories } from "@/components/content/related-stories";
import { SourceAttribution } from "@/components/content/source-attribution";
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
    expect(container).not.toHaveTextContent(story.summary ?? "");
    expect(container.querySelector("figure")).not.toBeInTheDocument();
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

  it("shows distinct fact-check, opinion, sponsored, and breaking labels without duplicating kind labels", () => {
    const labeledStory = {
      ...story,
      kind: "opinion" as const,
      labels: ["opinion", "sponsored", "breaking"] as const,
    };
    const { rerender } = render(
      <StoryCard article={{ ...labeledStory, labels: [...labeledStory.labels] }} />,
    );
    expect(screen.getAllByText("विचार")).toHaveLength(1);
    expect(screen.getByText("प्रायोजित")).toBeInTheDocument();
    expect(screen.getByText("ब्रेकिङ")).toBeInTheDocument();
    rerender(<StoryCard article={{ ...story, kind: "fact_check", labels: [] }} />);
    expect(
      within(screen.getByRole("list", { name: "सम्पादकीय वर्गीकरण" })).getByText("तथ्य जाँच"),
    ).toBeInTheDocument();
    rerender(<StoryCard article={{ ...story, kind: "fact_check", labels: ["fact_check"] }} />);
    expect(screen.getAllByText("तथ्य जाँच")).toHaveLength(1);
  });
});

describe("lead story, media, corrections, and references", () => {
  it("renders a responsive image placeholder with alt text, caption, and credit", () => {
    render(
      <ArticleMedia
        media={{
          id: "image-01",
          kind: "image",
          src: "https://example.test/photo.jpg",
          alt: "काल्पनिक नगर भवनको बाहिरी दृश्य",
          caption: "परीक्षणका लागि राखिएको तस्बिर क्याप्सन।",
          credit: "डेमो डेस्क",
          width: 1200,
          height: 800,
        }}
      />,
    );
    expect(screen.getByRole("img", { name: "काल्पनिक नगर भवनको बाहिरी दृश्य" })).toBeInTheDocument();
    expect(screen.getByText("परीक्षणका लागि राखिएको तस्बिर क्याप्सन।")).toBeInTheDocument();
    expect(screen.getByText("तस्बिर/भिडियो: डेमो डेस्क")).toBeInTheDocument();
  });

  it("renders a video placeholder without implying that playback is active", () => {
    render(
      <ArticleMedia
        media={{
          id: "video-01",
          kind: "video",
          src: "https://example.test/video.mp4",
          poster: {
            id: "poster-01",
            kind: "image",
            src: "https://example.test/poster.jpg",
            alt: "काल्पनिक पहाडी दृश्य",
            width: 1600,
            height: 900,
          },
          title: "डेमो भिडियो पूर्वावलोकन",
          durationSeconds: 72,
          captionsUrl: "/captions.vtt",
        }}
      />,
    );
    expect(
      screen.getByRole("img", { name: /डेमो भिडियो पूर्वावलोकन.*काल्पनिक पहाडी दृश्य/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("डेमो भिडियो पूर्वावलोकन")).toBeInTheDocument();
    expect(screen.getByText("७२ सेकेन्ड")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("presents a lead story, correction detail, and related coverage", () => {
    render(
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
    expect(screen.getByRole("img", { name: "काल्पनिक सम्पादकीय तस्बिर" })).toBeInTheDocument();
    expect(screen.getByLabelText("सम्पादकीय सुधार सूचना")).toHaveTextContent("काल्पनिक कारण");
    expect(screen.getByRole("heading", { name: "सम्बन्धित समाचार" })).toBeInTheDocument();
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
