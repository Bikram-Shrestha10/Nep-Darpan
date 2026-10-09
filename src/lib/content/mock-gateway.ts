import type {
  ArticleCard,
  AuthorSummary,
  CategoryPageData,
  CategorySummary,
  HomePageData,
  HubEntry,
  ImageMedia,
  LocaleCode,
  PublicContentGateway,
  PublishedArticle,
  ReelCard,
  VideoMedia,
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

const stockImageCaption =
  "डिजाइन पूर्वावलोकनका लागि राखिएको स्टक तस्बिर; यसले नमुना समाचारको वास्तविक दृश्य देखाउँदैन।";
const stockImageCaptionEn =
  "Stock photo for the design preview; it does not depict the fictional sample story.";

function stockImage(
  id: string,
  src: string,
  alt: string,
  altEn: string,
  credit: string,
  width: number,
  height: number,
): ImageMedia {
  return {
    id,
    kind: "image",
    src,
    alt,
    altEn,
    caption: stockImageCaption,
    captionEn: stockImageCaptionEn,
    credit,
    width,
    height,
  };
}

const libraryImage = stockImage(
  "stock-library-students-pexels",
  "/stock-preview/library-students-pexels.jpg",
  "पुस्तकालयमा किताब पढिरहेका दुई विद्यार्थी",
  "Two students reading books in a library",
  "Thirdman / Pexels",
  1440,
  900,
);
const paymentImage = stockImage(
  "stock-mobile-payment-pexels",
  "/stock-preview/mobile-payment-pexels.jpg",
  "काउन्टरमा स्मार्टफोनबाट भुक्तानी गरिँदै",
  "A customer using a smartphone at a payment terminal",
  "iMin Technology / Pexels",
  1440,
  900,
);
const computerClassImage = stockImage(
  "stock-computer-classroom-pixabay",
  "/stock-preview/computer-classroom-pixabay.jpg",
  "डेस्कटप कम्प्युटर राखिएको कक्षाकोठा",
  "A classroom with desktop computers",
  "wipperfürth / Pixabay",
  1280,
  960,
);
const libraryShelvesImage = stockImage(
  "stock-library-books-pixabay",
  "/stock-preview/library-books-pixabay.jpg",
  "पुस्तक र पाठकहरू भएको पुस्तकालयको भित्री भाग",
  "Library shelves with books and readers",
  "Pixabay",
  1280,
  716,
);
const digitalWorkImage = stockImage(
  "stock-typing-coverr",
  "/stock-preview/typing-coverr-image.webp",
  "ल्यापटपमा टाइप गरिरहेका हात",
  "Hands typing on a laptop",
  "Coverr",
  1920,
  1080,
);

const stockVideoCaption = "डिजाइन पूर्वावलोकनका लागि स्टक दृश्य; यो नमुना समाचारको वास्तविक भिडियो होइन।";
const stockVideoCaptionEn =
  "Stock footage for the design preview; it is not a recording of the fictional sample story.";

const classroomVideo: VideoMedia = {
  id: "stock-classroom-reel-pexels",
  kind: "video",
  src: "/stock-preview/classroom-discussion-pexels.mp4",
  poster: stockImage(
    "stock-classroom-reel-poster-pexels",
    "/stock-preview/classroom-discussion-pexels-poster.jpg",
    "कक्षाकोठामा छलफल गरिरहेका विद्यार्थी",
    "Students discussing a topic in a classroom",
    "Ivan S / Pexels",
    900,
    1600,
  ),
  title: "कक्षाकोठामा विद्यार्थीबीच छलफल",
  titleEn: "Students discussing a topic in a classroom",
  caption: stockVideoCaption,
  captionEn: stockVideoCaptionEn,
  credit: "Ivan S / Pexels",
  durationSeconds: 14,
};

const typingVideo: VideoMedia = {
  id: "stock-typing-reel-coverr",
  kind: "video",
  src: "/stock-preview/typing-macbook-coverr.mp4",
  poster: digitalWorkImage,
  title: "ल्यापटपमा टाइप गरिँदै",
  titleEn: "Typing on a laptop",
  caption: stockVideoCaption,
  captionEn: stockVideoCaptionEn,
  credit: "Coverr",
  durationSeconds: 15,
};

const typingCloseupVideo: VideoMedia = {
  id: "stock-typing-closeup-reel-pexels",
  kind: "video",
  src: "/stock-preview/typing-closeup-pexels.mp4",
  poster: stockImage(
    "stock-typing-closeup-poster-pexels",
    "/stock-preview/typing-closeup-pexels-poster.jpg",
    "किबोर्डमा टाइप गरिरहेका हात",
    "Hands typing on a keyboard",
    "Alena Darmel / Pexels",
    900,
    1600,
  ),
  title: "किबोर्डमा टाइप गरिँदै",
  titleEn: "Typing on a keyboard",
  caption: stockVideoCaption,
  captionEn: stockVideoCaptionEn,
  credit: "Alena Darmel / Pexels",
  durationSeconds: 10,
};

const trafficLightsVideo: VideoMedia = {
  id: "stock-traffic-lights-reel-pexels",
  kind: "video",
  src: "/stock-preview/city-traffic-lights-pexels.mp4",
  poster: stockImage(
    "stock-traffic-lights-reel-poster-pexels",
    "/stock-preview/city-traffic-lights-pexels-poster.jpg",
    "सहरको सडकमा ट्राफिक बत्ती",
    "Traffic lights on a city street",
    "Laura Tancredi / Pexels",
    900,
    1600,
  ),
  title: "सहरको सडकमा ट्राफिक संकेत",
  titleEn: "Traffic signals on a city street",
  caption: stockVideoCaption,
  captionEn: stockVideoCaptionEn,
  credit: "Laura Tancredi / Pexels",
  durationSeconds: 10,
};

const taxiMeterVideo: VideoMedia = {
  id: "stock-taxi-meter-reel-pexels",
  kind: "video",
  src: "/stock-preview/taxi-meter-pexels.mp4",
  poster: stockImage(
    "stock-taxi-meter-reel-poster-pexels",
    "/stock-preview/taxi-meter-pexels-poster.jpg",
    "ट्याक्सीको भाडा मिटर चलाउँदै",
    "A taxi fare meter being operated",
    "Tim Samuel / Pexels",
    900,
    1600,
  ),
  title: "ट्याक्सीको भाडा मिटर",
  titleEn: "A taxi fare meter",
  caption: stockVideoCaption,
  captionEn: stockVideoCaptionEn,
  credit: "Tim Samuel / Pexels",
  durationSeconds: 10,
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
    leadMedia: libraryImage,
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
    labels: ["analysis", "breaking"],
    leadMedia: paymentImage,
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
    leadMedia: computerClassImage,
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
    labels: ["breaking"],
    leadMedia: digitalWorkImage,
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
    leadMedia: libraryShelvesImage,
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
    leadMedia: digitalWorkImage,
    hasCorrection: false,
  },
];

