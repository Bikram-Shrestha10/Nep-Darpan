import type {
  ArticleCard,
  CategorySummary,
  CategoryPageData,
  HomePageData,
  HubEntry,
  LocaleCode,
  PublishedArticle,
  PublicContentGateway,
} from "@/lib/content/contracts";
import { searchFixtureStories } from "@/lib/content/search-fixtures";

export const MOCK_DATA_NOTICE =
  "यस वेबसाइटका सबै समाचार र जानकारी केवल डिजाइन परीक्षणका लागि बनाइएका काल्पनिक नमुना हुन्।";

const author = {
  id: "demo-desk",
  name: "नमुना सम्पादकीय डेस्क",
  slug: "demo-desk",
  roleLabel: "काल्पनिक नमुना",
};
const categories = {
  society: { id: "demo-society", name: "समाज", slug: "society", locale: "ne-NP" },
  economy: { id: "demo-economy", name: "अर्थतन्त्र", slug: "economy", locale: "ne-NP" },
  technology: { id: "demo-technology", name: "प्रविधि", slug: "technology", locale: "ne-NP" },
  politics: { id: "demo-politics", name: "राजनीति", slug: "politics", locale: "ne-NP" },
  world: { id: "demo-world", name: "विश्व", slug: "world", locale: "ne-NP" },
  opinion: { id: "demo-opinion", name: "विचार", slug: "opinion", locale: "ne-NP" },
} as const;
export const MOCK_SEARCH_CATEGORIES: CategorySummary[] = Object.values(categories);

const media = {
  id: "fictional-preview-image",
  kind: "image" as const,
  src: "/fixtures/fictional-image-preview.jpg",
  alt: "काल्पनिक समाचार लेआउटका लागि बनाइएको तस्बिर पूर्वावलोकन",
  caption: "यो वास्तविक घटनाको तस्बिर होइन; केवल डिजाइन पूर्वावलोकन हो।",
  credit: "काल्पनिक नमुना",
  width: 1200,
  height: 800,
};

const cards: ArticleCard[] = [
  {
    id: "demo-story-001",
    storyGroupId: "demo-group-001",
    slug: "demo-story",
    locale: "ne-NP",
    kind: "news",
    headline: "काल्पनिक नमुना: स्थानीय पुस्तकालयमा डिजिटल पठन कक्ष सुरु",
    summary: "यो काल्पनिक उदाहरणले स्थानीय सेवा र त्यसको प्रभावबारे समाचार पृष्ठ कस्तो देखिन सक्छ भन्ने देखाउँछ।",
    href: "/ne-NP/news/demo-story",
    category: categories.society,
    authors: [author],
    publishedAt: "2026-10-05T06:00:00.000Z",
    labels: [],
    leadMedia: media,
    hasCorrection: true,
  },
  {
    id: "demo-story-002",
    storyGroupId: "demo-group-002",
    slug: "demo-story-details",
    locale: "ne-NP",
    kind: "analysis",
    headline: "काल्पनिक नमुना: साना व्यवसायका लागि डिजिटल भुक्तानीको बदलिँदो प्रयोग",
    summary: "उदाहरणका लागि तयार गरिएको यो सामग्रीले व्यवसाय र ग्राहकबीचको भुक्तानी अनुभवको चर्चा गर्छ।",
    href: "/ne-NP/news/demo-story-details",
    category: categories.economy,
    authors: [author],
    publishedAt: "2026-10-05T05:00:00.000Z",
    labels: ["analysis"],
    hasCorrection: false,
  },
  {
    id: "demo-story-003",
    storyGroupId: "demo-group-003",
    slug: "demo-community",
    locale: "ne-NP",
    kind: "news",
    headline: "काल्पनिक नमुना: सामुदायिक केन्द्रमा निःशुल्क डिजिटल सीप कक्षा",
    summary: "कक्षा, सहभागिता र पहुँचका पक्ष देखाउन तयार गरिएको पूर्णतः काल्पनिक समाचार उदाहरण।",
    href: "/ne-NP/news/demo-community",
    category: categories.technology,
    authors: [author],
    publishedAt: "2026-10-04T12:15:00.000Z",
    labels: [],
    hasCorrection: false,
  },
  {
    id: "demo-story-004",
    storyGroupId: "demo-group-004",
    slug: "demo-civic",
    locale: "ne-NP",
    kind: "news",
    headline: "काल्पनिक नमुना: नगर सेवा सूचना एउटै पोर्टलमा राख्ने प्रस्ताव",
    summary: "स्थानीय सूचना पृष्ठ र सार्वजनिक सेवासम्बन्धी सामग्रीको दृश्य नमुना।",
    href: "/ne-NP/news/demo-civic",
    category: categories.politics,
    authors: [author],
    publishedAt: "2026-10-04T09:20:00.000Z",
    labels: [],
    hasCorrection: false,
  },
  {
    id: "demo-story-005",
    storyGroupId: "demo-group-005",
    slug: "demo-world",
    locale: "ne-NP",
    kind: "news",
    headline: "काल्पनिक नमुना: क्षेत्रीय पुस्तक मेलामा लेखकबीच संवाद",
    summary: "विश्व खण्डको नमुना कार्ड; वास्तविक सम्मेलन वा सहभागीको विवरण होइन।",
    href: "/ne-NP/news/demo-world",
    category: categories.world,
    authors: [author],
    publishedAt: "2026-10-03T10:00:00.000Z",
    labels: [],
    hasCorrection: false,
  },
  {
    id: "demo-story-006",
    storyGroupId: "demo-group-006",
    slug: "demo-opinion",
    locale: "ne-NP",
    kind: "opinion",
    headline: "विचार नमुना: सार्वजनिक पुस्तकालयको बदलिँदो भूमिका",
    summary: "यो काल्पनिक विचार सामग्री हो; लेखकको वास्तविक मत वा रिपोर्टिङ होइन।",
    href: "/ne-NP/news/demo-opinion",
    category: categories.opinion,
    authors: [author],
    publishedAt: "2026-10-02T09:00:00.000Z",
    labels: ["opinion"],
    hasCorrection: false,
  },
];

