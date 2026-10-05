import type { HomePageData, LocaleCode, PublicContentGateway } from "@/lib/content/contracts";

export const MOCK_DATA_NOTICE =
  "All sample stories are fictional and exist only to verify the frontend.";

const demoCard = {
  id: "demo-story-001",
  storyGroupId: "demo-story-group-001",
  slug: "demo-story",
  locale: "ne-NP",
  kind: "news",
  headline: "डेमो शीर्षक: समाचार कार्डको पूर्वावलोकन",
  summary: "यो केवल UI परीक्षणका लागि राखिएको काल्पनिक सामग्री हो।",
  href: "/ne-NP/news/demo-story",
  category: { id: "demo-category", name: "डेमो", slug: "demo", locale: "ne-NP" },
  authors: [{ id: "demo-desk", name: "डेमो डेस्क", slug: "demo-desk", roleLabel: "काल्पनिक नमुना" }],
  publishedAt: "2026-10-05T06:00:00.000Z",
  leadMedia: {
    id: "demo-image-001",
    kind: "image",
    src: "/fixtures/fictional-image-preview.jpg",
    alt: "काल्पनिक समाचारका लागि नमुना तस्बिर पूर्वावलोकन",
    caption: "मिडिया एकीकरण नभएसम्म यो केवल पूर्वावलोकन हो।",
    credit: "काल्पनिक डेमो डेस्क",
    width: 1200,
    height: 800,
  },
  labels: [],
  hasCorrection: false,
} satisfies NonNullable<HomePageData["lead"]>;

const demoLatestCard = {
  ...demoCard,
  id: "demo-story-002",
  storyGroupId: "demo-story-group-002",
  slug: "demo-story-details",
  headline: "डेमो शीर्षक: अर्को समाचार कार्डको पूर्वावलोकन",
  summary: "यो पनि लेआउट जाँच्न राखिएको काल्पनिक नमुना सामग्री हो।",
  href: "/ne-NP/news/demo-story-details",
  publishedAt: "2026-10-05T05:00:00.000Z",
  leadMedia: undefined,
} satisfies NonNullable<HomePageData["latest"]>[number];

const homePages: Partial<Record<LocaleCode, HomePageData>> = {
  "ne-NP": {
    locale: "ne-NP",
    availableLocales: ["ne-NP"],
    breaking: [],
    lead: demoCard,
    latest: [demoCard, demoLatestCard],
    trending: [demoCard],
    sections: [],
    hubHighlights: [],
  },
};

export class LocaleUnavailableError extends Error {
  constructor(locale: LocaleCode) {
    super(`No reviewed fixture content is available for locale ${locale}.`);
    this.name = "LocaleUnavailableError";
  }
}

export const mockContentGateway: PublicContentGateway = {
  async getHome(locale) {
    const page = homePages[locale];
    if (!page) {
      throw new LocaleUnavailableError(locale);
    }
    return structuredClone(page);
  },
  async getCategory() {
    return null;
  },
  async getArticle() {
    return null;
  },
  async search(filters) {
    return {
      filters,
      results: [],
      pageInfo: { page: filters.page, pageSize: 10, totalItems: 0, totalPages: 0 },
    };
  },
  async getHubEntry() {
    return null;
  },
  async listHub(locale, page = 1) {
    return {
      locale,
      entries: [],
      pageInfo: { page, pageSize: 10, totalItems: 0, totalPages: 0 },
    };
  },
};