function createHomepageSectionStory({
  id,
  slug,
  category,
  headline,
  summary,
  publishedAt,
  leadMedia,
  kind = "news",
  authors,
}: {
  id: string;
  slug: string;
  category: CategorySummary;
  headline: string;
  summary: string;
  publishedAt: string;
  leadMedia: ImageMedia;
  kind?: ArticleCard["kind"];
  authors?: AuthorSummary[];
}): ArticleCard {
  return {
    id,
    storyGroupId: `demo-group-${id}`,
    slug,
    locale: "ne-NP",
    kind,
    headline,
    summary,
    href: `/ne-NP/news/${slug}`,
    category,
    authors: authors ?? [author],
    publishedAt,
    labels: kind === "opinion" ? ["opinion"] : [],
    leadMedia,
    hasCorrection: false,
  };
}

const homepageSectionStories: ArticleCard[] = [
  createHomepageSectionStory({
    id: "demo-section-society-02",
    slug: "demo-society-reading-club",
    category: categories.society,
    headline: "काल्पनिक नमुना: समुदायमा बालपठन क्लब सञ्चालनको ढाँचा",
    summary: "यो सामुदायिक कार्यक्रमको संरचना देखाउने काल्पनिक उदाहरण हो; कुनै संस्था वा आयोजना वास्तविक होइन।",
    publishedAt: "2026-10-03T08:30:00.000Z",
    leadMedia: libraryShelvesImage,
  }),
  createHomepageSectionStory({
    id: "demo-section-economy-02",
    slug: "demo-local-business-records",
    category: categories.economy,
    headline: "काल्पनिक नमुना: साना उद्यमका लागि डिजिटल हिसाबकिताबको अभ्यास",
    summary: "स्थानीय उद्यमले डिजिटल अभिलेख प्रयोग गर्न सक्ने ढाँचा देखाउन बनाइएको नमुना।",
    publishedAt: "2026-10-03T07:20:00.000Z",
    leadMedia: digitalWorkImage,
  }),
  createHomepageSectionStory({
    id: "demo-section-technology-02",
    slug: "demo-classroom-learning-tools",
    category: categories.technology,
    headline: "काल्पनिक नमुना: कक्षाकोठामा डिजिटल सिकाइ सामग्रीको प्रयोग",
    summary: "विद्यालयमा प्रविधि समावेश गर्ने सम्भावित ढाँचाको काल्पनिक प्रस्तुति मात्र।",
    publishedAt: "2026-10-03T06:10:00.000Z",
    leadMedia: libraryImage,
  }),
  createHomepageSectionStory({
    id: "demo-section-politics-02",
    slug: "demo-public-information-page",
    category: categories.politics,
    headline: "काल्पनिक नमुना: नागरिक सूचना एउटै पृष्ठमा देखाउने प्रस्ताव",
    summary: "यो नागरिक सूचना प्रस्तुत गर्ने UI नमुना हो; कुनै सरकारी निर्णयको विवरण होइन।",
    publishedAt: "2026-10-02T10:45:00.000Z",
    leadMedia: paymentImage,
  }),
  createHomepageSectionStory({
    id: "demo-section-world-02",
    slug: "demo-regional-library-network",
    category: categories.world,
    headline: "काल्पनिक नमुना: क्षेत्रीय पुस्तकालयका लागि साझा डिजिटल सूची",
    summary: "अन्तरपुस्तकालय सहकार्यको काल्पनिक अवधारणा; कुनै वास्तविक सम्झौता होइन।",
    publishedAt: "2026-10-02T09:15:00.000Z",
    leadMedia: computerClassImage,
  }),
  createHomepageSectionStory({
    id: "demo-section-opinion-02",
    slug: "demo-open-knowledge-centres",
    category: categories.opinion,
    headline: "काल्पनिक नमुना: सबै पाठकका लागि खुला ज्ञान केन्द्रको महत्व",
    summary: "यो विचार स्तम्भको नमुना हो; वास्तविक लेखक वा संस्थाको धारणा होइन।",
    publishedAt: "2026-10-01T11:30:00.000Z",
    leadMedia: paymentImage,
    kind: "opinion",
  }),
];

function createPoliticsPreviewStory({
  id,
  slug,
  headline,
  summary,
  publishedAt,
  leadMedia,
  kind = "news",
}: {
  id: string;
  slug: string;
  headline: string;
  summary: string;
  publishedAt: string;
  leadMedia: ImageMedia;
  kind?: ArticleCard["kind"];
}): ArticleCard {
  const labels: ArticleCard["labels"] =
    kind === "analysis" || kind === "opinion" || kind === "fact_check" ? [kind] : [];
  return {
    id,
    storyGroupId: `demo-group-${id}`,
    slug,
    locale: "ne-NP",
    kind,
    headline,
    summary,
    href: `/ne-NP/news/${slug}`,
    category: categories.politics,
    authors: [author],
    publishedAt,
    labels,
    leadMedia,
    hasCorrection: false,
  };
}

const politicsPreviewStories: ArticleCard[] = [
  createPoliticsPreviewStory({
    id: "demo-politics-agenda-explainer",
    slug: "demo-politics-agenda-explainer",
    kind: "explainer",
    headline: "काल्पनिक व्याख्या नमुना: प्रतिनिधिसभाको कार्यसूची कसरी पढ्ने",
    summary:
      "संसदीय कार्यसूचीका शीर्षक र प्रक्रिया बुझाउने पृष्ठको काल्पनिक रूपरेखा; कुनै वास्तविक बैठकको विवरण होइन।",
    publishedAt: "2026-10-05T09:10:00.000Z",
    leadMedia: digitalWorkImage,
  }),
  createPoliticsPreviewStory({
    id: "demo-politics-federal-analysis",
    slug: "demo-politics-federal-analysis",
    kind: "analysis",
    headline: "काल्पनिक विश्लेषण नमुना: संघीय तहबीच सार्वजनिक सेवा समन्वय",
    summary:
      "संघ, प्रदेश र स्थानीय तहबीच जिम्मेवारी बुझाउने काल्पनिक विश्लेषण ढाँचा; वास्तविक सरकारी कामको मूल्याङ्कन होइन।",
    publishedAt: "2026-10-05T07:30:00.000Z",
    leadMedia: computerClassImage,
  }),
  createPoliticsPreviewStory({
    id: "demo-politics-budget-input",
    slug: "demo-politics-budget-input",
    headline: "काल्पनिक नमुना: स्थानीय बजेट प्रस्तावमा नागरिक सुझाव संकलन",
    summary:
      "सार्वजनिक बजेट छलफलको सूचना र प्रतिक्रिया कसरी देखाउन सकिन्छ भन्ने नमुना; कुनै वास्तविक बजेट वा परामर्श होइन।",
    publishedAt: "2026-10-04T14:10:00.000Z",
    leadMedia: paymentImage,
  }),
  createPoliticsPreviewStory({
    id: "demo-politics-accountability-opinion",
    slug: "demo-politics-accountability-opinion",
    kind: "opinion",
    headline: "काल्पनिक विचार नमुना: सार्वजनिक निर्णयमा जवाफदेहिताको भूमिका",
    summary: "विचार सामग्रीको लेआउट जाँच्न बनाइएको काल्पनिक पाठ; कुनै वास्तविक लेखकको धारणा वा समर्थन होइन।",
    publishedAt: "2026-10-04T08:10:00.000Z",
    leadMedia: digitalWorkImage,
  }),
  createPoliticsPreviewStory({
    id: "demo-politics-claim-check",
    slug: "demo-politics-claim-check",
    kind: "fact_check",
    headline: "काल्पनिक तथ्य-जाँच ढाँचा: सार्वजनिक दाबीको स्रोत परीक्षण",
    summary: "यो तथ्य-जाँचको संरचना मात्र हो; कुनै वास्तविक दाबी, प्रमाण वा निष्कर्ष जाँचिएको छैन।",
    publishedAt: "2026-10-03T12:00:00.000Z",
    leadMedia: libraryShelvesImage,
  }),
  createPoliticsPreviewStory({
    id: "demo-politics-policy-review",
    slug: "demo-politics-policy-review",
    headline: "काल्पनिक नमुना: सार्वजनिक नीति प्रस्तावको समीक्षा तालिका",
    summary: "नीति प्रस्तावमा उद्देश्य, प्रभाव र प्रश्नहरू देखाउने सम्पादकीय तालिकाको काल्पनिक उदाहरण।",
    publishedAt: "2026-10-02T07:10:00.000Z",
    leadMedia: computerClassImage,
  }),
];