const article: PublishedArticle = {
  ...cards[0],
  status: "published",
  body: [
    {
      type: "paragraph",
      text: "यो नमुना लेख पूर्णतः काल्पनिक हो। वास्तविक संस्था, घटना वा सेवाबारे कुनै दाबी गर्दैन। यसको उद्देश्य लेख पृष्ठमा शीर्षक, सारांश, लेखक, समय, मिडिया र स्रोतका भागहरू कसरी मिल्छन् भन्ने देखाउनु मात्र हो।",
    },
    { type: "heading", level: 2, text: "पृष्ठले देखाउने मुख्य विवरण" },
    {
      type: "paragraph",
      text: "प्रकाशित समाचारमा सम्पादकीय समीक्षा पछि पुष्टि भएका तथ्य, स्पष्ट स्रोत, सान्दर्भिक पृष्ठभूमि र पाठकले बुझ्न सक्ने भाषा समावेश हुनुपर्छ। यस डेमोमा भने कुनै तथ्य पुष्टि गरिएको छैन।",
    },
    {
      type: "quote",
      text: "यो उद्धरण पनि लेआउट जाँच्न बनाइएको काल्पनिक पाठ हो।",
      attribution: "काल्पनिक नमुना",
    },
    {
      type: "list",
      ordered: false,
      items: ["स्रोत र सन्दर्भ देखाउने ठाउँ", "सम्पादन तथा सुधार इतिहास", "सम्बन्धित रिपोर्टिङका लिङ्क"],
    },
  ],
  corrections: [
    {
      id: "demo-correction-001",
      text: "प्रारम्भिक नमुनामा कक्षाको नाम सच्याइएको छ।",
      reason: "लेआउट जाँचका लागि काल्पनिक सुधार इतिहास।",
      correctedAt: "2026-10-05T07:00:00.000Z",
    },
  ],
  sources: [
    {
      label: "काल्पनिक सम्पादकीय नोट",
      href: "https://example.invalid/demo-source",
      publisher: "डेमो सामग्री; वास्तविक स्रोत होइन।",
    },
  ],
  related: cards.slice(1, 3),
  seo: {
    title: "काल्पनिक नमुना समाचार",
    description: "समाचार लेख पृष्ठको काल্পनिक UI नमुना।",
    canonicalUrl: "https://example.invalid/ne-NP/news/demo-story",
    socialImage: media,
  },
};

