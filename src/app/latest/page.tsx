import type { Metadata } from "next";
import Link from "next/link";
import { LatestStoryRow } from "@/components/content/latest-story-row";
import { StoryCard } from "@/components/content/story-card";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { LocalizedNumber, LocalizedText } from "@/components/layout/site-preferences";
import { LocalizedSearchInput } from "@/components/search/localized-search-input";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageNavigation } from "@/components/ui/page-navigation";
import { contentGateway } from "@/lib/content/gateway";
import {
  collectLatestStories,
  LATEST_PAGE_SIZE,
  parseLatestParams,
  selectLatestStories,
  type LatestParamIssue,
  type LatestSearchParamRecord,
} from "@/lib/content/latest-feed";

export const metadata: Metadata = {
  title: "ताजा समाचार",
  description: "नेप दर्पणका ताजा समाचारका काल्पनिक नमुना र सम्पादकीय फिडको पूर्वावलोकन।",
};

type Props = { searchParams: Promise<LatestSearchParamRecord> };

const issueCopy: Record<LatestParamIssue, { ne: string; en: string }> = {
  duplicate: {
    ne: "एउटै फिल्टर एकभन्दा बढी पटक आएको छ। कृपया फारमबाट फेरि छान्नुहोस्।",
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

function pageHref(
  filters: { query: string; categorySlug?: string; sort: "newest" | "oldest" },
  page: number,
) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.categorySlug) params.set("category", filters.categorySlug);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  params.set("page", String(page));
  return `/latest?${params.toString()}`;
}