const economyPreviewStories: ArticleCard[] = [
  createHomepageSectionStory({
    id: "demo-economy-local-enterprise",
    slug: "demo-economy-local-enterprise",
    category: categories.economy,
    kind: "news",
    headline: "काल्पनिक नमुना: स्थानीय उद्यमका लागि लागत अभिलेखको सरल ढाँचा",
    summary:
      "यो उदाहरणले साना उद्यमले आफ्नो खर्च वर्गीकरण गरेर राख्ने तरिका देखाउँछ; कुनै वास्तविक व्यवसायको विवरण होइन।",
    publishedAt: "2026-10-08T10:20:00.000Z",
    leadMedia: paymentImage,
  }),
  createHomepageSectionStory({
    id: "demo-economy-exports-analysis",
    slug: "demo-economy-exports-analysis",
    category: categories.economy,
    kind: "analysis",
    headline: "काल्पनिक विश्लेषण: स्थानीय उत्पादन बजारसम्म पुग्ने सम्भावित बाटा",
    summary:
      "उत्पादन, ढुवानी र बजार पहुँचका पक्ष बुझाउन बनाइएको अभ्यास सामग्री; वास्तविक व्यापार तथ्याङ्क समावेश छैन।",
    publishedAt: "2026-10-08T08:45:00.000Z",
    leadMedia: digitalWorkImage,
  }),
  createHomepageSectionStory({
    id: "demo-economy-household-guide",
    slug: "demo-economy-household-guide",
    category: categories.economy,
    kind: "guide",
    headline: "काल्पनिक मार्गदर्शिका: घरपरिवारको मासिक खर्च योजना बनाउने चरण",
    summary: "आम्दानी र खर्च छुट्याएर लेख्ने व्यक्तिगत बजेट ढाँचा देखाउने अभ्यास; यो लगानी वा वित्तीय सल्लाह होइन।",
    publishedAt: "2026-10-07T13:30:00.000Z",
    leadMedia: libraryShelvesImage,
  }),
  createHomepageSectionStory({
    id: "demo-economy-remittance-news",
    slug: "demo-economy-remittance-news",
    category: categories.economy,
    kind: "news",
    headline: "काल्पनिक नमुना: विप्रेषणसम्बन्धी जानकारी एउटै सहायता पृष्ठमा",
    summary:
      "सेवा, शुल्क र सम्पर्क विवरण कसरी स्पष्ट राख्ने भन्ने देखाउने काल्पनिक समाचार नमुना; वास्तविक सेवा घोषणा होइन।",
    publishedAt: "2026-10-07T09:10:00.000Z",
    leadMedia: computerClassImage,
  }),
  createHomepageSectionStory({
    id: "demo-economy-market-opinion",
    slug: "demo-economy-market-opinion",
    category: categories.economy,
    kind: "opinion",
    headline: "काल्पनिक विचार: आर्थिक समाचारमा स्रोत र समय किन खुलाउनुपर्छ",
    summary:
      "बजार वा नीतिबारे सामग्री पढ्दा स्रोत र मिति हेर्ने महत्त्वबारे काल्पनिक सम्पादकीय अभ्यास; वास्तविक लेखकको धारणा होइन।",
    publishedAt: "2026-10-06T15:00:00.000Z",
    leadMedia: paymentImage,
  }),
  createHomepageSectionStory({
    id: "demo-economy-budget-explainer",
    slug: "demo-economy-budget-explainer",
    category: categories.economy,
    kind: "explainer",
    headline: "काल्पनिक व्याख्या: सार्वजनिक बजेटका मुख्य शीर्षक कसरी बुझ्ने",
    summary: "आम्दानी, खर्च र प्राथमिकता छुट्याउने शब्दावली बुझाउने नमुना; कुनै वास्तविक बजेटको विश्लेषण होइन।",
    publishedAt: "2026-10-06T11:25:00.000Z",
    leadMedia: libraryShelvesImage,
  }),
  createHomepageSectionStory({
    id: "demo-economy-cooperative-fact-check",
    slug: "demo-economy-cooperative-fact-check",
    category: categories.economy,
    kind: "fact_check",
    headline: "काल्पनिक तथ्य-जाँच ढाँचा: सहकारी दाबीको स्रोत कसरी टिपोट गर्ने",
    summary:
      "यो जाँच अभिलेखको खाली ढाँचा मात्र हो; कुनै वास्तविक संस्था, दाबी वा वित्तीय अवस्थाको परीक्षण गरिएको छैन।",
    publishedAt: "2026-10-06T08:00:00.000Z",
    leadMedia: digitalWorkImage,
  }),
  createHomepageSectionStory({
    id: "demo-economy-price-explainer",
    slug: "demo-economy-price-explainer",
    category: categories.economy,
    kind: "explainer",
    headline: "काल्पनिक व्याख्या: मूल्य परिवर्तनसम्बन्धी सूचक पढ्ने आधार",
    summary: "सूचक, अवधि र स्रोत छुट्याएर बुझ्ने अभ्यास सामग्री; यसमा वास्तविक मूल्य वा मुद्रास्फीति दर छैन।",
    publishedAt: "2026-10-06T04:15:00.000Z",
    leadMedia: computerClassImage,
  }),
];