const hubEntries: HubEntry[] = [
  {
    id: "demo-explainer",
    slug: "demo-explainer",
    locale: "ne-NP",
    kind: "explainer",
    title: "व्याख्या नमुना: सार्वजनिक बजेट कसरी पढ्ने?",
    summary: "विषय व्याख्या पृष्ठको संरचना देखाउन बनाइएको काल्पनिक उदाहरण; कुनै वास्तविक बजेटको विश्लेषण होइन।",
    reviewedAt: "2026-10-05T05:30:00.000Z",
    nextReviewAt: "2026-11-05T05:30:00.000Z",
    evidence: [],
    related: [cards[1]],
    body: [
      {
        type: "paragraph",
        text: "यो व्याख्या पूर्णतः काल्पनिक हो। बजेट कागजातको परिचय, आम्दानी र खर्चका शीर्षक, अनि स्रोत जाँच्ने तरिका बुझाउने सामग्री कसरी क्रमबद्ध गर्न सकिन्छ भन्ने मात्र देखाउँछ।",
      },
      { type: "heading", level: 2, text: "पृष्ठभूमि र स्रोत कसरी जोडिन्छन्" },
      {
        type: "paragraph",
        text: "वास्तविक व्याख्यामा आधिकारिक कागजात, स्पष्ट परिभाषा र समीक्षाको मिति देखाइनुपर्छ। यहाँ कुनै वास्तविक बजेट तथ्य समावेश छैन।",
      },
    ],
  },
  {
    id: "demo-guide",
    slug: "demo-guide",
    locale: "ne-NP",
    kind: "guide",
    title: "मार्गदर्शिका नमुना: अनलाइन सूचना जाँच्ने आधारभूत चरण",
    summary: "सूचना जाँच मार्गदर्शिकाको दृश्य नमुना, वास्तविक दाबी वा घटनासँग सम्बन्धित छैन।",
    reviewedAt: "2026-10-03T05:30:00.000Z",
    evidence: [],
    related: [cards[2]],
    body: [
      {
        type: "paragraph",
        text: "यो काल्पनिक मार्गदर्शिका सामग्रीको नमुना हो। डिजिटल सामग्री जाँच्ने पृष्ठमा चरण, सावधानी र स्रोत खुलाउने भागहरू कहाँ राख्न सकिन्छ भन्ने देखाउँछ।",
      },
      {
        type: "list",
        ordered: true,
        items: ["मूल प्रकाशक पहिचान गर्ने", "प्रकाशन समय र सन्दर्भ जाँच्ने", "स्वतन्त्र स्रोतसँग तुलना गर्ने"],
      },
    ],
  },
  {
    id: "demo-fact-check",
    slug: "demo-fact-check",
    locale: "ne-NP",
    kind: "fact_check",
    title: "तथ्य जाँच नमुना: निष्कर्ष नभएको परीक्षण पृष्ठ",
    summary: "यो केवल तथ्य-जाँच पृष्ठको लेआउट नमुना हो। कुनै वास्तविक दाबीको परीक्षण गरिएको छैन।",
    reviewedAt: "2026-10-05T04:00:00.000Z",
    evidence: [],
    related: [],
    body: [
      {
        type: "paragraph",
        text: "यस नमुना पृष्ठमा जाँच्नुपर्ने वास्तविक दाबी, प्रमाण वा निष्कर्ष छैन। वास्तविक तथ्य-जाँचमा दाबीलाई स्पष्ट रूपमा उद्धृत गरी प्रमाण, पद्धति, सीमा र समीक्षाको विवरण दिनुपर्छ।",
      },
    ],
  },
];

