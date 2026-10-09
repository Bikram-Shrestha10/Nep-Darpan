import type { ArticleCard, PageInfo, StoryKind } from "@/lib/content/contracts";
import { FIXTURE_QUERY_MAX_LENGTH } from "@/lib/content/search-fixtures";
import { translateToEnglish } from "@/lib/i18n/english";

export type TechnologySort = "newest" | "oldest";
export type TechnologyStoryKind = StoryKind;
export type TechnologyTopic = "all" | "ai" | "digital-life" | "connectivity" | "devices";
export type TechnologyParamIssue =
  | "duplicate"
  | "query_too_long"
  | "invalid_filter"
  | "invalid_page"
  | "invalid_topic";
export type TechnologySearchParams = Record<string, string | string[] | undefined>;

export interface TechnologyFilters {
  query: string;
  topic: TechnologyTopic;
  kind?: TechnologyStoryKind;
  sort: TechnologySort;
  page: number;
}

export interface ParsedTechnologyParams {
  filters: TechnologyFilters;
  issues: TechnologyParamIssue[];
}

export interface TechnologyFeedPage {
  stories: ArticleCard[];
  pageInfo: PageInfo;
}

export const TECHNOLOGY_PAGE_SIZE = 6;
export const TECHNOLOGY_STORY_KINDS: readonly TechnologyStoryKind[] = [
  "news",
  "analysis",
  "opinion",
  "explainer",
  "fact_check",
  "guide",
];

export const TECHNOLOGY_TOPICS: ReadonlyArray<{
  slug: TechnologyTopic;
  ne: string;
  en: string;
  descriptionNe: string;
  descriptionEn: string;
}> = [
  {
    slug: "all",
    ne: "सबै प्रविधि समाचार",
    en: "All technology",
    descriptionNe: "नयाँ समाचार, विश्लेषण र व्याख्या।",
    descriptionEn: "News, analysis, and explainers.",
  },
  {
    slug: "ai",
    ne: "एआई र एल्गोरिदम",
    en: "AI and algorithms",
    descriptionNe: "स्वचालन, भाषा उपकरण र सिफारिस प्रणाली।",
    descriptionEn: "Automation, language tools, and recommendation systems.",
  },
  {
    slug: "digital-life",
    ne: "डिजिटल जीवन",
    en: "Digital life",
    descriptionNe: "सीप, गोपनीयता र दैनिक प्रविधि।",
    descriptionEn: "Skills, privacy, and everyday technology.",
  },
  {
    slug: "connectivity",
    ne: "जडान र पूर्वाधार",
    en: "Connectivity and infrastructure",
    descriptionNe: "नेटवर्क पहुँच र सार्वजनिक डिजिटल सेवा।",
    descriptionEn: "Network access and public digital services.",
  },
  {
    slug: "devices",
    ne: "उपकरण र नवप्रवर्तन",
    en: "Devices and innovation",
    descriptionNe: "डिजाइन, मर्मत र नयाँ विचार।",
    descriptionEn: "Design, repair, and emerging ideas.",
  },
];

const storyTopics: Readonly<Record<string, Exclude<TechnologyTopic, "all">>> = {
  "demo-story-003": "digital-life",
  "demo-section-technology-02": "connectivity",
  "demo-technology-language-ai": "ai",
  "demo-technology-privacy-controls-guide": "digital-life",
  "demo-technology-rural-connectivity": "connectivity",
  "demo-technology-repairable-devices": "devices",
  "demo-technology-open-tools": "ai",
  "demo-technology-recommendation-explainer": "ai",
  "demo-technology-product-claims": "devices",
  "demo-technology-public-interest-opinion": "digital-life",
};

export function getTechnologyTopic(story: ArticleCard): Exclude<TechnologyTopic, "all"> {
  return storyTopics[story.id] ?? "digital-life";
}

export function parseTechnologyParams(params: TechnologySearchParams): ParsedTechnologyParams {
  const issues: TechnologyParamIssue[] = [];
  const read = (key: string) => {
    const value = params[key];
    if (Array.isArray(value)) {
      issues.push("duplicate");
      return "";
    }
    return value ?? "";
  };

  const rawQuery = read("q").trim();
  const rawTopic = read("topic");
  const rawKind = read("kind");
  const rawSort = read("sort");
  const rawPage = read("page");
  const topic = TECHNOLOGY_TOPICS.some((item) => item.slug === rawTopic)
    ? (rawTopic as TechnologyTopic)
    : "all";
  const kind = TECHNOLOGY_STORY_KINDS.includes(rawKind as TechnologyStoryKind)
    ? (rawKind as TechnologyStoryKind)
    : undefined;
  const sort: TechnologySort = rawSort === "oldest" ? "oldest" : "newest";
  const validPage = /^[1-9]\d*$/u.test(rawPage) && Number.isSafeInteger(Number(rawPage));
  const page = validPage ? Number(rawPage) : 1;

  if (rawQuery.length > FIXTURE_QUERY_MAX_LENGTH) issues.push("query_too_long");
  if (rawTopic && topic === "all") issues.push("invalid_topic");
  if ((rawKind && !kind) || (rawSort && !["newest", "oldest"].includes(rawSort))) {
    issues.push("invalid_filter");
  }
  if (rawPage && !validPage) issues.push("invalid_page");

  return {
    filters: {
      query: rawQuery.slice(0, FIXTURE_QUERY_MAX_LENGTH),
      topic,
      ...(kind ? { kind } : {}),
      sort,
      page,
    },
    issues: [...new Set(issues)],
  };
}

export function selectTechnologyStories(
  stories: readonly ArticleCard[],
  filters: TechnologyFilters,
  pageSize = TECHNOLOGY_PAGE_SIZE,
): TechnologyFeedPage {
  const query = filters.query.trim().normalize("NFC").toLocaleLowerCase();
  const matches = stories.filter((story) => {
    if (filters.kind && story.kind !== filters.kind) return false;
    if (filters.topic !== "all" && getTechnologyTopic(story) !== filters.topic) return false;
    if (!query) return true;
    const topic = TECHNOLOGY_TOPICS.find((item) => item.slug === getTechnologyTopic(story));
    const searchableText =
      `${story.headline} ${story.summary ?? ""} ${story.category.name} ${translateToEnglish(story.headline)} ${translateToEnglish(story.summary ?? "")} ${translateToEnglish(story.category.name)} ${topic?.ne ?? ""} ${topic?.en ?? ""}`
        .normalize("NFC")
        .toLocaleLowerCase();
    return searchableText.includes(query);
  });

  matches.sort((left, right) => {
    const leftDate = Date.parse(left.updatedAt ?? left.publishedAt);
    const rightDate = Date.parse(right.updatedAt ?? right.publishedAt);
    const difference = leftDate - rightDate;
    if (difference === 0) return left.id.localeCompare(right.id);
    return filters.sort === "newest" ? -difference : difference;
  });

  const totalItems = matches.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const page = Math.min(filters.page, Math.max(totalPages, 1));
  const pageInfo: PageInfo = { page, pageSize, totalItems, totalPages };
  const offset = (page - 1) * pageSize;
  return { stories: matches.slice(offset, offset + pageSize), pageInfo };
}