const societyPreviewStories: ArticleCard[] = [
  createHomepageSectionStory({
    id: "demo-society-school-family-dialogue",
    slug: "demo-society-school-family-dialogue",
    category: categories.society,
    kind: "news",
    headline: "काल्पनिक नमुना: विद्यालय र परिवार संवादका लागि साझा सूचना तालिका",
    summary:
      "शिक्षा र समुदायबीच सूचना आदानप्रदान कसरी व्यवस्थित गर्न सकिन्छ भन्ने देखाउने नमुना; कुनै वास्तविक विद्यालयको विवरण होइन।",
    publishedAt: "2026-10-08T08:30:00.000Z",
    leadMedia: libraryImage,
  }),
  createHomepageSectionStory({
    id: "demo-society-health-access-analysis",
    slug: "demo-society-health-access-analysis",
    category: categories.society,
    kind: "analysis",
    headline: "काल्पनिक विश्लेषण: स्वास्थ्य सेवाको सूचना सबैले बुझ्ने गरी राख्ने",
    summary:
      "स्वास्थ्य सेवा पृष्ठको भाषा, पहुँच र सम्पर्क विवरणबारे सम्पादकीय अभ्यास; स्वास्थ्य सल्लाह वा वास्तविक संस्थाको विवरण होइन।",
    publishedAt: "2026-10-08T06:45:00.000Z",
    leadMedia: computerClassImage,
  }),
  createHomepageSectionStory({
    id: "demo-society-accessibility-guide",
    slug: "demo-society-accessibility-guide",
    category: categories.society,
    kind: "guide",
    headline: "काल्पनिक मार्गदर्शिका: सार्वजनिक सूचना पहुँचयोग्य छ कि छैन जाँच्ने",
    summary:
      "शीर्षक, स्पष्ट भाषा र वैकल्पिक ढाँचाका लागि जाँचसूची नमुना; कुनै सेवा वा संस्थाको प्रमाणित मूल्याङ्कन होइन।",
    publishedAt: "2026-10-07T11:00:00.000Z",
    leadMedia: digitalWorkImage,
  }),
  createHomepageSectionStory({
    id: "demo-society-community-reading",
    slug: "demo-society-community-reading",
    category: categories.society,
    kind: "news",
    headline: "काल्पनिक नमुना: टोलस्तरमा साझा पढाइ र संवादको खुला समय",
    summary:
      "समुदायमा सहभागी गतिविधिको सूचना कसरी प्रस्तुत गर्न सकिन्छ भन्ने काल्पनिक उदाहरण; वास्तविक कार्यक्रम होइन।",
    publishedAt: "2026-10-07T07:15:00.000Z",
    leadMedia: libraryShelvesImage,
  }),
  createHomepageSectionStory({
    id: "demo-society-public-space-opinion",
    slug: "demo-society-public-space-opinion",
    category: categories.society,
    kind: "opinion",
    headline: "काल्पनिक विचार: साझा सार्वजनिक ठाउँले समुदायलाई कसरी जोड्छ",
    summary: "सार्वजनिक स्थल र समुदाय जीवनबारे विचार लेखको लेआउट नमुना; कुनै वास्तविक लेखकको धारणा होइन।",
    publishedAt: "2026-10-06T13:00:00.000Z",
    leadMedia: libraryImage,
  }),
  createHomepageSectionStory({
    id: "demo-society-service-explainer",
    slug: "demo-society-service-explainer",
    category: categories.society,
    kind: "explainer",
    headline: "काल्पनिक व्याख्या: सार्वजनिक सेवाको सूचना पढ्दा सोध्नुपर्ने प्रश्न",
    summary:
      "सेवाको जिम्मेवार निकाय, उपलब्धता र अद्यावधिक मिति जाँच्ने सामान्य ढाँचा; कानुनी वा सेवा सल्लाह होइन।",
    publishedAt: "2026-10-06T09:00:00.000Z",
    leadMedia: paymentImage,
  }),
  createHomepageSectionStory({
    id: "demo-society-claim-check",
    slug: "demo-society-claim-check",
    category: categories.society,
    kind: "fact_check",
    headline: "काल्पनिक तथ्य-जाँच ढाँचा: समुदायसम्बन्धी दाबीको स्रोत टिपोट",
    summary: "तथ्य-जाँच पृष्ठको खाली ढाँचा मात्र; कुनै वास्तविक व्यक्ति, समुदाय वा दाबीबारे अनुसन्धान गरिएको छैन।",
    publishedAt: "2026-10-06T06:00:00.000Z",
    leadMedia: computerClassImage,
  }),
  createHomepageSectionStory({
    id: "demo-society-youth-listening-guide",
    slug: "demo-society-youth-listening-guide",
    category: categories.society,
    kind: "guide",
    headline: "काल्पनिक मार्गदर्शिका: युवाका अनुभव सुन्ने संवाद सत्रको रूपरेखा",
    summary:
      "समुदाय संवादको निमन्त्रणा र सहभागिताका नियम प्रस्तुत गर्ने नमुना; वास्तविक घटना वा समूहको विवरण होइन।",
    publishedAt: "2026-10-06T02:00:00.000Z",
    leadMedia: digitalWorkImage,
  }),
];

