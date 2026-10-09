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
  ECONOMY_STORY_KINDS,
  parseEconomyParams,
  selectEconomyStories,
  type EconomyParamIssue,
  type EconomySearchParams,
  type EconomyStoryKind,
} from "@/lib/content/economy-feed";

const issueCopy: Record<EconomyParamIssue, { ne: string; en: string }> = {
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

const kindLabels: Record<EconomyStoryKind, { ne: string; en: string }> = {
  news: { ne: "समाचार", en: "News" },
  analysis: { ne: "विश्लेषण", en: "Analysis" },
  opinion: { ne: "विचार", en: "Opinion" },
  explainer: { ne: "व्याख्या", en: "Explainers" },
  fact_check: { ne: "तथ्य जाँच", en: "Fact checks" },
  guide: { ne: "मार्गदर्शिका", en: "Guides" },
};

function economyHref(
  filters: { query: string; kind?: EconomyStoryKind; sort: "newest" | "oldest" },
  page?: number,
  kindOverride?: EconomyStoryKind | null,
) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  const kind = kindOverride === undefined ? filters.kind : kindOverride;
  if (kind) params.set("kind", kind);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (page) params.set("page", String(page));
  const query = params.toString();
  return query ? `/category/economy?${query}` : "/category/economy";
}

function EconomyFilterNotice({ issues }: { issues: EconomyParamIssue[] }) {
  if (issues.length === 0) return null;
  return (
    <div className="economy-filter-issues" role="alert">
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

function EconomyStoryCard({ story }: { story: ArticleCard }) {
  return (
    <article className="economy-story-card">
      {story.leadMedia ? (
        <ArticleMedia
          media={story.leadMedia}
          aspectRatio="16 / 9"
          sizes="(max-width: 640px) 94vw, (max-width: 1024px) 44vw, 520px"
        />
      ) : (
        <MediaSlot aspectRatio="16 / 9" />
      )}
      <div className="economy-story-card__copy">
        <div className="economy-story-card__meta">
          <Link href={`/category/${story.category.slug}`} className="story-category">
            <LocalizedText ne={story.category.name} />
          </Link>
          <PublishedTime value={story.updatedAt ?? story.publishedAt} />
        </div>
        <h3 className="economy-story-card__headline">
          <Link href={story.href}>
            <LocalizedText ne={story.headline} />
          </Link>
        </h3>
        {story.summary ? (
          <p className="economy-story-card__summary">
            <LocalizedText ne={story.summary} />
          </p>
        ) : null}
        <div className="economy-story-card__footer">
          <AuthorByline authors={story.authors} />
          <span>
            <LocalizedText ne="काल्पनिक नमुना" en="Fictional sample" />
          </span>
        </div>
      </div>
    </article>
  );
}

function EconomyLead({ story }: { story: ArticleCard }) {
  return (
    <article className="economy-lead" aria-labelledby={`economy-lead-${story.id}`}>
      {story.leadMedia ? (
        <ArticleMedia
          media={story.leadMedia}
          aspectRatio="16 / 9"
          sizes="(max-width: 900px) 94vw, 60vw"
        />
      ) : (
        <MediaSlot aspectRatio="16 / 9" />
      )}
      <div className="economy-lead__copy">
        <div className="economy-story-card__meta">
          <Link href="/category/economy" className="story-category">
            <LocalizedText ne="अर्थतन्त्र" />
          </Link>
          <PublishedTime value={story.updatedAt ?? story.publishedAt} />
          <span className="economy-sample-label">
            <LocalizedText ne="प्रमुख नमुना समाचार" en="Featured sample story" />
          </span>
        </div>
        <h2 id={`economy-lead-${story.id}`} className="editorial-heading economy-lead__headline">
          <Link href={story.href}>
            <LocalizedText ne={story.headline} />
          </Link>
        </h2>
        {story.summary ? (
          <p className="economy-lead__summary">
            <LocalizedText ne={story.summary} />
          </p>
        ) : null}
        <div className="economy-lead__footer">
          <AuthorByline authors={story.authors} />
          <Link className="economy-lead__read-more" href={story.href}>
            <LocalizedText ne="समाचार पढ्नुहोस्" en="Read story" /> <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function EconomyBriefing({ stories }: { stories: ArticleCard[] }) {
  return (
    <aside className="economy-briefing" aria-labelledby="economy-briefing-title">
      <div className="economy-panel-heading">
        <p className="eyebrow">
          <LocalizedText ne="फिड पूर्वावलोकन · काल्पनिक" en="Feed preview · fictional" />
        </p>
        <h2 id="economy-briefing-title" className="editorial-heading">
          <LocalizedText ne="अर्थतन्त्रका मुख्य शीर्षक" en="Economy briefing" />
        </h2>
      </div>
      {stories.length ? (
        <ol>
          {stories.map((story, index) => (
            <li key={story.id}>
              <span className="economy-briefing__number" aria-hidden="true">
                <LocalizedNumber value={index + 1} />
              </span>
              <div>
                <p className="economy-briefing__time">
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
        <p className="economy-briefing__empty">
          <LocalizedText
            ne="थप नमुना समाचार उपलब्ध छैन।"
            en="No additional sample stories are available."
          />
        </p>
      )}
      <p className="economy-briefing__note">
        <LocalizedText
          ne="यी शीर्षक काल्पनिक नमुना हुन्; प्रत्यक्ष समाचार वा बजार अपडेट होइनन्।"
          en="These headlines are fictional samples, not live news or market updates."
        />
      </p>
    </aside>
  );
}

function MarketSnapshot() {
  const indicators = [
    {
      ne: "नेप्से सूचक",
      en: "NEPSE index",
      noteNe: "आधिकारिक फिड जडान छैन",
      noteEn: "No approved feed connected",
    },
    {
      ne: "विदेशी मुद्रा",
      en: "Foreign exchange",
      noteNe: "स्रोत उपलब्ध छैन",
      noteEn: "Source unavailable",
    },
    { ne: "सुन र चाँदी", en: "Gold and silver", noteNe: "लाइभ मूल्य छैन", noteEn: "No live prices" },
    {
      ne: "मूल्य सूचक",
      en: "Price indicators",
      noteNe: "अपडेट उपलब्ध छैन",
      noteEn: "No update available",
    },
  ];
  return (
    <section className="economy-market" id="economy-market" aria-labelledby="economy-market-title">
      <div className="economy-section-heading">
        <div>
          <p className="eyebrow">
            <LocalizedText ne="बजार र अर्थतन्त्र" en="Markets and economy" />
          </p>
          <h2 id="economy-market-title" className="editorial-heading">
            <LocalizedText ne="बजार संकेतक" en="Market snapshot" />
          </h2>
        </div>
        <span className="economy-section-heading__status">
          <LocalizedText ne="लाइभ डाटा छैन" en="Live data unavailable" />
        </span>
      </div>
      <ul className="economy-market__grid">
        {indicators.map((indicator) => (
          <li key={indicator.en}>
            <h3>
              <LocalizedText ne={indicator.ne} en={indicator.en} />
            </h3>
            <strong>—</strong>
            <p>
              <LocalizedText ne={indicator.noteNe} en={indicator.noteEn} />
            </p>
          </li>
        ))}
      </ul>
      <p className="economy-market__disclosure" role="note">
        <LocalizedText
          ne="बजार, विनिमय दर र मूल्यका लागि स्वीकृत स्रोत जडान गरिएको छैन। ड्यासबोर्ड लेआउट मात्र हो; यो लगानी सल्लाह होइन।"
          en="No approved source is connected for markets, exchange rates, or prices. This is a dashboard layout only, not investment advice."
        />
      </p>
    </section>
  );
}

function EconomyContext({ entries }: { entries: HubEntry[] }) {
  return (
    <section className="economy-context" aria-labelledby="economy-context-title">
      <div className="economy-panel-heading">
        <p className="eyebrow">
          <LocalizedText ne="जानकारी केन्द्र" en="Information hub" />
        </p>
        <h2 id="economy-context-title" className="editorial-heading">
          <LocalizedText ne="अर्थतन्त्र बुझ्नुहोस्" en="Understand the economy" />
        </h2>
      </div>
      {entries.length ? (
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
      ) : (
        <p className="economy-context__empty">
          <LocalizedText
            ne="व्याख्या र मार्गदर्शिका तयार भएपछि यहाँ देखिनेछन्।"
            en="Explainers and guides will appear here when available."
          />
        </p>
      )}
      <Link className="economy-context__link" href="/information-hub">
        <LocalizedText ne="सबै व्याख्या र मार्गदर्शिका" en="All explainers and guides" /> →
      </Link>
    </section>
  );
}

export function EconomyCategoryPage({
  categoryPage,
  categories,
  hubEntries,
  searchParams,
}: {
  categoryPage: CategoryPageData;
  categories: CategorySummary[];
  hubEntries: HubEntry[];
  searchParams: EconomySearchParams;
}) {
  const { filters, issues } = parseEconomyParams(searchParams);
  const stories = categoryPage.articles;
  const featured = [...stories].sort(
    (left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt),
  )[0];
  const result = issues.includes("query_too_long")
    ? { stories: [], pageInfo: { page: 1, pageSize: 6, totalItems: 0, totalPages: 0 } }
    : selectEconomyStories(stories, filters);
  const hasFilters = Boolean(
    filters.query || filters.kind || filters.sort === "oldest" || filters.page > 1,
  );
  const briefingStories = stories
    .filter((story) => story.id !== featured?.id)
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt))
    .slice(0, 3);
  const selectedStories = [...stories]
    .filter((story) => story.id !== featured?.id)
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt))
    .slice(0, 5);
  const economyHubEntries = hubEntries.filter((entry) =>
    entry.related.some((story) => story.category.slug === "economy"),
  );

  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell economy-page py-7 sm:py-10">
        <Breadcrumbs
          items={[{ label: "गृहपृष्ठ", href: "/" }, { label: categoryPage.category.name }]}
        />

        <header className="economy-page__header">
          <div className="economy-page__masthead">
            <p className="eyebrow">
              <LocalizedText
                ne="नेपालको अर्थतन्त्र · समाचार र सन्दर्भ"
                en="Nepal's economy · News and context"
              />
            </p>
            <p className="economy-page__edition">
              <LocalizedText ne="सम्पादकीय फिड · नमुना संस्करण" en="Editorial feed · preview edition" />
            </p>
          </div>
          <h1 className="editorial-heading economy-page__title">
            <LocalizedText ne="अर्थतन्त्र" en="Economy" />
          </h1>
          <p className="economy-page__intro">
            <LocalizedText
              ne="व्यवसाय, बजेट, बजार, रोजगारी र घरपरिवारको आर्थिक जीवनबारे समाचार र व्याख्या। यहाँ देखिएका सबै सामग्री डिजाइन पूर्वावलोकनका लागि बनाइएका काल्पनिक नमुना हुन्।"
              en="News and explainers about business, budgets, markets, jobs, and household economics. All content shown here is fictional sample material for the design preview."
            />
          </p>
          <nav className="economy-section-nav" aria-labelledby="economy-section-nav-label">
            <span className="sr-only" id="economy-section-nav-label">
              <LocalizedText ne="अर्थतन्त्र पृष्ठका खण्डहरू" en="Economy page sections" />
            </span>
            <a href="#economy-market">
              <LocalizedText ne="बजार संकेतक" en="Market snapshot" />
            </a>
            <a href="#economy-stories">
              <LocalizedText ne="ताजा समाचार" en="Latest stories" />
            </a>
            <a href="#economy-reading">
              <LocalizedText ne="पढ्नका लागि" en="Selected reading" />
            </a>
            <a href="#economy-context">
              <LocalizedText ne="अर्थतन्त्र बुझ्नुहोस्" en="Understand the economy" />
            </a>
          </nav>
          <nav className="economy-category-nav" aria-labelledby="economy-other-sections-title">
            <span id="economy-other-sections-title">
              <LocalizedText ne="अन्य खण्ड" en="Other sections" />
            </span>
            <ul>
              {categories
                .filter((category) => category.slug !== "economy")
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

        <MarketSnapshot />

        <form action="/category/economy" method="get">
          <search
            className="economy-filters reader-feed-filters"
            aria-labelledby="economy-filter-title"
          >
            <span id="economy-filter-title" className="sr-only">
              <LocalizedText
                ne="अर्थतन्त्रका समाचार खोज र फिल्टर"
                en="Search and filter economy stories"
              />
            </span>
            <div className="economy-filters__search reader-feed-filters__search">
              <LocalizedSearchInput
                defaultValue={filters.query}
                accessibleLabel={{ ne: "अर्थतन्त्रका समाचार खोज्नुहोस्", en: "Search economy stories" }}
              />
              <button className="button-primary" type="submit">
                <LocalizedText ne="खोज्नुहोस्" en="Search" />
              </button>
            </div>
            <div className="economy-filters__controls">
              <label>
                <span>
                  <LocalizedText ne="सामग्री प्रकार" en="Story type" />
                </span>
                <select className="field" name="kind" defaultValue={filters.kind ?? ""}>
                  <option value="">
                    <LocalizedText ne="सबै प्रकार" en="All types" />
                  </option>
                  {ECONOMY_STORY_KINDS.map((kind) => (
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
              <button className="button-primary economy-filters__apply" type="submit">
                <LocalizedText ne="फिल्टर लागू गर्नुहोस्" en="Apply filters" />
              </button>
              {hasFilters ? (
                <Link className="economy-filters__clear" href="/category/economy">
                  <LocalizedText ne="फिल्टर हटाउनुहोस्" en="Clear filters" />
                </Link>
              ) : null}
            </div>
          </search>
        </form>
        <EconomyFilterNotice issues={issues} />

        {!hasFilters && featured ? (
          <div className="economy-top-stories">
            <section aria-labelledby="economy-featured-title">
              <div className="economy-section-heading">
                <div>
                  <p className="eyebrow">
                    <LocalizedText
                      ne="सम्पादकीय प्राथमिकता · काल्पनिक"
                      en="Editorial lead · fictional"
                    />
                  </p>
                  <h2 id="economy-featured-title" className="editorial-heading">
                    <LocalizedText ne="अर्थतन्त्रको मुख्य समाचार" en="Economy lead story" />
                  </h2>
                </div>
                <span className="economy-section-heading__status">
                  <LocalizedText ne="नमुना" en="Sample" />
                </span>
              </div>
              <EconomyLead story={featured} />
            </section>
            <EconomyBriefing stories={briefingStories} />
          </div>
        ) : null}

        <div className="economy-main-grid">
          <section
            className="economy-feed"
            id="economy-stories"
            aria-labelledby="economy-feed-title"
          >
            <div className="economy-section-heading economy-section-heading--feed">
              <div>
                <p className="eyebrow">
                  {filters.kind ? (
                    <LocalizedText {...kindLabels[filters.kind]} />
                  ) : (
                    <LocalizedText ne="सबै सामग्री" en="All coverage" />
                  )}
                </p>
                <h2 id="economy-feed-title" className="editorial-heading">
                  {filters.query ? (
                    <>
                      <LocalizedText ne="खोज नतिजा" en="Search results" />: “{filters.query}”
                    </>
                  ) : (
                    <LocalizedText ne="अर्थतन्त्रका ताजा समाचार" en="Latest economy stories" />
                  )}
                </h2>
              </div>
              <p className="economy-section-heading__count">
                <LocalizedNumber value={result.pageInfo.totalItems} />{" "}
                <LocalizedText ne="सामग्री" en="stories" />
              </p>
            </div>
            {result.stories.length ? (
              <>
                <ul className="economy-story-grid">
                  {result.stories
                    .filter(
                      (story) =>
                        hasFilters || result.pageInfo.page !== 1 || story.id !== featured?.id,
                    )
                    .map((story) => (
                      <li key={story.id}>
                        <EconomyStoryCard story={story} />
                      </li>
                    ))}
                </ul>
                <PageNavigation
                  pageInfo={result.pageInfo}
                  label="अर्थतन्त्र समाचार"
                  labelEn="Economy stories"
                  previousHref={
                    result.pageInfo.page > 1
                      ? economyHref(filters, result.pageInfo.page - 1)
                      : undefined
                  }
                  nextHref={
                    result.pageInfo.page < result.pageInfo.totalPages
                      ? economyHref(filters, result.pageInfo.page + 1)
                      : undefined
                  }
                />
              </>
            ) : (
              <div className="economy-feed__empty">
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
                <Link className="button-secondary mt-4" href="/category/economy">
                  <LocalizedText ne="सबै अर्थतन्त्र समाचार हेर्नुहोस्" en="View all economy stories" />
                </Link>
              </div>
            )}
          </section>

          <aside className="economy-sidebar">
            <section
              className="economy-picks"
              id="economy-reading"
              aria-labelledby="economy-picks-title"
            >
              <div className="economy-panel-heading">
                <p className="eyebrow">
                  <LocalizedText ne="सम्पादकीय चयन · नमुना" en="Editorial selection · sample" />
                </p>
                <h2 id="economy-picks-title" className="editorial-heading">
                  <LocalizedText ne="पढ्नका लागि" en="Selected reading" />
                </h2>
              </div>
              <ol>
                {selectedStories.map((story, index) => (
                  <li key={story.id}>
                    <span className="economy-picks__number" aria-hidden="true">
                      <LocalizedNumber value={index + 1} />
                    </span>
                    <div>
                      <p className="economy-picks__kind">
                        <LocalizedText {...kindLabels[story.kind]} />
                      </p>
                      <Link href={story.href}>
                        <LocalizedText ne={story.headline} />
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="economy-picks__disclosure">
                <LocalizedText
                  ne="यो सूची डिजाइन नमुना हो; लोकप्रियता मापन वा वास्तविक सम्पादकीय चयन होइन।"
                  en="This is a design sample, not a popularity ranking or a real editorial selection."
                />
              </p>
            </section>
            <div id="economy-context">
              <EconomyContext entries={economyHubEntries} />
            </div>
            <section className="economy-standards">
              <p className="eyebrow">
                <LocalizedText ne="आर्थिक समाचारका मापदण्ड" en="Standards for economic coverage" />
              </p>
              <h2 className="editorial-heading">
                <LocalizedText ne="स्रोत, मिति र स्पष्टता" en="Sources, dates, and clarity" />
              </h2>
              <p>
                <LocalizedText
                  ne="आर्थिक समाचारमा स्रोत, इकाइ, समयावधि र तथ्य तथा टिप्पणीबीचको भिन्नता स्पष्ट हुनुपर्छ। यो पृष्ठमा भने काल्पनिक नमुना मात्र छन्।"
                  en="Economic reporting should make sources, units, time periods, and the distinction between fact and comment clear. This page contains fictional samples only."
                />
              </p>
              <Link href="/editorial-standards">
                <LocalizedText ne="सम्पादकीय मापदण्ड पढ्नुहोस्" en="Read editorial standards" /> →
              </Link>
            </section>
          </aside>
        </div>
        <p className="economy-page__footer-note" role="note">
          <LocalizedText
            ne="यस पृष्ठका सबै समाचार र व्याख्या काल्पनिक डिजाइन नमुना हुन्; कुनै वास्तविक बजार अवस्था, मूल्य, नीति वा व्यवसायबारे रिपोर्ट होइनन्। प्रत्यक्ष आर्थिक डाटा जोडिएको छैन।"
            en="All stories and explainers on this page are fictional design samples, not reporting on real market conditions, prices, policies, or businesses. No live economic data is connected."
          />
        </p>
      </main>
    </>
  );
}
