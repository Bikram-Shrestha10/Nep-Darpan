import Link from "next/link";
import { ArticleMedia, MediaSlot } from "@/components/content/article-media";
import { AuthorByline, PublishedTime } from "@/components/content/story-metadata";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { LocalizedNumber, LocalizedText } from "@/components/layout/site-preferences";
import { LocalizedSearchInput } from "@/components/search/localized-search-input";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageNavigation } from "@/components/ui/page-navigation";
import type {
  ArticleCard,
  CategoryPageData,
  CategorySummary,
  HubEntry,
} from "@/lib/content/contracts";
import {
  getTechnologyTopic,
  parseTechnologyParams,
  selectTechnologyStories,
  TECHNOLOGY_STORY_KINDS,
  TECHNOLOGY_TOPICS,
  type TechnologyParamIssue,
  type TechnologySearchParams,
  type TechnologyStoryKind,
  type TechnologyTopic,
} from "@/lib/content/technology-feed";

const issueCopy: Record<TechnologyParamIssue, { ne: string; en: string }> = {
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
    ne: "विषय मान्य थिएन; सबै प्रविधि समाचार देखाइएको छ।",
    en: "The topic was invalid; showing all technology stories.",
  },
};

const kindLabels: Record<TechnologyStoryKind, { ne: string; en: string }> = {
  news: { ne: "समाचार", en: "News" },
  analysis: { ne: "विश्लेषण", en: "Analysis" },
  opinion: { ne: "विचार", en: "Opinion" },
  explainer: { ne: "व्याख्या", en: "Explainers" },
  fact_check: { ne: "तथ्य जाँच", en: "Fact checks" },
  guide: { ne: "मार्गदर्शिका", en: "Guides" },
};

function topicFor(topic: TechnologyTopic) {
  const match = TECHNOLOGY_TOPICS.find((item) => item.slug === topic);
  if (!match) throw new Error(`Unknown technology topic: ${topic}`);
  return match;
}

function technologyHref(
  filters: {
    query: string;
    topic: TechnologyTopic;
    kind?: TechnologyStoryKind;
    sort: "newest" | "oldest";
  },
  page?: number,
  overrides: { topic?: TechnologyTopic; kind?: TechnologyStoryKind | null } = {},
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
  return query ? `/category/technology?${query}` : "/category/technology";
}

