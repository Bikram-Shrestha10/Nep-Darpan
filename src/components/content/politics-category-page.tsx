import Link from "next/link";
import { ArticleMedia, MediaSlot } from "@/components/content/article-media";
import { AuthorByline, PublishedTime, StoryKindTag } from "@/components/content/story-metadata";
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
  parsePoliticsParams,
  POLITICS_STORY_KINDS,
  selectPoliticsStories,
  type PoliticsParamIssue,
  type PoliticsSearchParams,
  type PoliticsStoryKind,
} from "@/lib/content/politics-feed";

const issueCopy: Record<PoliticsParamIssue, { ne: string; en: string }> = {
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
};

const kindLabels: Record<PoliticsStoryKind, { ne: string; en: string }> = {
  news: { ne: "समाचार", en: "News" },
  analysis: { ne: "विश्लेषण", en: "Analysis" },
  opinion: { ne: "विचार", en: "Opinion" },
  explainer: { ne: "व्याख्या", en: "Explainers" },
  fact_check: { ne: "तथ्य जाँच", en: "Fact checks" },
  guide: { ne: "मार्गदर्शिका", en: "Guides" },
};

function politicsHref(
  filters: { query: string; kind?: PoliticsStoryKind; sort: "newest" | "oldest" },
  page?: number,
  kindOverride?: PoliticsStoryKind | null,
) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  const kind = kindOverride === undefined ? filters.kind : kindOverride;
  if (kind) params.set("kind", kind);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (page) params.set("page", String(page));
  const query = params.toString();
  return query ? `/category/politics?${query}` : "/category/politics";
}