const worldPreviewStories: ArticleCard[] = [
  createHomepageSectionStory({
    id: "demo-world-city-resilience",
    slug: "demo-world-city-resilience",
    category: categories.world,
    kind: "news",
    headline: "काल्पनिक नमुना: तटीय सहरका लागि साझा जोखिम नक्साको रूपरेखा",
    summary:
      "सहरहरूबीच वातावरणसम्बन्धी सूचना कसरी मिलाउन सकिन्छ भन्ने डिजाइन अभ्यास; कुनै वास्तविक नक्सा वा जोखिम विवरण होइन।",
    publishedAt: "2026-10-08T09:45:00.000Z",
    leadMedia: computerClassImage,
  }),
  createHomepageSectionStory({
    id: "demo-world-himalayan-information",
    slug: "demo-world-himalayan-information",
    category: categories.world,
    kind: "analysis",
    headline: "काल्पनिक विश्लेषण: हिमाली क्षेत्रका लागि मौसम सूचना आदानप्रदान",
    summary:
      "क्षेत्रीय सहकार्यको विषय बुझाउन बनाइएको सम्पादकीय अभ्यास; मौसम पूर्वानुमान वा कुनै वास्तविक सरकारी पहल होइन।",
    publishedAt: "2026-10-08T07:30:00.000Z",
    leadMedia: digitalWorkImage,
  }),
  createHomepageSectionStory({
    id: "demo-world-border-reporting-guide",
    slug: "demo-world-border-reporting-guide",
    category: categories.world,
    kind: "guide",
    headline: "काल्पनिक मार्गदर्शिका: सीमापार समाचारको सन्दर्भ कसरी जाँच्ने",
    summary: "देश, मिति, स्रोत र अनुवादको सन्दर्भ जाँच्ने ढाँचा; वास्तविक घटना वा दाबीबारे तथ्य-जाँच गरिएको छैन।",
    publishedAt: "2026-10-08T05:15:00.000Z",
    leadMedia: libraryShelvesImage,
  }),
  createHomepageSectionStory({
    id: "demo-world-library-cooperation",
    slug: "demo-world-library-cooperation",
    category: categories.world,
    kind: "news",
    headline: "काल्पनिक नमुना: क्षेत्रीय पुस्तकालयबीच खुला सामग्री साझेदारी",
    summary:
      "पुस्तकालयले डिजिटल सामग्री सूचीबद्ध गर्न सक्ने काल्पनिक अवधारणा; कुनै वास्तविक संस्था वा सम्झौता होइन।",
    publishedAt: "2026-10-07T13:00:00.000Z",
    leadMedia: libraryImage,
  }),
  createHomepageSectionStory({
    id: "demo-world-technology-dialogue",
    slug: "demo-world-technology-dialogue",
    category: categories.world,
    kind: "opinion",
    headline: "काल्पनिक विचार: विश्वव्यापी प्रविधि संवादमा नागरिकको आवाज",
    summary: "सार्वजनिक सहभागिताको अवधारणा प्रस्तुत गर्ने विचार-लेआउट; यो कुनै वास्तविक लेखकको मत होइन।",
    publishedAt: "2026-10-07T10:10:00.000Z",
    leadMedia: paymentImage,
  }),
  createHomepageSectionStory({
    id: "demo-world-water-context",
    slug: "demo-world-water-context",
    category: categories.world,
    kind: "explainer",
    headline: "काल्पनिक व्याख्या: क्षेत्रीय जल-सहकार्यबारे समाचार कसरी बुझ्ने",
    summary: "बैठक, सहभागी, दस्तावेज र मिति छुट्याउने व्याख्या-पृष्ठ नमुना; कुनै वास्तविक सम्झौता वा नीति होइन।",
    publishedAt: "2026-10-07T07:50:00.000Z",
    leadMedia: digitalWorkImage,
  }),
  createHomepageSectionStory({
    id: "demo-world-source-guide",
    slug: "demo-world-source-guide",
    category: categories.world,
    kind: "fact_check",
    headline: "काल्पनिक तथ्य-जाँच ढाँचा: अन्तर्राष्ट्रिय समाचारको स्रोत अभिलेख",
    summary: "स्रोत, मूल प्रकाशन र पुष्टि अवस्था लेख्ने खाली टेम्प्लेट; कुनै वास्तविक रिपोर्ट वा दाबी जाँचिएको छैन।",
    publishedAt: "2026-10-06T13:40:00.000Z",
    leadMedia: computerClassImage,
  }),
  createHomepageSectionStory({
    id: "demo-world-student-exchange",
    slug: "demo-world-student-exchange",
    category: categories.world,
    kind: "news",
    headline: "काल्पनिक नमुना: विद्यार्थी आदानप्रदानका लागि क्षेत्रीय क्यालेन्डर",
    summary: "शैक्षिक अवसरको जानकारी क्रमबद्ध गर्ने अभ्यास सामग्री; कुनै वास्तविक कार्यक्रम वा आवेदन खुला छैन।",
    publishedAt: "2026-10-06T09:20:00.000Z",
    leadMedia: libraryShelvesImage,
  }),
];

const technologyPreviewStories: ArticleCard[] = [
  createHomepageSectionStory({
    id: "demo-technology-language-ai",
    slug: "demo-technology-language-ai",
    category: categories.technology,
    kind: "analysis",
    headline: "काल्पनिक विश्लेषण: नेपाली भाषाका लागि एआई उपकरण बनाउने प्रश्नहरू",
    summary:
      "भाषा सामग्री, स्रोत र मानव समीक्षा कसरी चिनाउने भन्ने सम्पादकीय अभ्यास; कुनै वास्तविक प्रणाली वा अनुसन्धानको विवरण होइन।",
    publishedAt: "2026-10-09T05:10:00.000Z",
    leadMedia: libraryShelvesImage,
  }),
  createHomepageSectionStory({
    id: "demo-technology-privacy-controls-guide",
    slug: "demo-technology-privacy-controls-guide",
    category: categories.technology,
    kind: "guide",
    headline: "काल्पनिक मार्गदर्शिका: डिजिटल सेवामा गोपनीयता सूचना बुझ्ने",
    summary:
      "सेवाको डेटा प्रयोग, अनुमति र मिति कहाँ स्पष्ट पार्न सकिन्छ भन्ने लेआउट नमुना; सुरक्षा सल्लाह वा कुनै वास्तविक सेवाको मूल्याङ्कन होइन।",
    publishedAt: "2026-10-08T12:20:00.000Z",
    leadMedia: digitalWorkImage,
  }),
  createHomepageSectionStory({
    id: "demo-technology-rural-connectivity",
    slug: "demo-technology-rural-connectivity",
    category: categories.technology,
    kind: "news",
    headline: "काल्पनिक नमुना: नेटवर्क पहुँच देखाउने नक्साको सार्वजनिक ढाँचा",
    summary:
      "जडानसम्बन्धी सूचना कसरी देखाउन सकिन्छ भन्ने डिजाइन अभ्यास; वास्तविक नक्सा, सेवा उपलब्धता वा सरकारी योजना होइन।",
    publishedAt: "2026-10-08T08:30:00.000Z",
    leadMedia: computerClassImage,
  }),
  createHomepageSectionStory({
    id: "demo-technology-repairable-devices",
    slug: "demo-technology-repairable-devices",
    category: categories.technology,
    kind: "analysis",
    headline: "काल्पनिक विश्लेषण: उपकरणको आयु र मर्मत सूचना कसरी प्रस्तुत गर्ने",
    summary:
      "उत्पादन विवरणमा आयु, मर्मत र पुनःप्रयोगबारे प्रश्न समेट्ने सम्पादकीय नमुना; कुनै वास्तविक उपकरणबारे समीक्षा होइन।",
    publishedAt: "2026-10-08T06:45:00.000Z",
    leadMedia: paymentImage,
  }),
  createHomepageSectionStory({
    id: "demo-technology-open-tools",
    slug: "demo-technology-open-tools",
    category: categories.technology,
    kind: "news",
    headline: "काल्पनिक नमुना: नेपाली डिजिटल अभिलेखका लागि खुला उपकरण",
    summary:
      "सामुदायिक डिजिटल सामग्री सूचीबद्ध गर्ने अवधारणात्मक उदाहरण; कुनै वास्तविक परियोजना, सफ्टवेयर वा संस्था होइन।",
    publishedAt: "2026-10-07T13:40:00.000Z",
    leadMedia: libraryImage,
  }),
  createHomepageSectionStory({
    id: "demo-technology-recommendation-explainer",
    slug: "demo-technology-recommendation-explainer",
    category: categories.technology,
    kind: "explainer",
    headline: "काल्पनिक व्याख्या: सामग्री सिफारिस गर्ने प्रणालीका संकेत बुझ्ने",
    summary:
      "डेटा, क्रम निर्धारण र प्रयोगकर्ताको नियन्त्रण बुझाउन बनाइएको लेआउट; कुनै वास्तविक प्लेटफर्मको प्रणाली विश्लेषण होइन।",
    publishedAt: "2026-10-07T10:15:00.000Z",
    leadMedia: computerClassImage,
  }),
  createHomepageSectionStory({
    id: "demo-technology-product-claims",
    slug: "demo-technology-product-claims",
    category: categories.technology,
    kind: "fact_check",
    headline: "काल्पनिक तथ्य-जाँच ढाँचा: प्रविधि दाबीका लागि प्रमाण टिपोट",
    summary:
      "दाबी, परीक्षण विधि र स्रोत टिपोट गर्ने खाली ढाँचा; कुनै उत्पादन, कम्पनी वा वास्तविक दाबी जाँचिएको छैन।",
    publishedAt: "2026-10-07T06:00:00.000Z",
    leadMedia: digitalWorkImage,
  }),
  createHomepageSectionStory({
    id: "demo-technology-public-interest-opinion",
    slug: "demo-technology-public-interest-opinion",
    category: categories.technology,
    kind: "opinion",
    headline: "काल्पनिक विचार: सार्वजनिक हितलाई केन्द्रमा राखेर प्रविधि डिजाइन गर्ने",
    summary:
      "प्रविधिको पहुँच, प्रयोगकर्ता नियन्त्रण र जवाफदेहिताबारे विचार लेखको नमुना; कुनै वास्तविक लेखकको मत होइन।",
    publishedAt: "2026-10-06T12:30:00.000Z",
    leadMedia: libraryShelvesImage,
  }),
];