function FilterIssues({ issues }: { issues: LatestParamIssue[] }) {
  if (!issues.length) return null;
  return (
    <div className="latest-page__issues" role="alert">
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

export default async function LatestPage({ searchParams }: Props) {
  const [home, rawParams] = await Promise.all([contentGateway.getHome("ne-NP"), searchParams]);
  const allStories = collectLatestStories(home.latest, home.sections);
  const categories = home.sections
    .map((section) => section.category)
    .filter(
      (category, index, all) => all.findIndex((item) => item.slug === category.slug) === index,
    );
  const parsed = parseLatestParams(
    rawParams,
    categories.map((category) => category.slug),
  );
  const { filters, issues } = parsed;
  const result = issues.includes("query_too_long")
    ? {
        stories: [],
        pageInfo: { page: 1, pageSize: LATEST_PAGE_SIZE, totalItems: 0, totalPages: 0 },
      }
    : selectLatestStories(allStories, filters);
  const categoryCounts = categories.map((category) => ({
    category,
    count: allStories.filter((story) => story.category.slug === category.slug).length,
  }));
  const hasFilters = Boolean(filters.query || filters.categorySlug || filters.sort === "oldest");
  const previousHref =
    result.pageInfo.page > 1 ? pageHref(filters, result.pageInfo.page - 1) : undefined;
  const nextHref =
    result.pageInfo.page < result.pageInfo.totalPages
      ? pageHref(filters, result.pageInfo.page + 1)
      : undefined;

  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell latest-page py-7 sm:py-10">
        <Breadcrumbs items={[{ label: "गृहपृष्ठ", href: "/" }, { label: "ताजा समाचार" }]} />

        <header className="latest-page__header">
          <div>
            <p className="eyebrow latest-page__eyebrow">
              <LocalizedText ne="नेप दर्पण · समाचार फिड" en="Nep Darpan · News feed" />
            </p>
            <h1 className="editorial-heading latest-page__title">
              <LocalizedText ne="ताजा समाचार" en="Latest news" />
            </h1>
            <p className="latest-page__intro">
              <LocalizedText
                ne="प्रकाशन समयअनुसार क्रमबद्ध समाचार र अपडेटहरू एकै ठाउँमा।"
                en="Stories and updates, organized in publication order."
              />
            </p>
          </div>
          <div className="latest-page__edition" role="note">
            <span className="latest-page__edition-mark" aria-hidden="true">
              N
            </span>
            <span>
              <strong>
                <LocalizedText ne="नमुना संस्करण" en="Preview edition" />
              </strong>
              <small>
                <LocalizedText ne="सबै समाचार काल्पनिक छन्" en="All stories are fictional" />
              </small>
            </span>
          </div>
        </header>

        <nav className="latest-topics" aria-labelledby="latest-topic-label">
          <span className="latest-topics__label" id="latest-topic-label">
            <LocalizedText ne="खण्ड" en="Sections" />
          </span>
          <ul>
            <li>
              <Link
                className={`story-category${!filters.categorySlug ? " is-active" : ""}`}
                href="/latest"
              >
                <LocalizedText ne="सबै समाचार" en="All stories" />
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  className={`story-category${filters.categorySlug === category.slug ? " is-active" : ""}`}
                  href={`/latest?category=${encodeURIComponent(category.slug)}`}
                  aria-current={filters.categorySlug === category.slug ? "page" : undefined}
                >
                  <LocalizedText ne={category.name} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <form action="/latest" method="get">
          <search
            className="latest-filters reader-feed-filters"
            aria-labelledby="latest-filter-title"
          >
            <span className="sr-only" id="latest-filter-title">
              <LocalizedText ne="समाचार खोज र फिल्टर" en="Story search and filters" />
            </span>
            <div className="latest-filters__search reader-feed-filters__search">
              <label className="sr-only" htmlFor="search-query">
                <LocalizedText ne="समाचार वा विषय खोज्नुहोस्" en="Search stories or topics" />
              </label>
              <LocalizedSearchInput defaultValue={filters.query} />
              <button className="button-primary" type="submit">
                <LocalizedText ne="खोज्नुहोस्" en="Search" />
              </button>
            </div>
            <div className="latest-filters__options">
              <label>
                <span>
                  <LocalizedText ne="खण्ड" en="Section" />
                </span>
                <select
                  className="field"
                  id="latest-category"
                  name="category"
                  defaultValue={filters.categorySlug ?? ""}
                >
                  <option value="">
                    <LocalizedText ne="सबै खण्ड" en="All sections" />
                  </option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      <LocalizedText ne={category.name} />
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>
                  <LocalizedText ne="क्रम" en="Order" />
                </span>
                <select className="field" id="latest-sort" name="sort" defaultValue={filters.sort}>
                  <option value="newest">
                    <LocalizedText ne="नयाँ पहिले" en="Newest first" />
                  </option>
                  <option value="oldest">
                    <LocalizedText ne="पुराना पहिले" en="Oldest first" />
                  </option>
                </select>
              </label>
              <button className="button-primary latest-filters__apply" type="submit">
                <LocalizedText ne="फिल्टर लागू गर्नुहोस्" en="Apply filters" />
              </button>
              {hasFilters ? (
                <Link className="latest-filters__reset" href="/latest">
                  <LocalizedText ne="फिल्टर हटाउनुहोस्" en="Clear filters" />
                </Link>
              ) : null}
            </div>
          </search>
        </form>

        <FilterIssues issues={issues} />

        <div className="latest-layout">
          <section className="latest-feed" aria-labelledby="latest-feed-title">
            <div className="latest-section-heading">
              <div>
                <p className="eyebrow">
                  {filters.categorySlug ? (
                    <LocalizedText
                      ne={
                        categories.find((category) => category.slug === filters.categorySlug)
                          ?.name ?? "समाचार"
                      }
                    />
                  ) : (
                    <LocalizedText ne="क्रमबद्ध अपडेट" en="Chronological updates" />
                  )}
                </p>
                <h2 id="latest-feed-title" className="editorial-heading">
                  {filters.query ? (
                    <>
                      <LocalizedText ne="खोज नतिजा" en="Search results" />: “{filters.query}”
                    </>
                  ) : (
                    <LocalizedText ne="सबै ताजा समाचार" en="All latest stories" />
                  )}
                </h2>
              </div>
              <p className="latest-section-heading__count">
                <LocalizedNumber value={result.pageInfo.totalItems} />{" "}
                <LocalizedText ne="समाचार" en="stories" />
              </p>
            </div>

            {result.stories.length ? (
              <>
                <ol className="latest-feed__list">
                  {result.stories.map((story, index) =>
                    index === 0 ? (
                      <li className="latest-feed__featured" key={story.id}>
                        <div className="latest-feed__featured-label">
                          <span className="latest-feed__live-dot" aria-hidden="true" />
                          <LocalizedText ne="प्रमुख नमुना समाचार" en="Featured sample story" />
                        </div>
                        <StoryCard article={story} density="standard" />
                        <p className="latest-feed__fiction-note">
                          <LocalizedText
                            ne="काल्पनिक समाचार नमुना · वास्तविक घटनाको रिपोर्ट होइन"
                            en="Fictional story sample · not a report of a real event"
                          />
                        </p>
                      </li>
                    ) : (
                      <LatestStoryRow
                        key={story.id}
                        story={story}
                        number={(result.pageInfo.page - 1) * result.pageInfo.pageSize + index + 1}
                      />
                    ),
                  )}
                </ol>
                <PageNavigation
                  pageInfo={result.pageInfo}
                  label="ताजा समाचार"
                  labelEn="Latest stories"
                  previousHref={previousHref}
                  nextHref={nextHref}
                />
              </>
            ) : (
              <div className="latest-feed__empty">
                <div className="state-panel">
                  <p className="editorial-heading text-xl font-bold">
                    <LocalizedText ne="मिल्दो समाचार भेटिएन" en="No matching stories" />
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                    <LocalizedText
                      ne="अर्को शब्द खोज्नुहोस् वा खण्ड र क्रम फिल्टर परिवर्तन गर्नुहोस्।"
                      en="Try another search or change the section and order filters."
                    />
                  </p>
                </div>
                <Link className="button-secondary mt-4" href="/latest">
                  <LocalizedText ne="सबै ताजा समाचार हेर्नुहोस्" en="View all latest stories" />
                </Link>
              </div>
            )}
          </section>

          <aside className="latest-sidebar">
            <section
              className="latest-sidebar__block latest-sidebar__editors"
              aria-labelledby="latest-editors-title"
            >
              <div className="latest-sidebar__heading">
                <p className="eyebrow">
                  <LocalizedText ne="पढ्नका लागि" en="For your reading" />
                </p>
                <h2 id="latest-editors-title" className="editorial-heading">
                  <LocalizedText ne="सम्पादकीय छनोट" en="Editor's picks" />
                </h2>
              </div>
              <ol className="latest-picks">
                {home.trending.slice(0, 5).map((story, index) => (
                  <li key={story.id}>
                    <span className="latest-picks__number" aria-hidden="true">
                      <LocalizedNumber value={index + 1} />
                    </span>
                    <div>
                      <p className="latest-picks__category">
                        <LocalizedText ne={story.category.name} />
                      </p>
                      <Link href={story.href}>
                        <LocalizedText ne={story.headline} />
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="latest-sidebar__disclosure">
                <LocalizedText
                  ne="यो पूर्वावलोकन सूची लेआउट परीक्षणका लागि हो; वास्तविक लोकप्रियता मापन होइन।"
                  en="This preview list tests the layout; it is not a measure of real popularity."
                />
              </p>
            </section>

            <section
              className="latest-sidebar__block latest-sidebar__topics"
              aria-labelledby="latest-topics-title"
            >
              <div className="latest-sidebar__heading">
                <p className="eyebrow">
                  <LocalizedText ne="विषयअनुसार" en="Browse by topic" />
                </p>
                <h2 id="latest-topics-title" className="editorial-heading">
                  <LocalizedText ne="समाचार खण्डहरू" en="News sections" />
                </h2>
              </div>
              <ul>
                {categoryCounts.map(({ category, count }) => (
                  <li key={category.slug}>
                    <Link href={`/latest?category=${encodeURIComponent(category.slug)}`}>
                      <span>
                        <LocalizedText ne={category.name} />
                      </span>
                      <span className="latest-sidebar__topic-count">
                        <LocalizedNumber value={count} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="latest-sidebar__hub">
              <p className="eyebrow">
                <LocalizedText ne="समाचारभन्दा पर" en="Beyond the headlines" />
              </p>
              <h2 className="editorial-heading">
                <LocalizedText ne="जानकारी केन्द्र" en="Information hub" />
              </h2>
              <p>
                <LocalizedText
                  ne="व्याख्या, मार्गदर्शिका र सन्दर्भ सामग्रीका काल्पनिक नमुना हेर्नुहोस्।"
                  en="Explore fictional samples of explainers, guides, and reference material."
                />
              </p>
              <Link href="/information-hub" className="latest-sidebar__hub-link">
                <LocalizedText ne="जानकारी केन्द्र हेर्नुहोस्" en="Visit the information hub" />{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}