function PoliticsFilterNotice({ issues }: { issues: PoliticsParamIssue[] }) {
  if (issues.length === 0) return null;
  return (
    <div className="politics-filter-issues" role="alert">
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

function PoliticsStoryCard({ story }: { story: ArticleCard }) {
  return (
    <article className="politics-story-card">
      {story.leadMedia ? (
        <ArticleMedia
          media={story.leadMedia}
          aspectRatio="16 / 9"
          sizes="(max-width: 640px) 94vw, (max-width: 1024px) 44vw, 560px"
        />
      ) : (
        <MediaSlot aspectRatio="16 / 9" />
      )}
      <div className="politics-story-card__copy">
        <div className="politics-story-card__meta">
          {story.kind !== "news" ? <StoryKindTag kind={story.kind} /> : null}
          <PublishedTime value={story.updatedAt ?? story.publishedAt} />
        </div>
        <h3 className="politics-story-card__headline">
          <Link href={story.href}>
            <LocalizedText ne={story.headline} />
          </Link>
        </h3>
        {story.summary ? (
          <p className="politics-story-card__summary">
            <LocalizedText ne={story.summary} />
          </p>
        ) : null}
        <div className="politics-story-card__footer">
          <AuthorByline authors={story.authors} />
          <span>
            <LocalizedText ne="काल्पनिक नमुना" en="Fictional sample" />
          </span>
        </div>
      </div>
    </article>
  );
}

function PoliticsLead({ story }: { story: ArticleCard }) {
  return (
    <article className="politics-lead" aria-labelledby={`politics-lead-${story.id}`}>
      {story.leadMedia ? (
        <ArticleMedia
          media={story.leadMedia}
          aspectRatio="16 / 9"
          sizes="(max-width: 900px) 94vw, 62vw"
        />
      ) : (
        <MediaSlot aspectRatio="16 / 9" />
      )}
      <div className="politics-lead__copy">
        <div className="politics-story-card__meta">
          {story.kind !== "news" ? <StoryKindTag kind={story.kind} /> : null}
          <PublishedTime value={story.updatedAt ?? story.publishedAt} />
        </div>
        <h2 id={`politics-lead-${story.id}`} className="editorial-heading politics-lead__headline">
          <Link href={story.href}>
            <LocalizedText ne={story.headline} />
          </Link>
        </h2>
        {story.summary ? (
          <p className="politics-lead__summary">
            <LocalizedText ne={story.summary} />
          </p>
        ) : null}
        <div className="politics-lead__footer">
          <AuthorByline authors={story.authors} />
          <Link className="politics-lead__read-more" href={story.href}>
            <LocalizedText ne="समाचार पढ्नुहोस्" en="Read story" /> <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function PoliticsBriefing({ stories }: { stories: ArticleCard[] }) {
  if (stories.length === 0) return null;
  return (
    <aside className="politics-briefing" aria-labelledby="politics-briefing-title">
      <div className="politics-panel-heading">
        <p className="eyebrow">
          <LocalizedText ne="फिड पूर्वावलोकन" en="Feed preview" />
        </p>
        <h2 id="politics-briefing-title" className="editorial-heading">
          <LocalizedText ne="राजनीतिका मुख्य शीर्षक" en="Politics briefing" />
        </h2>
      </div>
      <ol>
        {stories.map((story, index) => (
          <li key={story.id}>
            <span className="politics-briefing__number" aria-hidden="true">
              <LocalizedNumber value={index + 1} />
            </span>
            <div>
              <p className="politics-briefing__time">
                <PublishedTime value={story.updatedAt ?? story.publishedAt} />
              </p>
              <Link href={story.href}>
                <LocalizedText ne={story.headline} />
              </Link>
            </div>
          </li>
        ))}
      </ol>
      <p className="politics-briefing__note">
        <LocalizedText
          ne="यी काल्पनिक नमुना शीर्षक हुन्; लाइभ अपडेट होइनन्।"
          en="Fictional sample headlines; not live updates."
        />
      </p>
    </aside>
  );
}

function PoliticalContext({ entries }: { entries: HubEntry[] }) {
  if (entries.length === 0) {
    return (
      <section className="politics-context">
        <p className="eyebrow">
          <LocalizedText ne="पृष्ठभूमि" en="Background" />
        </p>
        <h2 className="editorial-heading">
          <LocalizedText ne="राजनीति बुझ्ने सन्दर्भ" en="Political context" />
        </h2>
        <p>
          <LocalizedText
            ne="व्याख्या र मार्गदर्शिका सामग्री उपलब्ध भएपछि यहाँ थपिनेछ।"
            en="Explainers and guides will appear here when available."
          />
        </p>
        <Link className="politics-context__link" href="/information-hub">
          <LocalizedText ne="जानकारी केन्द्र हेर्नुहोस्" en="Visit the information hub" /> →
        </Link>
      </section>
    );
  }
  return (
    <section className="politics-context" aria-labelledby="politics-context-title">
      <p className="eyebrow">
        <LocalizedText ne="पृष्ठभूमि र प्रक्रिया" en="Context and process" />
      </p>
      <h2 id="politics-context-title" className="editorial-heading">
        <LocalizedText ne="राजनीति बुझ्ने सन्दर्भ" en="Understand the context" />
      </h2>
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
      <Link className="politics-context__link" href="/information-hub">
        <LocalizedText ne="सबै व्याख्या र मार्गदर्शिका" en="All explainers and guides" /> →
      </Link>
    </section>
  );
}

export function PoliticsCategoryPage({
  categoryPage,
  categories,
  hubEntries,
  searchParams,
}: {
  categoryPage: CategoryPageData;
  categories: CategorySummary[];
  hubEntries: HubEntry[];
  searchParams: PoliticsSearchParams;
}) {
  const { filters, issues } = parsePoliticsParams(searchParams);
  const allPoliticsStories = categoryPage.articles;
  const featured = [...allPoliticsStories].sort(
    (left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt),
  )[0];
  const result = issues.includes("query_too_long")
    ? {
        stories: [],
        pageInfo: { page: 1, pageSize: 6, totalItems: 0, totalPages: 0 },
      }
    : selectPoliticsStories(allPoliticsStories, filters);
  const hasFilters = Boolean(filters.query || filters.kind || filters.sort === "oldest");
  const briefingStories = allPoliticsStories
    .filter((story) => story.id !== featured?.id)
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt))
    .slice(0, 4);
  const picks = allPoliticsStories
    .toSorted((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt))
    .slice(0, 5);

  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell politics-page py-7 sm:py-10">
        <Breadcrumbs
          items={[{ label: "गृहपृष्ठ", href: "/" }, { label: categoryPage.category.name }]}
        />

        <header className="politics-page__header">
          <div className="politics-page__masthead">
            <p className="eyebrow">
              <LocalizedText
                ne="नेपाल राजनीति · समाचार र सन्दर्भ"
                en="Nepal politics · News and context"
              />
            </p>
            <p className="politics-page__edition">
              <LocalizedText ne="सम्पादकीय फिड · नमुना संस्करण" en="Editorial feed · preview edition" />
            </p>
          </div>
          <h1 className="editorial-heading politics-page__title">
            <LocalizedText ne="राजनीति" en="Politics" />
          </h1>
          <p className="politics-page__intro">
            <LocalizedText
              ne="संसद, सरकार, राजनीतिक दल र सार्वजनिक नीतिसँग सम्बन्धित समाचार, विश्लेषण र व्याख्या। यहाँ देखिएका सबै सामग्री डिजाइन पूर्वावलोकनका लागि बनाइएका काल्पनिक नमुना हुन्।"
              en="News, analysis, and explainers about parliament, government, political parties, and public policy. All items shown here are fictional samples for the design preview."
            />
          </p>
          <nav className="politics-section-nav" aria-labelledby="politics-section-nav-title">
            <span className="sr-only" id="politics-section-nav-title">
              <LocalizedText ne="राजनीतिका सामग्री प्रकार" en="Politics story types" />
            </span>
            <Link
              className={`story-category${!filters.kind ? " is-active" : ""}`}
              href={politicsHref(filters, undefined, null)}
              aria-current={!filters.kind ? "page" : undefined}
            >
              <LocalizedText ne="सबै" en="All" />
            </Link>
            {POLITICS_STORY_KINDS.map((kind) => (
              <Link
                className={`story-category${filters.kind === kind ? " is-active" : ""}`}
                href={politicsHref(filters, undefined, kind)}
                key={kind}
                aria-current={filters.kind === kind ? "page" : undefined}
              >
                <LocalizedText {...kindLabels[kind]} />
              </Link>
            ))}
          </nav>
          <nav className="politics-category-nav" aria-labelledby="politics-other-sections-title">
            <span id="politics-other-sections-title">
              <LocalizedText ne="अन्य खण्ड" en="Other sections" />
            </span>
            <ul>
              {categories
                .filter((category) => category.slug !== "politics")
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

        <form action="/category/politics" method="get">
          <search
            className="politics-filters reader-feed-filters"
            aria-labelledby="politics-filter-title"
          >
            <span id="politics-filter-title" className="sr-only">
              <LocalizedText
                ne="राजनीति समाचार खोज र फिल्टर"
                en="Search and filter politics stories"
              />
            </span>
            <div className="politics-filters__search reader-feed-filters__search">
              <label className="sr-only" htmlFor="search-query">
                <LocalizedText ne="राजनीति समाचार खोज्नुहोस्" en="Search politics stories" />
              </label>
              <LocalizedSearchInput defaultValue={filters.query} />
              <button className="button-primary" type="submit">
                <LocalizedText ne="खोज्नुहोस्" en="Search" />
              </button>
            </div>
            <div className="politics-filters__controls">
              <label>
                <span>
                  <LocalizedText ne="सामग्री प्रकार" en="Story type" />
                </span>
                <select className="field" name="kind" defaultValue={filters.kind ?? ""}>
                  <option value="">
                    <LocalizedText ne="सबै प्रकार" en="All types" />
                  </option>
                  {POLITICS_STORY_KINDS.map((kind) => (
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
              <button className="button-primary politics-filters__apply" type="submit">
                <LocalizedText ne="फिल्टर लागू गर्नुहोस्" en="Apply filters" />
              </button>
              {hasFilters ? (
                <Link className="politics-filters__clear" href="/category/politics">
                  <LocalizedText ne="फिल्टर हटाउनुहोस्" en="Clear filters" />
                </Link>
              ) : null}
            </div>
          </search>
        </form>
        <PoliticsFilterNotice issues={issues} />

        {!hasFilters && featured ? (
          <div className="politics-top-stories">
            <section aria-labelledby="politics-featured-title">
              <div className="politics-section-heading">
                <div>
                  <p className="eyebrow">
                    <LocalizedText
                      ne="सम्पादकीय प्राथमिकता · काल्पनिक"
                      en="Editorial lead · fictional"
                    />
                  </p>
                  <h2 id="politics-featured-title" className="editorial-heading">
                    <LocalizedText ne="राजनीतिको मुख्य समाचार" en="Politics lead story" />
                  </h2>
                </div>
                <span className="politics-section-heading__sample">
                  <LocalizedText ne="नमुना" en="Sample" />
                </span>
              </div>
              <PoliticsLead story={featured} />
            </section>
            <PoliticsBriefing stories={briefingStories} />
          </div>
        ) : null}

        <div className="politics-main-grid">
          <section className="politics-feed" aria-labelledby="politics-feed-title">
            <div className="politics-section-heading politics-section-heading--feed">
              <div>
                <p className="eyebrow">
                  {filters.kind ? (
                    <LocalizedText {...kindLabels[filters.kind]} />
                  ) : (
                    <LocalizedText ne="सबै सामग्री" en="All coverage" />
                  )}
                </p>
                <h2 id="politics-feed-title" className="editorial-heading">
                  {filters.query ? (
                    <>
                      <LocalizedText ne="खोज नतिजा" en="Search results" />: “{filters.query}”
                    </>
                  ) : (
                    <LocalizedText ne="ताजा राजनीति समाचार" en="Latest politics stories" />
                  )}
                </h2>
              </div>
              <p className="politics-section-heading__count">
                <LocalizedNumber value={result.pageInfo.totalItems} />{" "}
                <LocalizedText ne="सामग्री" en="stories" />
              </p>
            </div>
            {result.stories.length ? (
              <>
                <ul className="politics-story-grid">
                  {result.stories.map((story) => (
                    <li key={story.id}>
                      <PoliticsStoryCard story={story} />
                    </li>
                  ))}
                </ul>
                <PageNavigation
                  pageInfo={result.pageInfo}
                  label="राजनीति समाचार"
                  labelEn="Politics stories"
                  previousHref={
                    result.pageInfo.page > 1
                      ? politicsHref(filters, result.pageInfo.page - 1)
                      : undefined
                  }
                  nextHref={
                    result.pageInfo.page < result.pageInfo.totalPages
                      ? politicsHref(filters, result.pageInfo.page + 1)
                      : undefined
                  }
                />
              </>
            ) : (
              <div className="politics-feed__empty">
                <div className="state-panel">
                  <p className="editorial-heading text-xl font-bold">
                    <LocalizedText ne="मिल्दो सामग्री भेटिएन" en="No matching stories" />
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                    <LocalizedText
                      ne="अर्को शब्द प्रयोग गर्नुहोस् वा सामग्री प्रकारको फिल्टर हटाउनुहोस्।"
                      en="Try another search or clear the story-type filter."
                    />
                  </p>
                </div>
                <Link className="button-secondary mt-4" href="/category/politics">
                  <LocalizedText ne="सबै राजनीति समाचार हेर्नुहोस्" en="View all politics stories" />
                </Link>
              </div>
            )}
          </section>

          <aside className="politics-sidebar">
            <section className="politics-picks" aria-labelledby="politics-picks-title">
              <div className="politics-panel-heading">
                <p className="eyebrow">
                  <LocalizedText ne="सम्पादकीय चयन · नमुना" en="Editorial selection · sample" />
                </p>
                <h2 id="politics-picks-title" className="editorial-heading">
                  <LocalizedText ne="पढ्नका लागि" en="Selected reading" />
                </h2>
              </div>
              <ol>
                {picks.map((story, index) => (
                  <li key={story.id}>
                    <span className="politics-picks__number" aria-hidden="true">
                      <LocalizedNumber value={index + 1} />
                    </span>
                    <div>
                      {story.kind !== "news" ? (
                        <p className="politics-picks__kind">
                          <LocalizedText {...kindLabels[story.kind]} />
                        </p>
                      ) : null}
                      <Link href={story.href}>
                        <LocalizedText ne={story.headline} />
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="politics-picks__disclosure">
                <LocalizedText
                  ne="यो सूची लेआउट परीक्षणका लागि हो; वास्तविक लोकप्रियता वा सम्पादकीय निर्णय होइन।"
                  en="This list is for layout testing; it does not represent real popularity or editorial decisions."
                />
              </p>
            </section>
            <PoliticalContext entries={hubEntries} />
            <section className="politics-standards">
              <p className="eyebrow">
                <LocalizedText ne="समाचार कक्षका मापदण्ड" en="Newsroom standards" />
              </p>
              <h2 className="editorial-heading">
                <LocalizedText ne="स्रोत र जवाफदेहिता" en="Sources and accountability" />
              </h2>
              <p>
                <LocalizedText
                  ne="वास्तविक राजनीतिक समाचारमा स्रोत, दाबीको सन्दर्भ र सुधारको इतिहास स्पष्ट हुनुपर्छ। यस पृष्ठका सामग्री भने नमुना मात्र हुन्।"
                  en="Real political reporting should show sources, context for claims, and correction history. The stories on this page are samples only."
                />
              </p>
              <Link href="/editorial-standards">
                <LocalizedText ne="सम्पादकीय मापदण्ड पढ्नुहोस्" en="Read editorial standards" /> →
              </Link>
            </section>
          </aside>
        </div>
        <p className="politics-page__footer-note" role="note">
          <LocalizedText
            ne="यस पृष्ठका सबै राजनीति सामग्री काल्पनिक डिजाइन नमुना हुन्; कुनै वास्तविक व्यक्ति, दल, निर्णय वा घटनाबारे रिपोर्ट होइनन्।"
            en="All politics content on this page is fictional design material, not reporting about real people, parties, decisions, or events."
          />
        </p>
      </main>
    </>
  );
}
