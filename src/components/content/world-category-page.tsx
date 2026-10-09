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
  getWorldRegion,
  parseWorldParams,
  selectWorldStories,
  WORLD_REGIONS,
  WORLD_STORY_KINDS,
  type WorldParamIssue,
  type WorldRegion,
  type WorldSearchParams,
  type WorldStoryKind,
} from "@/lib/content/world-feed";

const issueCopy: Record<WorldParamIssue, { ne: string; en: string }> = {
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
  invalid_region: {
    ne: "क्षेत्र मान्य थिएन; सबै क्षेत्रका समाचार देखाइएको छ।",
    en: "The region was invalid; showing stories from all regions.",
  },
};

const kindLabels: Record<WorldStoryKind, { ne: string; en: string }> = {
  news: { ne: "समाचार", en: "News" },
  analysis: { ne: "विश्लेषण", en: "Analysis" },
  opinion: { ne: "विचार", en: "Opinion" },
  explainer: { ne: "व्याख्या", en: "Explainers" },
  fact_check: { ne: "तथ्य जाँच", en: "Fact checks" },
  guide: { ne: "मार्गदर्शिका", en: "Guides" },
};

function regionLabel(region: WorldRegion) {
  return WORLD_REGIONS.find((item) => item.slug === region) ?? WORLD_REGIONS[0];
}

function worldHref(
  filters: {
    query: string;
    region: WorldRegion;
    kind?: WorldStoryKind;
    sort: "newest" | "oldest";
  },
  page?: number,
  overrides: { region?: WorldRegion; kind?: WorldStoryKind | null } = {},
) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  const region = overrides.region ?? filters.region;
  if (region !== "all") params.set("region", region);
  const kind = overrides.kind === undefined ? filters.kind : overrides.kind;
  if (kind) params.set("kind", kind);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (page) params.set("page", String(page));
  const query = params.toString();
  return query ? `/category/world?${query}` : "/category/world";
}