const opinionAuthors = [
  {
    id: "demo-columnist-01",
    name: "नमुना लेखक ०१",
    slug: "sample-writer-01",
    roleLabel: "काल्पनिक स्तम्भकार",
  },
  {
    id: "demo-columnist-02",
    name: "नमुना लेखक ०२",
    slug: "sample-writer-02",
    roleLabel: "काल्पनिक स्तम्भकार",
  },
  {
    id: "demo-columnist-03",
    name: "नमुना लेखक ०३",
    slug: "sample-writer-03",
    roleLabel: "काल्पनिक स्तम्भकार",
  },
] as const satisfies readonly AuthorSummary[];

const opinionPreviewStories: ArticleCard[] = [
  createHomepageSectionStory({
    id: "demo-opinion-accountable-public-decisions",
    slug: "demo-opinion-accountable-public-decisions",
    category: categories.opinion,
    kind: "opinion",
    headline: "काल्पनिक विचार: सार्वजनिक निर्णयमा जवाफदेहिता कसरी बलियो बनाउने",
    summary: "खुला सूचना, नागरिक संवाद र जवाफदेहिताबारे विचार स्तम्भको नमुना; कुनै वास्तविक लेखकको मत होइन।",
    publishedAt: "2026-10-09T04:30:00.000Z",
    leadMedia: libraryShelvesImage,
    authors: [opinionAuthors[0]],
  }),
  createHomepageSectionStory({
    id: "demo-opinion-city-public-space",
    slug: "demo-opinion-city-public-space",
    category: categories.opinion,
    kind: "opinion",
    headline: "काल्पनिक विचार: सहरका साझा ठाउँलाई सबैका लागि सहज बनाउने",
    summary: "साझा सार्वजनिक स्थानबारे काल्पनिक स्तम्भ; वास्तविक योजना वा लेखकको धारणा होइन।",
    publishedAt: "2026-10-08T11:20:00.000Z",
    leadMedia: libraryImage,
    authors: [opinionAuthors[1]],
  }),
  createHomepageSectionStory({
    id: "demo-opinion-budget-priorities",
    slug: "demo-opinion-budget-priorities",
    category: categories.opinion,
    kind: "analysis",
    headline: "काल्पनिक विश्लेषण: सार्वजनिक बजेटका प्राथमिकता कसरी पढ्ने",
    summary: "सार्वजनिक खर्चबारे प्रश्न राख्ने विश्लेषण ढाँचा; वास्तविक बजेटको समीक्षा होइन।",
    publishedAt: "2026-10-08T07:15:00.000Z",
    leadMedia: paymentImage,
    authors: [opinionAuthors[2]],
  }),
  createHomepageSectionStory({
    id: "demo-opinion-digital-public-interest",
    slug: "demo-opinion-digital-public-interest",
    category: categories.opinion,
    kind: "opinion",
    headline: "काल्पनिक विचार: डिजिटल सेवामा नागरिकको रोजाइ किन महत्त्वपूर्ण छ",
    summary: "प्रविधि, पहुँच र प्रयोगकर्ताको रोजाइबारे विचार लेखको नमुना; वास्तविक सेवाको मूल्याङ्कन होइन।",
    publishedAt: "2026-10-07T10:10:00.000Z",
    leadMedia: digitalWorkImage,
    authors: [opinionAuthors[0]],
  }),
  createHomepageSectionStory({
    id: "demo-opinion-neighboring-world",
    slug: "demo-opinion-neighboring-world",
    category: categories.opinion,
    kind: "analysis",
    headline: "काल्पनिक विश्लेषण: छिमेकीसँगको संवादमा स्थानीय आवाजको स्थान",
    summary: "क्षेत्रीय संवादको संरचनाबारे सम्पादकीय नमुना; वास्तविक कूटनीति वा नीति विवरण होइन।",
    publishedAt: "2026-10-06T08:40:00.000Z",
    leadMedia: computerClassImage,
    authors: [opinionAuthors[1]],
  }),
  createHomepageSectionStory({
    id: "demo-opinion-public-transport",
    slug: "demo-opinion-public-transport",
    category: categories.opinion,
    kind: "opinion",
    headline: "काल्पनिक विचार: सार्वजनिक यातायातबारे निर्णय गर्दा कसलाई सुनिन्छ",
    summary: "यात्रुका फरक अनुभव समेट्ने विचार स्तम्भको नमुना; कुनै वास्तविक सहरको रिपोर्ट होइन।",
    publishedAt: "2026-10-05T09:05:00.000Z",
    leadMedia: paymentImage,
    authors: [opinionAuthors[2]],
  }),
  createHomepageSectionStory({
    id: "demo-opinion-climate-community-knowledge",
    slug: "demo-opinion-climate-community-knowledge",
    category: categories.opinion,
    kind: "opinion",
    headline: "काल्पनिक विचार: वातावरणबारे छलफलमा समुदायको ज्ञान जोड्ने",
    summary: "समुदायको अनुभव सुन्नेबारे काल्पनिक विचार सामग्री; कुनै वास्तविक वातावरणीय दाबी होइन।",
    publishedAt: "2026-10-04T06:35:00.000Z",
    leadMedia: libraryShelvesImage,
    authors: [opinionAuthors[0]],
  }),
  createHomepageSectionStory({
    id: "demo-opinion-language-and-reading",
    slug: "demo-opinion-language-and-reading",
    category: categories.opinion,
    kind: "opinion",
    headline: "काल्पनिक विचार: सार्वजनिक जीवनमा भाषा र पठन संस्कृतिको भूमिका",
    summary: "भाषा र पठनबारे विचार स्तम्भको नमुना; वास्तविक लेखक वा संस्थाको धारणा होइन।",
    publishedAt: "2026-10-03T12:00:00.000Z",
    leadMedia: libraryImage,
    authors: [opinionAuthors[1]],
  }),
];