const categoryData: Record<string, CategoryPageData> = Object.fromEntries(
  Object.values(categories).map((category) => {
    const articles = cards.filter((card) => card.category.slug === category.slug);
    return [
      category.slug,
      {
        locale: "ne-NP",
        category,
        lead: articles[0],
        articles,
        pageInfo: { page: 1, pageSize: 10, totalItems: articles.length, totalPages: 1 },
      },
    ];
  }),
);

const homePage: HomePageData = {
  locale: "ne-NP",
  availableLocales: ["ne-NP"],
  breaking: [],
  lead: cards[0],
  latest: cards,
  trending: [cards[1], cards[2]],
  sections: [
    { category: categories.society, lead: cards[0], articles: [cards[0]] },
    { category: categories.economy, lead: cards[1], articles: [cards[1]] },
    { category: categories.technology, lead: cards[2], articles: [cards[2]] },
    { category: categories.politics, lead: cards[3], articles: [cards[3]] },
    { category: categories.world, lead: cards[4], articles: [cards[4]] },
    { category: categories.opinion, lead: cards[5], articles: [cards[5]] },
  ],
  hubHighlights: hubEntries,
};

export class LocaleUnavailableError extends Error {
  constructor(locale: LocaleCode) {
    super(`No reviewed fixture content is available for locale ${locale}.`);
    this.name = "LocaleUnavailableError";
  }
}

export const mockContentGateway: PublicContentGateway = {
  async listCategories(locale) {
    if (locale !== "ne-NP") return [];
    return structuredClone(MOCK_SEARCH_CATEGORIES);
  },
  async getHome(locale) {
    if (locale !== "ne-NP") throw new LocaleUnavailableError(locale);
    return structuredClone(homePage);
  },
  async getCategory(locale, slug, requestedPage = 1) {
    if (locale !== "ne-NP") return null;
    const source = categoryData[slug];
    if (!source) return null;
    const pageSize = source.pageInfo.pageSize;
    const totalItems = source.articles.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const page = Math.max(1, Math.min(requestedPage, Math.max(totalPages, 1)));
    const start = (page - 1) * pageSize;
    return {
      ...structuredClone(source),
      articles: structuredClone(source.articles.slice(start, start + pageSize)),
      pageInfo: { page, pageSize, totalItems, totalPages },
    };
  },
  async getArticle(locale, slug) {
    if (locale !== "ne-NP") return null;
    const found = cards.find((item) => item.slug === slug);
    if (!found) return null;
    if (slug === article.slug) return structuredClone(article);
    return structuredClone({
      ...found,
      status: "published" as const,
      body: [
        {
          type: "paragraph" as const,
          text: "यो लेख डिजाइन परीक्षणका लागि बनाइएको पूर्णतः काल्पनिक सामग्री हो; यसले वास्तविक व्यवसाय वा घटनाबारे दाबी गर्दैन।",
        },
      ],
      corrections: [],
      sources: [],
      related: cards.filter((item) => item.slug !== slug).slice(0, 2),
      seo: {
        title: found.headline,
        description: found.summary ?? "काल्पनिक नमुना लेख।",
        canonicalUrl: `https://example.invalid${found.href}`,
      },
    });
  },
  async search(filters) {
    return searchFixtureStories(cards, filters);
  },
  async getHubEntry(locale, slug) {
    if (locale !== "ne-NP") return null;
    return structuredClone(hubEntries.find((entry) => entry.slug === slug) ?? null);
  },
  async listHub(locale, page = 1, kind) {
    if (locale !== "ne-NP")
      return {
        locale,
        entries: [],
        pageInfo: { page: 1, pageSize: 10, totalItems: 0, totalPages: 0 },
      };
    const pageSize = 10;
    const matchingEntries = kind ? hubEntries.filter((entry) => entry.kind === kind) : hubEntries;
    const totalItems = matchingEntries.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentPage = Math.max(1, Math.min(page, Math.max(totalPages, 1)));
    const start = (currentPage - 1) * pageSize;
    return {
      locale,
      entries: structuredClone(matchingEntries.slice(start, start + pageSize)),
      pageInfo: { page: currentPage, pageSize, totalItems, totalPages },
    };
  },
};