function WorldFilterNotice({ issues }: { issues: WorldParamIssue[] }) {
  if (!issues.length) return null;
  return (
    <div className="world-filter-issues" role="alert">
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

function WorldRegionNav({
  filters,
  stories,
}: {
  filters: WorldFiltersForNav;
  stories: ArticleCard[];
}) {
  return (
    <nav className="world-region-nav" aria-labelledby="world-regions-title">
      <span id="world-regions-title" className="world-region-nav__label">
        <LocalizedText ne="क्षेत्रअनुसार" en="Browse by region" />
      </span>
      <ul>
        {WORLD_REGIONS.map((region) => {
          const count =
            region.slug === "all"
              ? stories.length
              : stories.filter((story) => getWorldRegion(story) === region.slug).length;
          return (
            <li key={region.slug}>
              <Link
                href={worldHref(filters, undefined, { region: region.slug })}
                aria-current={filters.region === region.slug ? "page" : undefined}
              >
                <LocalizedText ne={region.ne} en={region.en} />
                <span className="world-region-nav__count">
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

type WorldFiltersForNav = {
  query: string;
  region: WorldRegion;
  kind?: WorldStoryKind;
  sort: "newest" | "oldest";
};

function WorldStoryCard({ story }: { story: ArticleCard }) {
  const region = regionLabel(getWorldRegion(story));
  return (
    <article className="world-story-card">
      {story.leadMedia ? (
        <ArticleMedia
          media={story.leadMedia}
          aspectRatio="16 / 9"
          sizes="(max-width: 600px) 92vw, (max-width: 1000px) 45vw, 480px"
        />
      ) : (
        <MediaSlot aspectRatio="16 / 9" />
      )}
      <div className="world-story-card__copy">
        <div className="world-story-card__meta">
          <span className="world-region-label">
            <LocalizedText ne={region.ne} en={region.en} />
          </span>
          <PublishedTime value={story.updatedAt ?? story.publishedAt} />
        </div>
        <h3 className="world-story-card__headline">
          <Link href={story.href}>
            <LocalizedText ne={story.headline} />
          </Link>
        </h3>
        {story.summary ? (
          <p className="world-story-card__summary">
            <LocalizedText ne={story.summary} />
          </p>
        ) : null}
        <div className="world-story-card__footer">
          <AuthorByline authors={story.authors} />
          <span>
            <LocalizedText ne="काल्पनिक नमुना" en="Fictional sample" />
          </span>
        </div>
      </div>
    </article>
  );
}

function WorldLead({ story }: { story: ArticleCard }) {
  const region = regionLabel(getWorldRegion(story));
  return (
    <article className="world-lead" aria-labelledby={`world-lead-${story.id}`}>
      {story.leadMedia ? (
        <ArticleMedia
          media={story.leadMedia}
          aspectRatio="16 / 9"
          sizes="(max-width: 900px) 94vw, 62vw"
        />
      ) : (
        <MediaSlot aspectRatio="16 / 9" />
      )}
      <div className="world-lead__copy">
        <div className="world-story-card__meta">
          <span className="world-region-label">
            <LocalizedText ne={region.ne} en={region.en} />
          </span>
          <PublishedTime value={story.updatedAt ?? story.publishedAt} />
          <span className="world-sample-label">
            <LocalizedText ne="मुख्य विश्व समाचार · नमुना" en="World lead · sample" />
          </span>
        </div>
        <h2 id={`world-lead-${story.id}`} className="editorial-heading world-lead__headline">
          <Link href={story.href}>
            <LocalizedText ne={story.headline} />
          </Link>
        </h2>
        {story.summary ? (
          <p className="world-lead__summary">
            <LocalizedText ne={story.summary} />
          </p>
        ) : null}
        <div className="world-lead__footer">
          <AuthorByline authors={story.authors} />
          <Link href={story.href} className="world-lead__read-more">
            <LocalizedText ne="पूरा समाचार पढ्नुहोस्" en="Read the full story" /> →
          </Link>
        </div>
      </div>
    </article>
  );
}

function WorldBriefing({ stories }: { stories: ArticleCard[] }) {
  return (
    <aside className="world-briefing" aria-labelledby="world-briefing-title">
      <div className="world-panel-heading">
        <p className="eyebrow">
          <LocalizedText ne="विश्वभरिका छोटा अपडेट · नमुना" en="Across the world · sample" />
        </p>
        <h2 id="world-briefing-title" className="editorial-heading">
          <LocalizedText ne="विश्व संक्षेप" en="World briefing" />
        </h2>
      </div>
      {stories.length ? (
        <ol>
          {stories.map((story, index) => {
            const region = regionLabel(getWorldRegion(story));
            return (
              <li key={story.id}>
                <span className="world-briefing__number" aria-hidden="true">
                  <LocalizedNumber value={index + 1} />
                </span>
                <div>
                  <p className="world-briefing__meta">
                    <LocalizedText ne={region.ne} en={region.en} />
                    <span aria-hidden="true"> · </span>
                    <PublishedTime value={story.updatedAt ?? story.publishedAt} />
                  </p>
                  <Link href={story.href}>
                    <LocalizedText ne={story.headline} />
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="world-briefing__empty">
          <LocalizedText
            ne="थप नमुना समाचार उपलब्ध छैन।"
            en="No additional sample stories are available."
          />
        </p>
      )}
      <p className="world-briefing__note">
        <LocalizedText
          ne="यो स्थिर डिजाइन नमुना हो; प्रत्यक्ष अन्तर्राष्ट्रिय समाचार फिड होइन।"
          en="This is a static design sample, not a live international news feed."
        />
      </p>
    </aside>
  );
}

function WorldPicks({ stories }: { stories: ArticleCard[] }) {
  return (
    <section className="world-picks" aria-labelledby="world-picks-title">
      <div className="world-panel-heading">
        <p className="eyebrow">
          <LocalizedText ne="सम्पादकीय चयन · नमुना" en="Editorial selection · sample" />
        </p>
        <h2 id="world-picks-title" className="editorial-heading">
          <LocalizedText ne="पढ्नका लागि" en="Selected reading" />
        </h2>
      </div>
      <ol>
        {stories.map((story, index) => {
          const region = regionLabel(getWorldRegion(story));
          return (
            <li key={story.id}>
              <span className="world-picks__number" aria-hidden="true">
                <LocalizedNumber value={index + 1} />
              </span>
              <div>
                <p className="world-picks__region">
                  <LocalizedText ne={region.ne} en={region.en} />
                </p>
                <Link href={story.href}>
                  <LocalizedText ne={story.headline} />
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="world-picks__disclosure">
        <LocalizedText
          ne="यो सूची नमुना लेआउट हो; वास्तविक लोकप्रियता वा सम्पादकीय छनोट होइन।"
          en="This is a sample layout, not a real popularity ranking or editorial selection."
        />
      </p>
    </section>
  );
}

function WorldContext({ entries }: { entries: HubEntry[] }) {
  return (
    <section className="world-context" aria-labelledby="world-context-title">
      <div className="world-panel-heading">
        <p className="eyebrow">
          <LocalizedText ne="स्रोत र पृष्ठभूमि" en="Sources and context" />
        </p>
        <h2 id="world-context-title" className="editorial-heading">
          <LocalizedText ne="विश्व समाचार बुझ्ने आधार" en="Context for world news" />
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
        <p className="world-context__empty">
          <LocalizedText
            ne="स्रोत-जाँच सामग्री तयार भएपछि यहाँ देखिनेछ।"
            en="Source-checking resources will appear here when available."
          />
        </p>
      )}
      <Link className="world-context__link" href="/information-hub">
        <LocalizedText ne="जानकारी केन्द्र हेर्नुहोस्" en="Visit the information hub" /> →
      </Link>
    </section>
  );
}

export function WorldCategoryPage({
  categoryPage,
  categories,
  hubEntries,
  searchParams,
}: {
  categoryPage: CategoryPageData;
  categories: CategorySummary[];
  hubEntries: HubEntry[];
  searchParams: WorldSearchParams;
}) {
  const { filters, issues } = parseWorldParams(searchParams);
  const stories = categoryPage.articles;
  const featured = [...stories].sort(
    (left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt),
  )[0];
  const result = issues.includes("query_too_long")
    ? { stories: [], pageInfo: { page: 1, pageSize: 6, totalItems: 0, totalPages: 0 } }
    : selectWorldStories(stories, filters);
  const hasFilters = Boolean(
    filters.query ||
      filters.region !== "all" ||
      filters.kind ||
      filters.sort === "oldest" ||
      filters.page > 1,
  );
  const briefingStories = [...stories]
    .filter((story) => story.id !== featured?.id)
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt))
    .slice(0, 4);
  const selectedStories = [...stories]
    .filter((story) => story.id !== featured?.id)
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt))
    .slice(0, 5);
  const worldHubEntries = hubEntries.filter((entry) =>
    entry.related.some((story) => story.category.slug === "world"),
  );

  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell world-page py-7 sm:py-10">
        <Breadcrumbs
          items={[{ label: "गृहपृष्ठ", href: "/" }, { label: categoryPage.category.name }]}
        />
        <header className="world-page__header">
          <div className="world-page__masthead">
            <p className="eyebrow">
              <LocalizedText
                ne="अन्तर्राष्ट्रिय समाचार · क्षेत्र र सन्दर्भ"
                en="International news · regions and context"
              />
            </p>
            <p className="world-page__edition">
              <LocalizedText ne="सम्पादकीय फिड · नमुना संस्करण" en="Editorial feed · preview edition" />
            </p>
          </div>
          <h1 className="editorial-heading world-page__title">
            <LocalizedText ne="विश्व" en="World" />
          </h1>
          <p className="world-page__intro">
            <LocalizedText
              ne="दक्षिण एसियादेखि विश्वभरका क्षेत्रसम्मका समाचार, विश्लेषण र व्याख्या। तलका क्षेत्र र सामग्री प्रकारबाट विषय छान्नुहोस्। यस पृष्ठका सबै सामग्री काल्पनिक डिजाइन नमुना हुन्, प्रत्यक्ष समाचार होइनन्।"
              en="News, analysis, and explainers across South Asia and the wider world. Browse by region or story type. All content on this page is fictional design material, not live reporting."
            />
          </p>
          <nav className="world-section-nav" aria-labelledby="world-section-nav-title">
            <span id="world-section-nav-title" className="sr-only">
              <LocalizedText ne="विश्व पृष्ठका खण्डहरू" en="World page sections" />
            </span>
            <a href="#world-top-stories">
              <LocalizedText ne="मुख्य समाचार" en="Top stories" />
            </a>
            <a href="#world-regions">
              <LocalizedText ne="क्षेत्रहरू" en="Regions" />
            </a>
            <a href="#world-stories">
              <LocalizedText ne="ताजा समाचार" en="Latest stories" />
            </a>
            <a href="#world-context">
              <LocalizedText ne="सन्दर्भ" en="Context" />
            </a>
          </nav>
          <nav className="world-category-nav" aria-labelledby="world-other-sections-title">
            <span id="world-other-sections-title">
              <LocalizedText ne="अन्य खण्ड" en="Other sections" />
            </span>
            <ul>
              {categories
                .filter((category) => category.slug !== "world")
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

        <div id="world-regions">
          <WorldRegionNav filters={filters} stories={stories} />
        </div>

        <form action="/category/world" method="get">
          <search
            className="world-filters reader-feed-filters"
            aria-labelledby="world-filter-title"
          >
            <span id="world-filter-title" className="sr-only">
              <LocalizedText ne="विश्व समाचार खोज र फिल्टर" en="Search and filter world stories" />
            </span>
            <div className="world-filters__search reader-feed-filters__search">
              <LocalizedSearchInput
                defaultValue={filters.query}
                accessibleLabel={{ ne: "विश्व समाचार खोज्नुहोस्", en: "Search world stories" }}
              />
              <button className="button-primary" type="submit">
                <LocalizedText ne="खोज्नुहोस्" en="Search" />
              </button>
            </div>
            <input
              type="hidden"
              name="region"
              value={filters.region === "all" ? "" : filters.region}
            />
            <div className="world-filters__controls">
              <label>
                <span>
                  <LocalizedText ne="सामग्री प्रकार" en="Story type" />
                </span>
                <select className="field" name="kind" defaultValue={filters.kind ?? ""}>
                  <option value="">
                    <LocalizedText ne="सबै प्रकार" en="All types" />
                  </option>
                  {WORLD_STORY_KINDS.map((kind) => (
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
              <button className="button-primary world-filters__apply" type="submit">
                <LocalizedText ne="फिल्टर लागू गर्नुहोस्" en="Apply filters" />
              </button>
              {hasFilters ? (
                <Link className="world-filters__clear" href="/category/world">
                  <LocalizedText ne="फिल्टर हटाउनुहोस्" en="Clear filters" />
                </Link>
              ) : null}
            </div>
          </search>
        </form>
        <WorldFilterNotice issues={issues} />

        <div id="world-top-stories">
          {!hasFilters && featured ? (
            <div className="world-top-stories">
              <section aria-labelledby="world-featured-title">
                <div className="world-section-heading">
                  <div>
                    <p className="eyebrow">
                      <LocalizedText
                        ne="सम्पादकीय प्राथमिकता · काल्पनिक"
                        en="Editorial lead · fictional"
                      />
                    </p>
                    <h2 id="world-featured-title" className="editorial-heading">
                      <LocalizedText ne="विश्वको मुख्य समाचार" en="World lead story" />
                    </h2>
                  </div>
                  <span className="world-section-heading__status">
                    <LocalizedText ne="नमुना" en="Sample" />
                  </span>
                </div>
                <WorldLead story={featured} />
              </section>
              <WorldBriefing stories={briefingStories} />
            </div>
          ) : null}
        </div>

        <div className="world-main-grid">
          <section className="world-feed" id="world-stories" aria-labelledby="world-feed-title">
            <div className="world-section-heading world-section-heading--feed">
              <div>
                <p className="eyebrow">
                  {filters.region !== "all" ? (
                    <LocalizedText {...regionLabel(filters.region)} />
                  ) : filters.kind ? (
                    <LocalizedText {...kindLabels[filters.kind]} />
                  ) : (
                    <LocalizedText
                      ne="सबै क्षेत्र · काल्पनिक नमुना"
                      en="All regions · fictional samples"
                    />
                  )}
                </p>
                <h2 id="world-feed-title" className="editorial-heading">
                  {filters.query ? (
                    <>
                      <LocalizedText ne="खोज नतिजा" en="Search results" />: “{filters.query}”
                    </>
                  ) : (
                    <LocalizedText ne="विश्वका ताजा समाचार" en="Latest world stories" />
                  )}
                </h2>
              </div>
              <p className="world-section-heading__count">
                <LocalizedNumber value={result.pageInfo.totalItems} />{" "}
                <LocalizedText ne="सामग्री" en="stories" />
              </p>
            </div>
            {result.stories.length ? (
              <>
                <ul className="world-story-grid">
                  {result.stories.map((story) => (
                    <li key={story.id}>
                      <WorldStoryCard story={story} />
                    </li>
                  ))}
                </ul>
                <PageNavigation
                  pageInfo={result.pageInfo}
                  label="विश्व समाचार"
                  labelEn="World stories"
                  previousHref={
                    result.pageInfo.page > 1
                      ? worldHref(filters, result.pageInfo.page - 1)
                      : undefined
                  }
                  nextHref={
                    result.pageInfo.page < result.pageInfo.totalPages
                      ? worldHref(filters, result.pageInfo.page + 1)
                      : undefined
                  }
                />
              </>
            ) : (
              <div className="world-feed__empty">
                <div className="state-panel">
                  <p className="editorial-heading text-xl font-bold">
                    <LocalizedText ne="मिल्दो सामग्री भेटिएन" en="No matching stories" />
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                    <LocalizedText
                      ne="अर्को शब्द प्रयोग गर्नुहोस् वा क्षेत्र र सामग्री प्रकारको फिल्टर हटाउनुहोस्।"
                      en="Try another search or clear the region and story-type filters."
                    />
                  </p>
                </div>
                <Link className="button-secondary mt-4" href="/category/world">
                  <LocalizedText ne="सबै विश्व समाचार हेर्नुहोस्" en="View all world stories" />
                </Link>
              </div>
            )}
          </section>

          <aside className="world-sidebar">
            <WorldPicks stories={selectedStories} />
            <div id="world-context">
              <WorldContext entries={worldHubEntries} />
            </div>
            <section className="world-standards">
              <p className="eyebrow">
                <LocalizedText
                  ne="अन्तर्राष्ट्रिय समाचारका मापदण्ड"
                  en="Standards for international coverage"
                />
              </p>
              <h2 className="editorial-heading">
                <LocalizedText ne="स्रोत, अनुवाद र सन्दर्भ" en="Sources, translation, and context" />
              </h2>
              <p>
                <LocalizedText
                  ne="विश्व समाचारमा मूल स्रोत, प्रकाशन समय, अनुवादको सन्दर्भ र संलग्न पक्ष स्पष्ट हुनुपर्छ। यहाँका शीर्षक र विवरण काल्पनिक नमुना मात्र हुन्।"
                  en="World coverage should identify original sources, publication times, translation context, and the parties involved. Headlines and summaries here are fictional samples only."
                />
              </p>
              <Link href="/editorial-standards">
                <LocalizedText ne="सम्पादकीय मापदण्ड पढ्नुहोस्" en="Read editorial standards" /> →
              </Link>
            </section>
          </aside>
        </div>
        <p className="world-page__footer-note" role="note">
          <LocalizedText
            ne="यस विश्व पृष्ठका सबै शीर्षक, समय, क्षेत्र-वर्गीकरण र विवरण काल्पनिक डिजाइन नमुना हुन्; कुनै वास्तविक व्यक्ति, देश, घटना, नीति वा द्वन्द्वबारे रिपोर्ट होइनन्।"
            en="All headlines, timestamps, regional groupings, and summaries on this World page are fictional design samples, not reporting about real people, countries, events, policies, or conflicts."
          />
        </p>
      </main>
    </>
  );
}