const allStories = [
  ...cards,
  ...homepageSectionStories,
  ...politicsPreviewStories,
  ...economyPreviewStories,
  ...societyPreviewStories,
  ...technologyPreviewStories,
  ...worldPreviewStories,
  ...opinionPreviewStories,
];

const reels: ReelCard[] = [
  {
    id: "reel-demo-classroom",
    headline: cards[2].headline,
    headlineEn: "Fictional sample: a free community digital skills class",
    href: cards[2].href,
    category: cards[2].category,
    media: classroomVideo,
  },
  {
    id: "reel-demo-civic-portal",
    headline: cards[3].headline,
    headlineEn: "Fictional sample: city services in one online portal",
    href: cards[3].href,
    category: cards[3].category,
    media: typingVideo,
  },
  {
    id: "reel-demo-digital-payment",
    headline: cards[1].headline,
    headlineEn: "Fictional sample: digital payments at small businesses",
    href: cards[1].href,
    category: cards[1].category,
    media: typingCloseupVideo,
  },
  {
    id: "reel-demo-city-services",
    headline: "काल्पनिक नमुना: सहरका सार्वजनिक सेवाबारे छोटो जानकारी",
    headlineEn: "Fictional sample: a quick guide to city services",
    href: cards[3].href,
    category: cards[3].category,
    media: trafficLightsVideo,
  },
  {
    id: "reel-demo-taxi-fare",
    headline: "काल्पनिक नमुना: यात्रामा भाडा जानकारीको महत्त्व",
    headlineEn: "Fictional sample: why clear fares matter when travelling",
    href: cards[1].href,
    category: cards[1].category,
    media: taxiMeterVideo,
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
    socialImage: libraryImage,
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
  {
    id: "demo-economy-budget-explainer-hub",
    slug: "demo-economy-budget-basics",
    locale: "ne-NP",
    kind: "explainer",
    title: "काल्पनिक व्याख्या: बजेटका आम्दानी र खर्च शीर्षक",
    summary:
      "सार्वजनिक बजेटमा देखिन सक्ने सामान्य शीर्षक बुझाउने अभ्यास; कुनै वास्तविक बजेट वा रकमबारे दाबी होइन।",
    reviewedAt: "2026-10-06T06:00:00.000Z",
    evidence: [],
    related: economyPreviewStories.slice(5, 6),
    body: [
      {
        type: "paragraph",
        text: "यो पूर्णतः काल्पनिक व्याख्या हो। आम्दानी, चालु खर्च, पूँजीगत खर्च र प्राथमिकता जस्ता शीर्षकको परिचय दिन सकिने ढाँचा मात्र देखाइएको छ।",
      },
      {
        type: "heading",
        level: 2,
        text: "स्रोत र समय जाँच्नुहोस्",
      },
      {
        type: "paragraph",
        text: "वास्तविक बजेट व्याख्यामा मूल दस्तावेज, प्रकाशित मिति र आवश्यक परिभाषा उल्लेख हुनुपर्छ। यहाँ कुनै सरकारी दस्तावेज प्रयोग गरिएको छैन।",
      },
    ],
  },
  {
    id: "demo-economy-market-guide-hub",
    slug: "demo-economy-market-data-guide",
    locale: "ne-NP",
    kind: "guide",
    title: "काल्पनिक मार्गदर्शिका: बजार सूचकमा स्रोत र मिति हेर्ने",
    summary: "सूचकाङ्क, मुद्रा वा वस्तु मूल्य पढ्दा स्रोत, इकाइ र अपडेट समय कहाँ जाँच्ने भन्ने लेआउट नमुना।",
    reviewedAt: "2026-10-06T06:30:00.000Z",
    evidence: [],
    related: economyPreviewStories.slice(7, 8),
    body: [
      {
        type: "paragraph",
        text: "यो केवल जानकारी पृष्ठको काल्पनिक ढाँचा हो। कुनै बजार मान, लगानी सुझाव वा कारोबार सिफारिस यहाँ दिइएको छैन।",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "प्रकाशक वा आधिकारिक स्रोत पहिचान गर्नुहोस्",
          "इकाइ र मुद्रा हेर्नुहोस्",
          "प्रकाशन र अवलोकन समय तुलना गर्नुहोस्",
        ],
      },
    ],
  },
  {
    id: "demo-society-accessible-info-hub",
    slug: "demo-society-accessible-information",
    locale: "ne-NP",
    kind: "guide",
    title: "काल्पनिक मार्गदर्शिका: सार्वजनिक सूचना सजिलोसँग बुझ्ने",
    summary:
      "सार्वजनिक सूचना पढ्दा शीर्षक, जिम्मेवार निकाय र अद्यावधिक समय कहाँ खोज्ने भन्ने ढाँचा; कुनै सरकारी सेवा विवरण होइन।",
    reviewedAt: "2026-10-07T05:30:00.000Z",
    evidence: [],
    related: societyPreviewStories.slice(2, 3),
    body: [
      {
        type: "paragraph",
        text: "यो काल्पनिक मार्गदर्शिका हो। स्पष्ट भाषा, पहुँचयोग्य ढाँचा र सम्पर्क विवरणजस्ता कुरा कसरी जाँच्ने भन्ने मात्र देखाइएको छ।",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "सूचनाको मिति र प्रकाशक हेर्नुहोस्",
          "मुख्य शब्द र जिम्मेवार निकाय पहिचान गर्नुहोस्",
          "आवश्यक परे आधिकारिक स्रोतबाट पुष्टि गर्नुहोस्",
        ],
      },
    ],
  },
  {
    id: "demo-society-community-context-hub",
    slug: "demo-society-community-context",
    locale: "ne-NP",
    kind: "explainer",
    title: "काल्पनिक व्याख्या: समुदायका मुद्दामा सन्दर्भ कसरी जोड्ने",
    summary: "समुदायसम्बन्धी लेखमा कसको कुरा समेट्ने, कुन मिति राख्ने र स्रोत कसरी चिनाउने भन्ने सम्पादकीय नमुना।",
    reviewedAt: "2026-10-07T06:00:00.000Z",
    evidence: [],
    related: societyPreviewStories.slice(3, 4),
    body: [
      {
        type: "paragraph",
        text: "समुदायसम्बन्धी वास्तविक रिपोर्टिङमा प्रभावित व्यक्तिको सहमति र गोपनीयता, सन्दर्भ, फरक अनुभव तथा स्रोतको स्पष्टता विचार गर्नुपर्छ। यो पृष्ठले ती विषयको लेआउट मात्र देखाउँछ।",
      },
      {
        type: "heading",
        level: 2,
        text: "नमुना सामग्रीको सीमा",
      },
      {
        type: "paragraph",
        text: "यहाँ कुनै वास्तविक व्यक्ति वा समूहको कथा छैन। लेख र तस्वीर दुवै डिजाइन पूर्वावलोकनका काल्पनिक/स्टक नमुना हुन्।",
      },
    ],
  },
  {
    id: "demo-world-source-guide-hub",
    slug: "demo-world-source-guide",
    locale: "ne-NP",
    kind: "guide",
    title: "काल्पनिक मार्गदर्शिका: अन्तर्राष्ट्रिय समाचारको स्रोत जाँच्ने",
    summary: "मूल प्रकाशक, समय, अनुवाद र पुष्टि अवस्था खोज्ने पाठक-जाँचसूची; कुनै समाचारको तथ्य-जाँच होइन।",
    reviewedAt: "2026-10-08T05:30:00.000Z",
    evidence: [],
    related: worldPreviewStories.slice(6, 7),
    body: [
      {
        type: "paragraph",
        text: "यो काल्पनिक मार्गदर्शिका हो। स्रोतको नाम, मूल प्रकाशन, समय र अनुवादको सन्दर्भ लेख्ने ठाउँ कसरी राख्न सकिन्छ भन्ने मात्र देखाउँछ।",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "मूल प्रकाशक र मूल सामग्री पहिचान गर्नुहोस्",
          "प्रकाशन र अद्यावधिक मिति छुट्याउनुहोस्",
          "दाबीलाई अर्को स्वतन्त्र विश्वसनीय स्रोतसँग तुलना गर्नुहोस्",
        ],
      },
    ],
  },
  {
    id: "demo-world-context-explainer-hub",
    slug: "demo-world-regional-context",
    locale: "ne-NP",
    kind: "explainer",
    title: "काल्पनिक व्याख्या: क्षेत्रीय घटनालाई विश्व सन्दर्भमा राख्ने",
    summary:
      "भूगोल, संलग्न पक्ष र स्रोत छुट्याएर लेख्ने सम्पादकीय ढाँचा; यसमा वास्तविक द्वन्द्व वा कूटनीतिक घटनाको विवरण छैन।",
    reviewedAt: "2026-10-08T06:15:00.000Z",
    evidence: [],
    related: worldPreviewStories.slice(5, 6),
    body: [
      {
        type: "paragraph",
        text: "यो नमुना व्याख्याले घटनास्थल, सहभागी पक्ष, स्रोत र समय सन्दर्भ कहाँ राख्ने भन्ने देखाउँछ। कुनै वास्तविक देश, घटना वा द्वन्द्वको चर्चा गरिएको छैन।",
      },
      {
        type: "heading",
        level: 2,
        text: "बहुपक्षीय विषयमा सन्दर्भ",
      },
      {
        type: "paragraph",
        text: "वास्तविक समाचारमा फरक पक्षका भनाइ, प्राथमिक स्रोत र तथ्य तथा टिप्पणीबीचको भिन्नता स्पष्ट देखाउनुपर्छ। यो पृष्ठ लेआउट पूर्वावलोकन मात्र हो।",
      },
    ],
  },
  {
    id: "demo-technology-ai-transparency-hub",
    slug: "demo-technology-ai-transparency",
    locale: "ne-NP",
    kind: "guide",
    title: "काल्पनिक मार्गदर्शिका: एआई सामग्रीको स्रोत र समीक्षा देखाउने",
    summary:
      "प्रशिक्षण सामग्री, स्रोत र मानव समीक्षा कहाँ खुलाउने भन्ने सम्पादकीय ढाँचा; कुनै वास्तविक एआई प्रणालीको परीक्षण होइन।",
    reviewedAt: "2026-10-09T05:30:00.000Z",
    evidence: [],
    related: technologyPreviewStories.slice(0, 1),
    body: [
      {
        type: "paragraph",
        text: "यो काल्पनिक मार्गदर्शिकाले सामग्रीको स्रोत, संस्करण, समीक्षक र सीमाबारे जानकारी कहाँ राख्न सकिन्छ भन्ने नमुना देखाउँछ। कुनै वास्तविक प्रणाली वा अनुसन्धानको मूल्याङ्कन गरिएको छैन।",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "मूल सामग्री र मिति लेख्ने",
          "मानव समीक्षा भएको वा नभएको स्पष्ट पार्ने",
          "सीमा र सुधारको प्रक्रिया चिनाउने",
        ],
      },
    ],
  },
  {
    id: "demo-technology-impact-context-hub",
    slug: "demo-technology-public-interest-context",
    locale: "ne-NP",
    kind: "explainer",
    title: "काल्पनिक व्याख्या: प्रविधि समाचारमा उपयोग र प्रभाव जोड्ने",
    summary:
      "उपयोगकर्ता, पहुँच र जवाफदेहिताको सन्दर्भ कहाँ राख्ने भन्ने सम्पादकीय नमुना; कुनै वास्तविक नीति वा उत्पादनको विवरण होइन।",
    reviewedAt: "2026-10-09T06:00:00.000Z",
    evidence: [],
    related: technologyPreviewStories.slice(7, 8),
    body: [
      {
        type: "paragraph",
        text: "प्रविधिबारेको वास्तविक समाचारमा कसले प्रयोग गर्छ, कसलाई असर पर्छ र निर्णय कसले गर्छ भन्ने प्रश्नलाई प्रमाण र स्रोतसँगै बुझाउनुपर्छ। यो पृष्ठले त्यस्तो सन्दर्भका लागि लेआउट मात्र देखाउँछ।",
      },
      {
        type: "heading",
        level: 2,
        text: "प्रविधि र सार्वजनिक जीवन",
      },
      {
        type: "paragraph",
        text: "यहाँ कुनै वास्तविक नीति, उत्पादन वा समूहबारे दाबी छैन।",
      },
    ],
  },
];

