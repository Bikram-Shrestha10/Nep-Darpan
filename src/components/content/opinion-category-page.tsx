import Link from "next/link";
import { ArticleMedia, MediaSlot } from "@/components/content/article-media";
import { AuthorByline, PublishedTime } from "@/components/content/story-metadata";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { LocalizedNumber, LocalizedText } from "@/components/layout/site-preferences";
import { LocalizedSearchInput } from "@/components/search/localized-search-input";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageNavigation } from "@/components/ui/page-navigation";
import type { ArticleCard, CategoryPageData, CategorySummary } from "@/lib/content/contracts";
import {
  getOpinionTopic,
  OPINION_STORY_KINDS,
  OPINION_TOPICS,
  type OpinionFilters,
  type OpinionParamIssue,
  type OpinionSearchParams,
  type OpinionStoryKind,
  type OpinionTopic,
  parseOpinionParams,
  selectOpinionStories,
} from "@/lib/content/opinion-feed";

const kindLabels: Record<OpinionStoryKind, { ne: string; en: string }> = {
  opinion: { ne: "विचार स्तम्भ", en: "Opinion column" },
  analysis: { ne: "विश्लेषण", en: "Analysis" },
};

const issueCopy: Record<OpinionParamIssue, { ne: string; en: string }> = {
  duplicate: {
    ne: "एउटै फिल्टर एकभन्दा बढी पटक आएको छ। फारमबाट फेरि छान्नुहोस्।",
    en: "A filter was repeated. Please choose it again using the form.",
  },
  query_too_long: {
    ne: "खोज शब्द १२० वर्णभन्दा छोटो राख्नुहोस्।",
    en: "Keep the search query under 120 characters.",
  },
  invalid_filter: {
    ne: "एउटा फिल्टर मान्य थिएन; त्यसलाई हटाएर नतिजा देखाइएको छ।",
    en: "One filter was invalid and has been removed from the results.",
  },
  invalid_page: {
    ne: "पृष्ठ नम्बर मान्य थिएन; पहिलो पृष्ठ देखाइएको छ।",
    en: "The page number was invalid; showing the first page.",
  },
  invalid_topic: {
    ne: "विषय मान्य थिएन; सबै विचार सामग्री देखाइएको छ।",
    en: "The topic was invalid; showing all opinion stories.",
  },
};

function topicFor(topic: OpinionTopic) {
  const match = OPINION_TOPICS.find((item) => item.slug === topic);
  if (!match) throw new Error(`Unknown opinion topic: ${topic}`);
  return match;
}

function opinionHref(
  filters: Pick<OpinionFilters, "query" | "topic" | "kind" | "sort">,
  page?: number,
  overrides: { topic?: OpinionTopic; kind?: OpinionStoryKind | null } = {},
) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  const topic = overrides.topic ?? filters.topic;
  if (topic !== "all") params.set("topic", topic);
  const kind = overrides.kind === undefined ? filters.kind : overrides.kind;
  if (kind) params.set("kind", kind);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (page) params.set("page", String(page));
  const query = params.toString();
  return query ? `/category/opinion?${query}` : "/category/opinion";
}