function TechnologyFilterNotice({ issues }: { issues: TechnologyParamIssue[] }) {
  if (!issues.length) return null;
  return (
    <div className="technology-filter-issues" role="alert">
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

function TechnologyTopics({
  filters,
  stories,
}: {
  filters: {
    query: string;
    topic: TechnologyTopic;
    kind?: TechnologyStoryKind;
    sort: "newest" | "oldest";
  };
  stories: ArticleCard[];
}) {
  return (
    <nav className="technology-topic-nav" aria-labelledby="technology-topics-title">
      <p id="technology-topics-title" className="eyebrow">
        <LocalizedText ne="प्रविधिका विषयहरू" en="Technology topics" />
      </p>
      <ul>
        {TECHNOLOGY_TOPICS.map((topic) => {
          const count =
            topic.slug === "all"
              ? stories.length
              : stories.filter((story) => getTechnologyTopic(story) === topic.slug).length;
          return (
            <li key={topic.slug}>
              <Link
                href={technologyHref(filters, undefined, { topic: topic.slug })}
                aria-current={filters.topic === topic.slug ? "page" : undefined}
              >
                <span className="technology-topic-nav__copy">
                  <span className="technology-topic-nav__name">
                    <LocalizedText ne={topic.ne} en={topic.en} />
                  </span>
                  <span className="technology-topic-nav__description">
                    <LocalizedText ne={topic.descriptionNe} en={topic.descriptionEn} />
                  </span>
                </span>
                <span className="technology-topic-nav__count">
                  <LocalizedNumber value={count} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function TechnologyStoryCard({ story }: { story: ArticleCard }) {
  const topic = topicFor(getTechnologyTopic(story));
  return (
    <article className="technology-story-card">
      {story.leadMedia ? (
        <ArticleMedia
          media={story.leadMedia}
          aspectRatio="16 / 9"
          sizes="(max-width: 600px) 92vw, (max-width: 1000px) 45vw, 480px"
        />
      ) : (
        <MediaSlot aspectRatio="16 / 9" />
      )}
      <div className="technology-story-card__copy">
        <div className="technology-story-card__meta">
          <Link
            href={technologyHref({ query: "", topic: "all", sort: "newest" }, undefined, {
              topic: getTechnologyTopic(story),
            })}
            className="technology-topic-label"
          >
            <LocalizedText ne={topic.ne} en={topic.en} />
          </Link>
          <PublishedTime value={story.updatedAt ?? story.publishedAt} />
        </div>
        <h3 className="technology-story-card__headline">
          <Link href={story.href}>
            <LocalizedText ne={story.headline} />
          </Link>
        </h3>
        {story.summary ? (
          <p className="technology-story-card__summary">
            <LocalizedText ne={story.summary} />
          </p>
        ) : null}
        <div className="technology-story-card__footer">
          <AuthorByline authors={story.authors} />
          <span>
            <LocalizedText ne="काल्पनिक नमुना" en="Fictional sample" />
          </span>
        </div>
      </div>
    </article>
  );
}

function TechnologyLead({ story }: { story: ArticleCard }) {
  const topic = topicFor(getTechnologyTopic(story));
  return (
    <article className="technology-lead" aria-labelledby={`technology-lead-${story.id}`}>
      {story.leadMedia ? (
        <ArticleMedia
          media={story.leadMedia}
          aspectRatio="16 / 9"
          sizes="(max-width: 900px) 94vw, 61vw"
        />
      ) : (
        <MediaSlot aspectRatio="16 / 9" />
      )}
      <div className="technology-lead__copy">
        <div className="technology-story-card__meta">
          <Link
            href={technologyHref({ query: "", topic: "all", sort: "newest" }, undefined, {
              topic: getTechnologyTopic(story),
            })}
            className="technology-topic-label"
          >
            <LocalizedText ne={topic.ne} en={topic.en} />
          </Link>
          <PublishedTime value={story.updatedAt ?? story.publishedAt} />
          <span className="technology-sample-label">
            <LocalizedText ne="मुख्य प्रविधि समाचार · नमुना" en="Technology lead · sample" />
          </span>
        </div>
        <h2
          id={`technology-lead-${story.id}`}
          className="editorial-heading technology-lead__headline"
        >
          <Link href={story.href}>
            <LocalizedText ne={story.headline} />
          </Link>
        </h2>
        {story.summary ? (
          <p className="technology-lead__summary">
            <LocalizedText ne={story.summary} />
          </p>
        ) : null}
        <div className="technology-lead__footer">
          <AuthorByline authors={story.authors} />
          <Link className="technology-lead__read-more" href={story.href}>
            <LocalizedText ne="समाचार पढ्नुहोस्" en="Read story" /> <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function TechnologyBriefing({ stories }: { stories: ArticleCard[] }) {
  return (
    <aside className="technology-briefing" aria-labelledby="technology-briefing-title">
      <div className="technology-panel-heading">
        <p className="eyebrow">
          <LocalizedText ne="प्रविधिका छोटा शीर्षक · नमुना" en="Technology headlines · sample" />
        </p>
        <h2 id="technology-briefing-title" className="editorial-heading">
          <LocalizedText ne="प्रविधि संक्षेप" en="Technology briefing" />
        </h2>
      </div>
      {stories.length ? (
        <ol>
          {stories.map((story, index) => (
            <li key={story.id}>
              <span className="technology-briefing__number" aria-hidden="true">
                <LocalizedNumber value={index + 1} />
              </span>
              <div>
                <p className="technology-briefing__time">
                  <PublishedTime value={story.updatedAt ?? story.publishedAt} />
                </p>
                <Link href={story.href}>
                  <LocalizedText ne={story.headline} />
                </Link>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="technology-briefing__empty">
          <LocalizedText
            ne="थप नमुना शीर्षक उपलब्ध छैन।"
            en="No more sample headlines are available."
          />
        </p>
      )}
      <p className="technology-briefing__note">
        <LocalizedText
          ne="यो स्थिर पूर्वावलोकन हो; प्रत्यक्ष प्रविधि समाचार फिड होइन।"
          en="This is a static preview, not a live technology news feed."
        />
      </p>
    </aside>
  );
}

function TechnologyReading({ stories }: { stories: ArticleCard[] }) {
  return (
    <section className="technology-reading" aria-labelledby="technology-reading-title">
      <div className="technology-panel-heading">
        <p className="eyebrow">
          <LocalizedText ne="सम्पादकीय चयन · नमुना" en="Editorial selection · sample" />
        </p>
        <h2 id="technology-reading-title" className="editorial-heading">
          <LocalizedText ne="पढ्नका लागि" en="Selected reading" />
        </h2>
      </div>
      <ol>
        {stories.map((story, index) => (
          <li key={story.id}>
            <span className="technology-reading__number" aria-hidden="true">
              <LocalizedNumber value={index + 1} />
            </span>
            <div>
              <p className="technology-reading__topic">
                <LocalizedText
                  ne={topicFor(getTechnologyTopic(story)).ne}
                  en={topicFor(getTechnologyTopic(story)).en}
                />
              </p>
              <Link href={story.href}>
                <LocalizedText ne={story.headline} />
              </Link>
            </div>
          </li>
        ))}
      </ol>
      <p className="technology-reading__disclosure">
        <LocalizedText
          ne="यो नमुना सूची हो; लोकप्रियता वा वास्तविक सम्पादकीय छनोट होइन।"
          en="This is a sample list, not a popularity ranking or real editorial selection."
        />
      </p>
    </section>
  );
}

function TechnologyContext({ entries }: { entries: HubEntry[] }) {
  return (
    <section
      className="technology-context"
      id="technology-context"
      aria-labelledby="technology-context-title"
    >
      <div className="technology-panel-heading">
        <p className="eyebrow">
          <LocalizedText ne="स्रोत र पृष्ठभूमि" en="Sources and context" />
        </p>
        <h2 id="technology-context-title" className="editorial-heading">
          <LocalizedText ne="प्रविधि समाचार बुझ्ने सन्दर्भ" en="Context for technology news" />
        </h2>
      </div>
      <ul>
        {entries.slice(0, 3).map((entry) => (
          <li key={entry.id}>
            <Link href={`/information-hub/${entry.slug}`}>
              <LocalizedText ne={entry.title} />
            </Link>
            <p>
              <LocalizedText ne={entry.summary} />
            </p>
          </li>
        ))}
      </ul>
      <Link className="technology-context__link" href="/information-hub">
        <LocalizedText ne="जानकारी केन्द्र हेर्नुहोस्" en="Visit the information hub" /> →
      </Link>
    </section>
  );
}

export function TechnologyCategoryPage({
  categoryPage,
  categories,
  hubEntries,
  searchParams,
}: {
  categoryPage: CategoryPageData;
  categories: CategorySummary[];
  hubEntries: HubEntry[];
  searchParams: TechnologySearchParams;
}) {
  const { filters, issues } = parseTechnologyParams(searchParams);
  const stories = categoryPage.articles;
  const newestFirst = [...stories].sort(
    (left, right) =>
      Date.parse(right.updatedAt ?? right.publishedAt) -
      Date.parse(left.updatedAt ?? left.publishedAt),
  );
  const featured = newestFirst[0];
  const result = issues.includes("query_too_long")
    ? { stories: [], pageInfo: { page: 1, pageSize: 6, totalItems: 0, totalPages: 0 } }
    : selectTechnologyStories(stories, filters);
  const hasFilters = Boolean(
    filters.query ||
      filters.topic !== "all" ||
      filters.kind ||
      filters.sort === "oldest" ||
      filters.page > 1,
  );
  const digestStories = newestFirst.filter((story) => story.id !== featured?.id).slice(0, 4);
  const selectedStories = newestFirst.filter((story) => story.id !== featured?.id).slice(0, 5);
  const technologyHubEntries = hubEntries.filter((entry) =>
    entry.related.some((story) => story.category.slug === "technology"),
  );

  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell technology-page py-7 sm:py-10">
        <Breadcrumbs
          items={[{ label: "गृहपृष्ठ", href: "/" }, { label: categoryPage.category.name }]}
        />
        <header className="technology-page__header">
          <div className="technology-page__masthead">
            <p className="eyebrow">
              <LocalizedText
                ne="प्रविधि समाचार · मानिस, प्रणाली र नयाँ सोच"
                en="Technology · people, systems, and ideas"
              />
            </p>
            <p className="technology-page__edition">
              <LocalizedText ne="प्रविधि डेस्क · नमुना संस्करण" en="Technology desk · preview edition" />
            </p>
          </div>
          <h1 className="editorial-heading technology-page__title">
            <LocalizedText ne="प्रविधि" en="Technology" />
          </h1>
          <p className="technology-page__intro">
            <LocalizedText
              ne="डिजिटल जीवनदेखि कृत्रिम बुद्धिमत्ता, जडान र उपकरणसम्मका समाचार तथा व्याख्या। विषय छानेर हेर्नुहोस्। यहाँका सबै सामग्री काल्पनिक डिजाइन नमुना हुन्।"
              en="News and explainers on digital life, artificial intelligence, connectivity, and devices. Browse by topic. All content here is fictional design material."
            />
          </p>
          <nav className="technology-section-nav" aria-labelledby="technology-section-nav-title">
            <span id="technology-section-nav-title" className="sr-only">
              <LocalizedText ne="प्रविधि पृष्ठका खण्डहरू" en="Technology page sections" />
            </span>
            <a href="#technology-lead">
              <LocalizedText ne="मुख्य समाचार" en="Lead story" />
            </a>
            <a href="#technology-topics">
              <LocalizedText ne="विषयहरू" en="Topics" />
            </a>
            <a href="#technology-stories">
              <LocalizedText ne="ताजा समाचार" en="Latest stories" />
            </a>
            <a href="#technology-context">
              <LocalizedText ne="सन्दर्भ" en="Context" />
            </a>
          </nav>
          <nav
            className="technology-category-nav"
            aria-labelledby="technology-other-sections-title"
          >
            <span id="technology-other-sections-title">
              <LocalizedText ne="अन्य खण्ड" en="Other sections" />
            </span>
            <ul>
              {categories
                .filter((category) => category.slug !== "technology")
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

        <div id="technology-topics">
          <TechnologyTopics filters={filters} stories={stories} />
        </div>

        <form action="/category/technology" method="get">
          <search
            className="technology-filters reader-feed-filters"
            aria-labelledby="technology-filter-title"
          >
            <span id="technology-filter-title" className="sr-only">
              <LocalizedText ne="प्रविधि समाचार र फिल्टर" en="Search and filter technology stories" />
            </span>
            <div className="technology-filters__search reader-feed-filters__search">
              <LocalizedSearchInput
                defaultValue={filters.query}
                accessibleLabel={{ ne: "प्रविधि समाचार खोज्नुहोस्", en: "Search technology stories" }}
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
            <div className="technology-filters__controls">
              <label>
                <span>
                  <LocalizedText ne="सामग्री प्रकार" en="Story type" />
                </span>
                <select className="field" name="kind" defaultValue={filters.kind ?? ""}>
                  <option value="">
                    <LocalizedText ne="सबै प्रकार" en="All types" />
                  </option>
                  {TECHNOLOGY_STORY_KINDS.map((kind) => (
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
              <button className="button-primary technology-filters__apply" type="submit">
                <LocalizedText ne="फिल्टर लागू गर्नुहोस्" en="Apply filters" />
              </button>
              {hasFilters ? (
                <Link className="technology-filters__clear" href="/category/technology">
                  <LocalizedText ne="फिल्टर हटाउनुहोस्" en="Clear filters" />
                </Link>
              ) : null}
            </div>
          </search>
        </form>
        <TechnologyFilterNotice issues={issues} />

        <div id="technology-lead">
          {!hasFilters && featured ? (
            <div className="technology-top-stories">
              <section aria-labelledby="technology-lead-title">
                <div className="technology-section-heading">
                  <div>
                    <p className="eyebrow">
                      <LocalizedText
                        ne="सम्पादकीय प्राथमिकता · काल्पनिक"
                        en="Editorial lead · fictional"
                      />
                    </p>
                    <h2 id="technology-lead-title" className="editorial-heading">
                      <LocalizedText ne="प्रविधि मुख्य समाचार" en="Technology lead story" />
                    </h2>
                  </div>
                  <span className="technology-section-heading__status">
                    <LocalizedText ne="नमुना" en="Sample" />
                  </span>
                </div>
                <TechnologyLead story={featured} />
              </section>
              <TechnologyBriefing stories={digestStories} />
            </div>
          ) : null}
        </div>

        <div className="technology-main-grid">
          <section
            className="technology-feed"
            id="technology-stories"
            aria-labelledby="technology-feed-title"
          >
            <div className="technology-section-heading technology-section-heading--feed">
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
                    <LocalizedText ne="सबै विषय · काल्पनिक फिड" en="All topics · fictional feed" />
                  )}
                </p>
                <h2 id="technology-feed-title" className="editorial-heading">
                  {filters.query ? (
                    <>
                      <LocalizedText ne="खोज नतिजा" en="Search results" />: “{filters.query}”
                    </>
                  ) : (
                    <LocalizedText ne="प्रविधिका ताजा समाचार" en="Latest technology stories" />
                  )}
                </h2>
              </div>
              <p className="technology-section-heading__count">
                <LocalizedNumber value={result.pageInfo.totalItems} />{" "}
                <LocalizedText ne="सामग्री" en="stories" />
              </p>
            </div>
            {result.stories.length ? (
              <>
                <ul className="technology-story-grid">
                  {result.stories.map((story) => (
                    <li key={story.id}>
                      <TechnologyStoryCard story={story} />
                    </li>
                  ))}
                </ul>
                <PageNavigation
                  pageInfo={result.pageInfo}
                  label="प्रविधि समाचार"
                  labelEn="Technology stories"
                  previousHref={
                    result.pageInfo.page > 1
                      ? technologyHref(filters, result.pageInfo.page - 1)
                      : undefined
                  }
                  nextHref={
                    result.pageInfo.page < result.pageInfo.totalPages
                      ? technologyHref(filters, result.pageInfo.page + 1)
                      : undefined
                  }
                />
              </>
            ) : (
              <div className="technology-feed__empty">
                <div className="state-panel">
                  <p className="editorial-heading text-xl font-bold">
                    <LocalizedText ne="मिल्दो सामग्री भेटिएन" en="No matching stories" />
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                    <LocalizedText
                      ne="अर्को शब्द प्रयोग गर्नुहोस् वा विषय र सामग्री प्रकारको फिल्टर हटाउनुहोस्।"
                      en="Try another search or clear the topic and story-type filters."
                    />
                  </p>
                </div>
                <Link className="button-secondary mt-4" href="/category/technology">
                  <LocalizedText ne="सबै प्रविधि समाचार हेर्नुहोस्" en="View all technology stories" />
                </Link>
              </div>
            )}
          </section>

          <aside className="technology-sidebar">
            <TechnologyReading stories={selectedStories} />
            <TechnologyContext entries={technologyHubEntries} />
            <section className="technology-standards">
              <p className="eyebrow">
                <LocalizedText ne="प्रविधि रिपोर्टिङका आधार" en="Technology coverage standards" />
              </p>
              <h2 className="editorial-heading">
                <LocalizedText ne="स्रोत, प्रभाव र सीमा" en="Sources, impact, and limits" />
              </h2>
              <p>
                <LocalizedText
                  ne="प्रविधिबारे रिपोर्ट गर्दा दाबीको स्रोत, मिति, प्रयोगको सन्दर्भ र असर पर्न सक्ने पक्ष खुलाउनुपर्छ। यहाँका शीर्षक र विवरण काल्पनिक नमुना मात्र हुन्।"
                  en="Technology reporting should identify claim sources, dates, use context, and affected groups. Headlines and summaries here are fictional samples only."
                />
              </p>
              <Link href="/editorial-standards">
                <LocalizedText ne="सम्पादकीय मापदण्ड पढ्नुहोस्" en="Read editorial standards" /> →
              </Link>
            </section>
          </aside>
        </div>
        <p className="technology-page__footer-note" role="note">
          <LocalizedText
            ne="यस प्रविधि पृष्ठका सबै शीर्षक, मिति र विवरण काल्पनिक डिजाइन नमुना हुन्; वास्तविक व्यक्ति, कम्पनी, उत्पादन वा घटनाबारे रिपोर्ट होइनन्।"
            en="All headlines, dates, and summaries on this Technology page are fictional design samples, not reporting about real people, companies, products, or events."
          />
        </p>
      </main>
    </>
  );
}