const categoryData: Record<string, CategoryPageData> = Object.fromEntries(
  Object.values(categories).map((category) => {
    const articles = allStories.filter((card) => card.category.slug === category.slug);
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
  breaking: [cards[3], cards[1]],
  lead: cards[0],
  latest: cards,
  trending: cards.slice(1, 6),
  reels,
  sections: [
    {
      category: categories.society,
      lead: cards[0],
      articles: [cards[0], homepageSectionStories[0]],
    },
    {
      category: categories.economy,
      lead: cards[1],
      articles: [cards[1], homepageSectionStories[1]],
    },
    {
      category: categories.technology,
      lead: cards[2],
      articles: [cards[2], homepageSectionStories[2]],
    },
    {
      category: categories.politics,
      lead: cards[3],
      articles: [cards[3], homepageSectionStories[3]],
    },
    { category: categories.world, lead: cards[4], articles: [cards[4], homepageSectionStories[4]] },
    {
      category: categories.opinion,
      lead: cards[5],
      articles: [cards[5], homepageSectionStories[5]],
    },
  ],
  hubHighlights: hubEntries.slice(0, 3),
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
    const found = allStories.find((item) => item.slug === slug);
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
      related: allStories.filter((item) => item.slug !== slug).slice(0, 2),
      seo: {
        title: found.headline,
        description: found.summary ?? "काल्पनिक नमुना लेख।",
        canonicalUrl: `https://example.invalid${found.href}`,
      },
    });
  },
  async search(filters) {
    return searchFixtureStories(allStories, filters);
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
