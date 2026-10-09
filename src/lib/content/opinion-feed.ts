import type { ArticleCard, PageInfo, StoryKind } from "@/lib/content/contracts";
import { FIXTURE_QUERY_MAX_LENGTH } from "@/lib/content/search-fixtures";
import { translateToEnglish } from "@/lib/i18n/english";

export type OpinionSort = "newest" | "oldest";
export type OpinionTopic =
  | "all"
  | "politics"
  | "society"
  | "economy"
  | "technology"
  | "world"
  | "culture";
export type OpinionStoryKind = Extract<StoryKind, "opinion" | "analysis">;
export type OpinionParamIssue =
  | "duplicate"
  | "query_too_long"
  | "invalid_filter"
  | "invalid_page"
  | "invalid_topic";
export type OpinionSearchParams = Record<string, string | string[] | undefined>;

export interface OpinionFilters {
  query: string;
  topic: OpinionTopic;
  kind?: OpinionStoryKind;
  sort: OpinionSort;
  page: number;
}

export interface ParsedOpinionParams {
  filters: OpinionFilters;
  issues: OpinionParamIssue[];
}

export interface OpinionFeedPage {
  stories: ArticleCard[];
  pageInfo: PageInfo;
}

export const OPINION_PAGE_SIZE = 6;
export const OPINION_STORY_KINDS: readonly OpinionStoryKind[] = ["opinion", "analysis"];

export const OPINION_TOPICS: ReadonlyArray<{
  slug: OpinionTopic;
  ne: string;
  en: string;
}> = [
  { slug: "all", ne: "सबै विचार", en: "All opinion" },
  { slug: "politics", ne: "राजनीति", en: "Politics" },
  { slug: "society", ne: "समाज", en: "Society" },
  { slug: "economy", ne: "अर्थतन्त्र", en: "Economy" },
  { slug: "technology", ne: "प्रविधि", en: "Technology" },
  { slug: "world", ne: "विश्व", en: "World" },
  { slug: "culture", ne: "संस्कृति र शिक्षा", en: "Culture and education" },
];

const storyTopics: Readonly<Record<string, Exclude<OpinionTopic, "all">>> = {
  "demo-story-006": "culture",
  "demo-section-opinion-02": "culture",
  "demo-opinion-accountable-public-decisions": "politics",
  "demo-opinion-city-public-space": "society",
  "demo-opinion-budget-priorities": "economy",
  "demo-opinion-digital-public-interest": "technology",
  "demo-opinion-neighboring-world": "world",
  "demo-opinion-public-transport": "society",
  "demo-opinion-climate-community-knowledge": "society",
  "demo-opinion-language-and-reading": "culture",
};

export function getOpinionTopic(story: ArticleCard): Exclude<OpinionTopic, "all"> {
  return storyTopics[story.id] ?? "society";
}

export function parseOpinionParams(params: OpinionSearchParams): ParsedOpinionParams {
  const issues: OpinionParamIssue[] = [];
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
  const topic = OPINION_TOPICS.some((item) => item.slug === rawTopic)
    ? (rawTopic as OpinionTopic)
    : "all";
  const kind = OPINION_STORY_KINDS.includes(rawKind as OpinionStoryKind)
    ? (rawKind as OpinionStoryKind)
    : undefined;
  const sort: OpinionSort = rawSort === "oldest" ? "oldest" : "newest";
  const validPage = /^[1-9]\d*$/u.test(rawPage) && Number.isSafeInteger(Number(rawPage));

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
      page: validPage ? Number(rawPage) : 1,
    },
    issues: [...new Set(issues)],
  };
}

export function selectOpinionStories(
  stories: readonly ArticleCard[],
  filters: OpinionFilters,
  pageSize = OPINION_PAGE_SIZE,
): OpinionFeedPage {
  const query = filters.query.trim().normalize("NFC").toLocaleLowerCase();
  const matches = stories.filter((story) => {
    if (filters.kind && story.kind !== filters.kind) return false;
    if (filters.topic !== "all" && getOpinionTopic(story) !== filters.topic) return false;
    if (!query) return true;
    const topic = OPINION_TOPICS.find((item) => item.slug === getOpinionTopic(story));
    const authorNames = story.authors
      .map((author) => `${author.name} ${translateToEnglish(author.name)}`)
      .join(" ");
    const searchableText =
      `${story.headline} ${story.summary ?? ""} ${authorNames} ${translateToEnglish(story.headline)} ${translateToEnglish(story.summary ?? "")} ${topic?.ne ?? ""} ${topic?.en ?? ""}`
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