function OpinionTopics({ filters, stories }: { filters: OpinionFilters; stories: ArticleCard[] }) {
  return (
    <nav className="opinion-topic-nav" aria-labelledby="opinion-topic-heading">
      <h2 id="opinion-topic-heading" className="sr-only">
        <LocalizedText ne="विचारका विषयहरू" en="Opinion topics" />
      </h2>
      <ul>
        {OPINION_TOPICS.map((topic) => {
          const count =
            topic.slug === "all"
              ? stories.length
              : stories.filter((story) => getOpinionTopic(story) === topic.slug).length;
          const active = filters.topic === topic.slug;
          return (
            <li key={topic.slug}>
              <Link
                aria-current={active ? "page" : undefined}
                className={active ? "opinion-topic-nav__link is-active" : "opinion-topic-nav__link"}
                href={opinionHref(filters, undefined, { topic: topic.slug })}
              >
                <LocalizedText ne={topic.ne} en={topic.en} /> <LocalizedNumber value={count} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function OpinionFilterNotice({ issues }: { issues: OpinionParamIssue[] }) {
  if (!issues.length) return null;
  return (
    <div className="opinion-filter-issues" role="alert">
      <p className="font-bold">
        <LocalizedText ne="खोज फिल्टर सच्याउनुहोस्" en="Review your search filters" />
      </p>
      <ul>
        {issues.map((issue) => (
          <li key={issue}>
            <LocalizedText {...issueCopy[issue]} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function OpinionLead({ story }: { story: ArticleCard }) {
  const topic = topicFor(getOpinionTopic(story));
  return (
    <article className="opinion-lead" aria-labelledby={`opinion-lead-${story.id}`}>
      {story.leadMedia ? (
        <ArticleMedia
          media={story.leadMedia}
          aspectRatio="16 / 9"
          sizes="(max-width: 900px) 94vw, 63vw"
        />
      ) : (
        <MediaSlot aspectRatio="16 / 9" />
      )}
      <div className="opinion-lead__copy">
        <div className="opinion-story-meta">
          <Link
            className="opinion-topic-label"
            href={opinionHref({ query: "", topic: "all", sort: "newest" }, undefined, {
              topic: getOpinionTopic(story),
            })}
          >
            <LocalizedText ne={topic.ne} en={topic.en} />
          </Link>
          <span className="opinion-format-label">
            <LocalizedText {...kindLabels[story.kind as OpinionStoryKind]} />
          </span>
          <PublishedTime value={story.updatedAt ?? story.publishedAt} />
          <span className="opinion-sample-label">
            <LocalizedText ne="मुख्य विचार · काल्पनिक नमुना" en="Lead opinion · fictional sample" />
          </span>
        </div>
        <h2 id={`opinion-lead-${story.id}`} className="editorial-heading opinion-lead__headline">
          <Link href={story.href}>
            <LocalizedText ne={story.headline} />
          </Link>
        </h2>
        {story.summary ? (
          <p className="opinion-lead__summary">
            <LocalizedText ne={story.summary} />
          </p>
        ) : null}
        <div className="opinion-lead__footer">
          <AuthorByline authors={story.authors} />
          <span>
            <LocalizedText ne="काल्पनिक लेखक परिचय" en="Fictional author profile" />
          </span>
        </div>
      </div>
    </article>
  );
}

function OpinionCard({ story }: { story: ArticleCard }) {
  const topic = topicFor(getOpinionTopic(story));
  return (
    <article className="opinion-story-card" aria-labelledby={`opinion-story-${story.id}`}>
      {story.leadMedia ? (
        <ArticleMedia
          media={story.leadMedia}
          aspectRatio="16 / 9"
          sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 30vw"
        />
      ) : (
        <MediaSlot aspectRatio="16 / 9" />
      )}
      <div className="opinion-story-card__copy">
        <div className="opinion-story-meta">
          <Link
            className="opinion-topic-label"
            href={opinionHref({ query: "", topic: "all", sort: "newest" }, undefined, {
              topic: getOpinionTopic(story),
            })}
          >
            <LocalizedText ne={topic.ne} en={topic.en} />
          </Link>
          <span className="opinion-format-label">
            <LocalizedText {...kindLabels[story.kind as OpinionStoryKind]} />
          </span>
          <PublishedTime value={story.updatedAt ?? story.publishedAt} />
        </div>
        <h3 id={`opinion-story-${story.id}`} className="opinion-story-card__headline">
          <Link href={story.href}>
            <LocalizedText ne={story.headline} />
          </Link>
        </h3>
        {story.summary ? (
          <p className="opinion-story-card__summary">
            <LocalizedText ne={story.summary} />
          </p>
        ) : null}
        <div className="opinion-story-card__footer">
          <AuthorByline authors={story.authors} />
          <span>
            <LocalizedText ne="नमुना लेखक" en="Sample author" />
          </span>
        </div>
      </div>
    </article>
  );
}

function OpinionReading({ stories }: { stories: ArticleCard[] }) {
  return (
    <section className="opinion-reading" aria-labelledby="opinion-reading-title">
      <p className="eyebrow">
        <LocalizedText ne="छनोट गरिएको · नमुना" en="Desk selection · sample" />
      </p>
      <h2 id="opinion-reading-title" className="editorial-heading">
        <LocalizedText ne="विचार डेस्कबाट" en="From the opinion desk" />
      </h2>
      {stories.length ? (
        <ol>
          {stories.map((story, index) => (
            <li key={story.id}>
              <span className="opinion-reading__number" aria-hidden="true">
                <LocalizedNumber value={index + 1} />
              </span>
              <div>
                <p className="opinion-reading__topic">
                  <LocalizedText
                    ne={topicFor(getOpinionTopic(story)).ne}
                    en={topicFor(getOpinionTopic(story)).en}
                  />
                </p>
                <Link href={story.href}>
                  <LocalizedText ne={story.headline} />
                </Link>
                <p className="opinion-reading__author">
                  <AuthorByline authors={story.authors} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="opinion-reading__empty">
          <LocalizedText
            ne="छनोटका लागि थप स्तम्भ छैनन्।"
            en="No additional sample columns are available."
          />
        </p>
      )}
      <p className="opinion-reading__note">
        <LocalizedText
          ne="यो केवल पृष्ठको नमुना छनोट हो; पाठकको रुचि वा वास्तविक सम्पादकीय निर्णयको मापन होइन।"
          en="This is a sample page selection, not a measure of reader interest or a real editorial decision."
        />
      </p>
    </section>
  );
}

export function OpinionCategoryPage({
  categoryPage,
  categories,
  searchParams,
}: {
  categoryPage: CategoryPageData;
  categories: CategorySummary[];
  searchParams: OpinionSearchParams;
}) {
  const { filters, issues } = parseOpinionParams(searchParams);
  const stories = categoryPage.articles;
  const newestFirst = [...stories].sort(
    (left, right) =>
      Date.parse(right.updatedAt ?? right.publishedAt) -
      Date.parse(left.updatedAt ?? left.publishedAt),
  );
  const featured = newestFirst[0];
  const result = issues.includes("query_too_long")
    ? { stories: [], pageInfo: { page: 1, pageSize: 6, totalItems: 0, totalPages: 0 } }
    : selectOpinionStories(stories, filters);
  const hasFilters = Boolean(
    filters.query ||
      filters.topic !== "all" ||
      filters.kind ||
      filters.sort === "oldest" ||
      filters.page > 1,
  );
  const readingStories = newestFirst.filter((story) => story.id !== featured?.id).slice(0, 4);

  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell opinion-page py-7 sm:py-10">
        <Breadcrumbs
          items={[{ label: "गृहपृष्ठ", href: "/" }, { label: categoryPage.category.name }]}
        />
        <header className="opinion-page__header">
          <div className="opinion-page__masthead">
            <p className="eyebrow">
              <LocalizedText ne="विचार, स्तम्भ र विश्लेषण" en="Opinion, columns, and analysis" />
            </p>
            <p className="opinion-page__edition">
              <LocalizedText ne="विचार डेस्क · नमुना संस्करण" en="Opinion desk · preview edition" />
            </p>
          </div>
          <h1 className="editorial-heading opinion-page__title">
            <LocalizedText ne="विचार" en="Opinion" />
          </h1>
          <p className="opinion-page__intro">
            <LocalizedText
              ne="नीति, समाज, अर्थतन्त्र र संस्कृतिबारे विचार तथा विश्लेषण पढ्नुहोस्। स्तम्भकारको मत र समाचार रिपोर्टिङ फरक विधा हुन्—हरेक सामग्रीमा लेखक र विधा स्पष्ट राखिन्छ। तलका सबै शीर्षक, परिचय र मत काल्पनिक डिजाइन नमुना हुन्।"
              en="Read commentary and analysis on public life, society, the economy, and culture. A columnist’s view is distinct from reported news, so each item identifies its author and format. All headlines, biographies, and views below are fictional design samples."
            />
          </p>
          <nav className="opinion-section-nav" aria-labelledby="opinion-section-nav-title">
            <span id="opinion-section-nav-title" className="sr-only">
              <LocalizedText ne="विचार पृष्ठका खण्डहरू" en="Opinion page sections" />
            </span>
            {!hasFilters ? (
              <a href="#opinion-lead">
                <LocalizedText ne="मुख्य विचार" en="Lead opinion" />
              </a>
            ) : null}
            <a href="#opinion-topics">
              <LocalizedText ne="विषयहरू" en="Topics" />
            </a>
            <a href="#opinion-stories">
              <LocalizedText ne="सबै विचार" en="All opinion" />
            </a>
            <a href="#opinion-standards">
              <LocalizedText ne="सम्पादकीय मापदण्ड" en="Editorial standards" />
            </a>
          </nav>
          <nav className="opinion-category-nav" aria-labelledby="opinion-other-sections-title">
            <span id="opinion-other-sections-title">
              <LocalizedText ne="अन्य खण्ड" en="Other sections" />
            </span>
            <ul>
              {categories
                .filter((category) => category.slug !== "opinion")
                .map((category) => (
                  <li key={category.slug}>
                    <Link href={`/category/${category.slug}`}>
                      <LocalizedText ne={category.name} />
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </header>

        <div className="opinion-topic-wrap" id="opinion-topics">
          <OpinionTopics filters={filters} stories={stories} />
        </div>

        <form action="/category/opinion" method="get">
          <search
            className="opinion-filters reader-feed-filters"
            aria-labelledby="opinion-filter-title"
          >
            <span id="opinion-filter-title" className="sr-only">
              <LocalizedText ne="विचार खोज्नुहोस् र फिल्टर गर्नुहोस्" en="Search and filter opinion" />
            </span>
            <div className="opinion-filters__search reader-feed-filters__search">
              <LocalizedSearchInput
                defaultValue={filters.query}
                accessibleLabel={{ ne: "विचार र स्तम्भ खोज्नुहोस्", en: "Search opinion and columns" }}
              />
              <button className="button-primary" type="submit">
                <LocalizedText ne="खोज्नुहोस्" en="Search" />
              </button>
            </div>
            <input
              type="hidden"
              name="topic"
              value={filters.topic === "all" ? "" : filters.topic}
            />
            <div className="opinion-filters__controls">
              <label>
                <span>
                  <LocalizedText ne="विधा" en="Format" />
                </span>
                <select className="field" name="kind" defaultValue={filters.kind ?? ""}>
                  <option value="">
                    <LocalizedText ne="सबै विधा" en="All formats" />
                  </option>
                  {OPINION_STORY_KINDS.map((kind) => (
                    <option key={kind} value={kind}>
                      <LocalizedText {...kindLabels[kind]} />
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>
                  <LocalizedText ne="क्रम" en="Order" />
                </span>
                <select className="field" name="sort" defaultValue={filters.sort}>
                  <option value="newest">
                    <LocalizedText ne="नयाँ पहिले" en="Newest first" />
                  </option>
                  <option value="oldest">
                    <LocalizedText ne="पुराना पहिले" en="Oldest first" />
                  </option>
                </select>
              </label>
              <button className="button-primary opinion-filters__apply" type="submit">
                <LocalizedText ne="फिल्टर लागू गर्नुहोस्" en="Apply filters" />
              </button>
              {hasFilters ? (
                <Link className="opinion-filters__clear" href="/category/opinion">
                  <LocalizedText ne="फिल्टर हटाउनुहोस्" en="Clear filters" />
                </Link>
              ) : null}
            </div>
          </search>
        </form>
        <OpinionFilterNotice issues={issues} />

        {!hasFilters && featured ? (
          <div className="opinion-lead-grid" id="opinion-lead">
            <section aria-labelledby="opinion-lead-heading">
              <div className="opinion-section-heading">
                <div>
                  <p className="eyebrow">
                    <LocalizedText ne="आजको विचार · काल्पनिक" en="Today’s opinion · fictional" />
                  </p>
                  <h2 id="opinion-lead-heading" className="editorial-heading">
                    <LocalizedText ne="विचारको मुख्य लेख" en="Opinion lead" />
                  </h2>
                </div>
                <span className="opinion-section-heading__status">
                  <LocalizedText ne="नमुना" en="Sample" />
                </span>
              </div>
              <OpinionLead story={featured} />
            </section>
            <OpinionReading stories={readingStories} />
          </div>
        ) : null}

        <div className="opinion-main-grid">
          <section
            className="opinion-feed"
            id="opinion-stories"
            aria-labelledby="opinion-feed-title"
          >
            <div className="opinion-section-heading opinion-section-heading--feed">
              <div>
                <p className="eyebrow">
                  {filters.topic !== "all" ? (
                    <LocalizedText
                      ne={topicFor(filters.topic).ne}
                      en={topicFor(filters.topic).en}
                    />
                  ) : filters.kind ? (
                    <LocalizedText {...kindLabels[filters.kind]} />
                  ) : (
                    <LocalizedText
                      ne="स्तम्भ र विश्लेषण · काल्पनिक फिड"
                      en="Columns and analysis · fictional feed"
                    />
                  )}
                </p>
                <h2 id="opinion-feed-title" className="editorial-heading">
                  {filters.query ? (
                    <>
                      <LocalizedText ne="खोज नतिजा" en="Search results" />: “{filters.query}”
                    </>
                  ) : (
                    <LocalizedText ne="ताजा विचार र स्तम्भ" en="Latest opinion and columns" />
                  )}
                </h2>
              </div>
              <p className="opinion-section-heading__count">
                <LocalizedNumber value={result.pageInfo.totalItems} />{" "}
                <LocalizedText ne="लेख" en="pieces" />
              </p>
            </div>
            {result.stories.length ? (
              <>
                <ul className="opinion-story-grid">
                  {result.stories.map((story) => (
                    <li key={story.id}>
                      <OpinionCard story={story} />
                    </li>
                  ))}
                </ul>
                <PageNavigation
                  pageInfo={result.pageInfo}
                  label="विचार सामग्री"
                  labelEn="Opinion stories"
                  previousHref={
                    result.pageInfo.page > 1
                      ? opinionHref(filters, result.pageInfo.page - 1)
                      : undefined
                  }
                  nextHref={
                    result.pageInfo.page < result.pageInfo.totalPages
                      ? opinionHref(filters, result.pageInfo.page + 1)
                      : undefined
                  }
                />
              </>
            ) : (
              <div className="opinion-feed__empty">
                <div className="state-panel">
                  <p className="editorial-heading text-xl font-bold">
                    <LocalizedText ne="मिल्दो सामग्री भेटिएन" en="No matching opinion pieces" />
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                    <LocalizedText
                      ne="अर्को शब्द प्रयोग गर्नुहोस् वा विषय र विधाको फिल्टर हटाउनुहोस्।"
                      en="Try another search or clear the topic and format filters."
                    />
                  </p>
                </div>
                <Link className="button-secondary mt-4" href="/category/opinion">
                  <LocalizedText ne="सबै विचार हेर्नुहोस्" en="View all opinion" />
                </Link>
              </div>
            )}
          </section>

          <aside className="opinion-sidebar">
            <section
              className="opinion-reading opinion-reading--sidebar"
              aria-labelledby="opinion-reading-sidebar-title"
            >
              <p className="eyebrow">
                <LocalizedText ne="पढ्ने तरिका" en="A reader’s guide" />
              </p>
              <h2 id="opinion-reading-sidebar-title" className="editorial-heading">
                <LocalizedText ne="मत र समाचार छुट्याउनुहोस्" en="Separate views from reporting" />
              </h2>
              <ul className="opinion-reader-guide">
                <li>
                  <LocalizedText
                    ne="लेखक र उनको भूमिका जाँच्नुहोस्।"
                    en="Check who wrote the piece and their stated role."
                  />
                </li>
                <li>
                  <LocalizedText
                    ne="विचारलाई समाचारको पुष्टि भएको तथ्य नसम्झनुहोस्।"
                    en="Do not treat an opinion as independently verified reporting."
                  />
                </li>
                <li>
                  <LocalizedText
                    ne="दाबीका स्रोत र लेखमा उल्लेख गरिएका प्रमाण खोज्नुहोस्।"
                    en="Look for the sources and evidence cited for a claim."
                  />
                </li>
              </ul>
            </section>
            <section
              className="opinion-standards"
              id="opinion-standards"
              aria-labelledby="opinion-standards-title"
            >
              <p className="eyebrow">
                <LocalizedText ne="पारदर्शिता" en="Transparency" />
              </p>
              <h2 id="opinion-standards-title" className="editorial-heading">
                <LocalizedText ne="लेखकीय स्वतन्त्रता र स्पष्टता" en="Independence and clarity" />
              </h2>
              <p>
                <LocalizedText
                  ne="विचार सामग्रीमा लेखकको नाम, सामग्रीको विधा, सम्भावित हितको द्वन्द्व र उद्धृत स्रोत सम्पादकीय प्रक्रियामा स्पष्ट खुलाउनुपर्छ। यो पूर्वावलोकनमा लेखक र धारणा काल्पनिक छन्।"
                  en="Opinion publishing should clearly identify the author, format, possible conflicts of interest, and cited sources. Authors and views in this preview are fictional."
                />
              </p>
              <Link href="/editorial-standards">
                <LocalizedText ne="सम्पादकीय मापदण्ड पढ्नुहोस्" en="Read editorial standards" /> →
              </Link>
            </section>
          </aside>
        </div>
        <p className="opinion-page__footer-note" role="note">
          <LocalizedText
            ne="यस विचार पृष्ठका सबै शीर्षक, मिति, लेखक परिचय र मत काल्पनिक डिजाइन नमुना हुन्; वास्तविक व्यक्तिको धारणा वा समाचार रिपोर्ट होइनन्।"
            en="All headlines, dates, author biographies, and views on this Opinion page are fictional design samples, not real people’s views or news reporting."
          />
        </p>
      </main>
    </>
  );
}
