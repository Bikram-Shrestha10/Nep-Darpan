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
  parseSocietyParams,
  selectSocietyStories,
  SOCIETY_STORY_KINDS,
  type SocietyParamIssue,
  type SocietySearchParams,
  type SocietyStoryKind,
} from "@/lib/content/society-feed";

const issueCopy: Record<SocietyParamIssue, { ne: string; en: string }> = {
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

const kindLabels: Record<SocietyStoryKind, { ne: string; en: string }> = {
  news: { ne: "समाचार", en: "News" },
  analysis: { ne: "विश्लेषण", en: "Analysis" },
  opinion: { ne: "विचार", en: "Opinion" },
  explainer: { ne: "व्याख्या", en: "Explainers" },
  fact_check: { ne: "तथ्य जाँच", en: "Fact checks" },
  guide: { ne: "मार्गदर्शिका", en: "Guides" },
};

const societyTopics = [
  {
    query: "education",
    ne: "शिक्षा",
    en: "Education",
    descriptionNe: "विद्यालय, सिकाइ र समुदायबीचको पहुँच।",
    descriptionEn: "Schools, learning, and community access.",
  },
  {
    query: "health",
    ne: "स्वास्थ्य पहुँच",
    en: "Health access",
    descriptionNe: "स्वास्थ्य सेवा सूचना र पहुँच; चिकित्सकीय सल्लाह होइन।",
    descriptionEn: "Health-service information and access; no medical advice.",
  },
  {
    query: "accessible",
    ne: "समावेशिता",
    en: "Inclusion",
    descriptionNe: "पहुँचयोग्य सूचना, प्रतिनिधित्व र सहभागिता।",
    descriptionEn: "Accessible information, representation, and participation.",
  },
  {
    query: "community",
    ne: "समुदाय जीवन",
    en: "Community life",
    descriptionNe: "स्थानीय गतिविधि र साझा सार्वजनिक ठाउँ।",
    descriptionEn: "Local activities and shared public spaces.",
  },
];

function societyHref(
  filters: { query: string; kind?: SocietyStoryKind; sort: "newest" | "oldest" },
  page?: number,
  kindOverride?: SocietyStoryKind | null,
) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  const kind = kindOverride === undefined ? filters.kind : kindOverride;
  if (kind) params.set("kind", kind);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (page) params.set("page", String(page));
  const query = params.toString();
  return query ? `/category/society?${query}` : "/category/society";
}

function SocietyFilterNotice({ issues }: { issues: SocietyParamIssue[] }) {
  if (issues.length === 0) return null;
  return (
    <div className="society-filter-issues" role="alert">
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

function SocietyStoryCard({ story }: { story: ArticleCard }) {
  return (
    <article className="society-story-card">
      {story.leadMedia ? (
        <ArticleMedia
          media={story.leadMedia}
          aspectRatio="16 / 9"
          sizes="(max-width: 640px) 94vw, (max-width: 1024px) 44vw, 520px"
        />
      ) : (
        <MediaSlot aspectRatio="16 / 9" />
      )}
      <div className="society-story-card__copy">
        <div className="society-story-card__meta">
          <Link href="/category/society" className="story-category">
            <LocalizedText ne="समाज" />
          </Link>
          <PublishedTime value={story.updatedAt ?? story.publishedAt} />
        </div>
        <h3 className="society-story-card__headline">
          <Link href={story.href}>
            <LocalizedText ne={story.headline} />
          </Link>
        </h3>
        {story.summary ? (
          <p className="society-story-card__summary">
            <LocalizedText ne={story.summary} />
          </p>
        ) : null}
        <div className="society-story-card__footer">
          <AuthorByline authors={story.authors} />
          <span>
            <LocalizedText ne="काल्पनिक नमुना" en="Fictional sample" />
          </span>
        </div>
      </div>
    </article>
  );
}

function SocietyLead({ story }: { story: ArticleCard }) {
  return (
    <article className="society-lead" aria-labelledby={`society-lead-${story.id}`}>
      {story.leadMedia ? (
        <ArticleMedia
          media={story.leadMedia}
          aspectRatio="16 / 9"
          sizes="(max-width: 900px) 94vw, 60vw"
        />
      ) : (
        <MediaSlot aspectRatio="16 / 9" />
      )}
      <div className="society-lead__copy">
        <div className="society-story-card__meta">
          <Link href="/category/society" className="story-category">
            <LocalizedText ne="समाज" />
          </Link>
          <PublishedTime value={story.updatedAt ?? story.publishedAt} />
          <span className="society-sample-label">
            <LocalizedText ne="मुख्य सामाजिक समाचार · नमुना" en="Society lead · sample" />
          </span>
        </div>
        <h2 id={`society-lead-${story.id}`} className="editorial-heading society-lead__headline">
          <Link href={story.href}>
            <LocalizedText ne={story.headline} />
          </Link>
        </h2>
        {story.summary ? (
          <p className="society-lead__summary">
            <LocalizedText ne={story.summary} />
          </p>
        ) : null}
        <div className="society-lead__footer">
          <AuthorByline authors={story.authors} />
          <Link className="society-lead__read-more" href={story.href}>
            <LocalizedText ne="समाचार पढ्नुहोस्" en="Read story" /> <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function SocietyBriefing({ stories }: { stories: ArticleCard[] }) {
  return (
    <aside className="society-briefing" aria-labelledby="society-briefing-title">
      <div className="society-panel-heading">
        <p className="eyebrow">
          <LocalizedText ne="फिड पूर्वावलोकन · काल्पनिक" en="Feed preview · fictional" />
        </p>
        <h2 id="society-briefing-title" className="editorial-heading">
          <LocalizedText ne="समाजका मुख्य शीर्षक" en="Society briefing" />
        </h2>
      </div>
      {stories.length ? (
        <ol>
          {stories.map((story, index) => (
            <li key={story.id}>
              <span className="society-briefing__number" aria-hidden="true">
                <LocalizedNumber value={index + 1} />
              </span>
              <div>
                <p className="society-briefing__time">
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
        <p className="society-briefing__empty">
          <LocalizedText
            ne="थप नमुना समाचार उपलब्ध छैन।"
            en="No additional sample stories are available."
          />
        </p>
      )}
      <p className="society-briefing__note">
        <LocalizedText
          ne="यी शीर्षक काल्पनिक नमुना हुन्; प्रत्यक्ष समाचार अपडेट होइनन्।"
          en="These headlines are fictional samples, not live news updates."
        />
      </p>
    </aside>
  );
}

function SocietyTopics({ filters }: { filters: { query: string; sort: "newest" | "oldest" } }) {
  return (
    <section className="society-topics" id="society-topics" aria-labelledby="society-topics-title">
      <div className="society-section-heading">
        <div>
          <p className="eyebrow">
            <LocalizedText ne="समाजका विषयहरू" en="Society coverage" />
          </p>
          <h2 id="society-topics-title" className="editorial-heading">
            <LocalizedText ne="समुदाय जीवनका विविध पाटा" en="Everyday life, in context" />
          </h2>
        </div>
        <span className="society-section-heading__status">
          <LocalizedText ne="काल्पनिक विषयगत नमुना" en="Fictional topic previews" />
        </span>
      </div>
      <ul className="society-topics__grid">
        {societyTopics.map((topic) => (
          <li key={topic.query}>
            <Link
              href={societyHref({ query: topic.query, sort: filters.sort }, undefined, null)}
              aria-current={filters.query === topic.query ? "page" : undefined}
            >
              <span className="society-topics__title">
                <LocalizedText ne={topic.ne} en={topic.en} />
                <span aria-hidden="true">↗</span>
              </span>
              <span className="society-topics__description">
                <LocalizedText ne={topic.descriptionNe} en={topic.descriptionEn} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SocietyContext({ entries }: { entries: HubEntry[] }) {
  return (
    <section className="society-context" aria-labelledby="society-context-title">
      <div className="society-panel-heading">
        <p className="eyebrow">
          <LocalizedText ne="जानकारी केन्द्र" en="Information hub" />
        </p>
        <h2 id="society-context-title" className="editorial-heading">
          <LocalizedText ne="समाज बुझ्ने सन्दर्भ" en="Context for social issues" />
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
        <p className="society-context__empty">
          <LocalizedText
            ne="व्याख्या र मार्गदर्शिका तयार भएपछि यहाँ देखिनेछन्।"
            en="Explainers and guides will appear here when available."
          />
        </p>
      )}
      <Link className="society-context__link" href="/information-hub">
        <LocalizedText ne="सबै व्याख्या र मार्गदर्शिका" en="All explainers and guides" /> →
      </Link>
    </section>
  );
}

export function SocietyCategoryPage({
  categoryPage,
  categories,
  hubEntries,
  searchParams,
}: {
  categoryPage: CategoryPageData;
  categories: CategorySummary[];
  hubEntries: HubEntry[];
  searchParams: SocietySearchParams;
}) {
  const { filters, issues } = parseSocietyParams(searchParams);
  const stories = categoryPage.articles;
  const featured = [...stories].sort(
    (left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt),
  )[0];
  const result = issues.includes("query_too_long")
    ? { stories: [], pageInfo: { page: 1, pageSize: 6, totalItems: 0, totalPages: 0 } }
    : selectSocietyStories(stories, filters);
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
  const societyHubEntries = hubEntries.filter((entry) =>
    entry.related.some((story) => story.category.slug === "society"),
  );

  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell society-page py-7 sm:py-10">
        <Breadcrumbs
          items={[{ label: "गृहपृष्ठ", href: "/" }, { label: categoryPage.category.name }]}
        />

        <header className="society-page__header">
          <div className="society-page__masthead">
            <p className="eyebrow">
              <LocalizedText
                ne="समाज जीवन · समुदाय, शिक्षा र स्वास्थ्य"
                en="Society · Community, education, and health"
              />
            </p>
            <p className="society-page__edition">
              <LocalizedText ne="सम्पादकीय फिड · नमुना संस्करण" en="Editorial feed · preview edition" />
            </p>
          </div>
          <h1 className="editorial-heading society-page__title">
            <LocalizedText ne="समाज" en="Society" />
          </h1>
          <p className="society-page__intro">
            <LocalizedText
              ne="शिक्षा, स्वास्थ्य पहुँच, समुदाय, समावेशिता र दैनिक जीवनका विषयलाई सन्दर्भसहित बुझाउने समाचार, विश्लेषण र मार्गदर्शिका। यहाँका सबै सामग्री डिजाइन पूर्वावलोकनका काल्पनिक नमुना हुन्।"
              en="Contextual news, analysis, and guides about education, health access, community, inclusion, and everyday life. All content here is fictional sample material for the design preview."
            />
          </p>
          <nav className="society-section-nav" aria-labelledby="society-section-nav-label">
            <span className="sr-only" id="society-section-nav-label">
              <LocalizedText ne="समाज पृष्ठका खण्डहरू" en="Society page sections" />
            </span>
            <a href="#society-top-stories">
              <LocalizedText ne="मुख्य समाचार" en="Top stories" />
            </a>
            <a href="#society-topics">
              <LocalizedText ne="विषयहरू" en="Topics" />
            </a>
            <a href="#society-stories">
              <LocalizedText ne="ताजा समाचार" en="Latest stories" />
            </a>
            <a href="#society-context">
              <LocalizedText ne="सन्दर्भ" en="Context" />
            </a>
          </nav>
          <nav className="society-category-nav" aria-labelledby="society-other-sections-title">
            <span id="society-other-sections-title">
              <LocalizedText ne="अन्य खण्ड" en="Other sections" />
            </span>
            <ul>
              {categories
                .filter((category) => category.slug !== "society")
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

        <form action="/category/society" method="get">
          <search
            className="society-filters reader-feed-filters"
            aria-labelledby="society-filter-title"
          >
            <span id="society-filter-title" className="sr-only">
              <LocalizedText ne="समाज समाचार खोज र फिल्टर" en="Search and filter society stories" />
            </span>
            <div className="society-filters__search reader-feed-filters__search">
              <LocalizedSearchInput
                defaultValue={filters.query}
                accessibleLabel={{ ne: "समाजका समाचार खोज्नुहोस्", en: "Search society stories" }}
              />
              <button className="button-primary" type="submit">
                <LocalizedText ne="खोज्नुहोस्" en="Search" />
              </button>
            </div>
            <div className="society-filters__controls">
              <label>
                <span>
                  <LocalizedText ne="सामग्री प्रकार" en="Story type" />
                </span>
                <select className="field" name="kind" defaultValue={filters.kind ?? ""}>
                  <option value="">
                    <LocalizedText ne="सबै प्रकार" en="All types" />
                  </option>
                  {SOCIETY_STORY_KINDS.map((kind) => (
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
              <button className="button-primary society-filters__apply" type="submit">
                <LocalizedText ne="फिल्टर लागू गर्नुहोस्" en="Apply filters" />
              </button>
              {hasFilters ? (
                <Link className="society-filters__clear" href="/category/society">
                  <LocalizedText ne="फिल्टर हटाउनुहोस्" en="Clear filters" />
                </Link>
              ) : null}
            </div>
          </search>
        </form>
        <SocietyFilterNotice issues={issues} />

        <div id="society-top-stories">
          {!hasFilters && featured ? (
            <div className="society-top-stories">
              <section aria-labelledby="society-featured-title">
                <div className="society-section-heading">
                  <div>
                    <p className="eyebrow">
                      <LocalizedText
                        ne="सम्पादकीय प्राथमिकता · काल्पनिक"
                        en="Editorial lead · fictional"
                      />
                    </p>
                    <h2 id="society-featured-title" className="editorial-heading">
                      <LocalizedText ne="समाजको मुख्य समाचार" en="Society lead story" />
                    </h2>
                  </div>
                  <span className="society-section-heading__status">
                    <LocalizedText ne="नमुना" en="Sample" />
                  </span>
                </div>
                <SocietyLead story={featured} />
              </section>
              <SocietyBriefing stories={briefingStories} />
            </div>
          ) : null}
        </div>

        {!hasFilters ? <SocietyTopics filters={filters} /> : null}

        <div className="society-main-grid">
          <section
            className="society-feed"
            id="society-stories"
            aria-labelledby="society-feed-title"
          >
            <div className="society-section-heading society-section-heading--feed">
              <div>
                <p className="eyebrow">
                  {filters.kind ? (
                    <LocalizedText {...kindLabels[filters.kind]} />
                  ) : (
                    <LocalizedText ne="समाजका सबै विषय" en="All society coverage" />
                  )}
                </p>
                <h2 id="society-feed-title" className="editorial-heading">
                  {filters.query ? (
                    <>
                      <LocalizedText ne="खोज नतिजा" en="Search results" />: “{filters.query}”
                    </>
                  ) : (
                    <LocalizedText ne="समाजका ताजा समाचार" en="Latest society stories" />
                  )}
                </h2>
              </div>
              <p className="society-section-heading__count">
                <LocalizedNumber value={result.pageInfo.totalItems} />{" "}
                <LocalizedText ne="सामग्री" en="stories" />
              </p>
            </div>
            {result.stories.length ? (
              <>
                <ul className="society-story-grid">
                  {result.stories
                    .filter(
                      (story) =>
                        hasFilters || result.pageInfo.page !== 1 || story.id !== featured?.id,
                    )
                    .map((story) => (
                      <li key={story.id}>
                        <SocietyStoryCard story={story} />
                      </li>
                    ))}
                </ul>
                <PageNavigation
                  pageInfo={result.pageInfo}
                  label="समाज समाचार"
                  labelEn="Society stories"
                  previousHref={
                    result.pageInfo.page > 1
                      ? societyHref(filters, result.pageInfo.page - 1)
                      : undefined
                  }
                  nextHref={
                    result.pageInfo.page < result.pageInfo.totalPages
                      ? societyHref(filters, result.pageInfo.page + 1)
                      : undefined
                  }
                />
              </>
            ) : (
              <div className="society-feed__empty">
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
                <Link className="button-secondary mt-4" href="/category/society">
                  <LocalizedText ne="सबै समाज समाचार हेर्नुहोस्" en="View all society stories" />
                </Link>
              </div>
            )}
          </section>

          <aside className="society-sidebar">
            <section className="society-picks" aria-labelledby="society-picks-title">
              <div className="society-panel-heading">
                <p className="eyebrow">
                  <LocalizedText ne="सम्पादकीय चयन · नमुना" en="Editorial selection · sample" />
                </p>
                <h2 id="society-picks-title" className="editorial-heading">
                  <LocalizedText ne="पढ्नका लागि" en="Selected reading" />
                </h2>
              </div>
              <ol>
                {selectedStories.map((story, index) => (
                  <li key={story.id}>
                    <span className="society-picks__number" aria-hidden="true">
                      <LocalizedNumber value={index + 1} />
                    </span>
                    <div>
                      <p className="society-picks__kind">
                        <LocalizedText {...kindLabels[story.kind]} />
                      </p>
                      <Link href={story.href}>
                        <LocalizedText ne={story.headline} />
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="society-picks__disclosure">
                <LocalizedText
                  ne="यो सूची डिजाइन नमुना हो; लोकप्रियता मापन वा वास्तविक सम्पादकीय चयन होइन।"
                  en="This is a design sample, not a popularity ranking or a real editorial selection."
                />
              </p>
            </section>
            <div id="society-context">
              <SocietyContext entries={societyHubEntries} />
            </div>
            <section className="society-standards">
              <p className="eyebrow">
                <LocalizedText
                  ne="सामाजिक विषयको जिम्मेवार रिपोर्टिङ"
                  en="Responsible coverage of social issues"
                />
              </p>
              <h2 className="editorial-heading">
                <LocalizedText ne="गोपनीयता, स्रोत र सन्दर्भ" en="Privacy, sources, and context" />
              </h2>
              <p>
                <LocalizedText
                  ne="सामाजिक विषयमा व्यक्तिको आवाज, गोपनीयता, सहमति र सन्दर्भ महत्त्वपूर्ण हुन्छन्। यहाँका नमुना समाचारले कुनै वास्तविक व्यक्ति वा समुदायको अनुभव प्रस्तुत गर्दैनन्।"
                  en="People's voices, privacy, consent, and context matter in social coverage. These sample stories do not describe the experience of any real person or community."
                />
              </p>
              <Link href="/editorial-standards">
                <LocalizedText ne="सम्पादकीय मापदण्ड पढ्नुहोस्" en="Read editorial standards" /> →
              </Link>
            </section>
          </aside>
        </div>
        <p className="society-page__footer-note" role="note">
          <LocalizedText
            ne="यस पृष्ठका सबै समाज सामग्री काल्पनिक डिजाइन नमुना हुन्; कुनै वास्तविक व्यक्ति, संस्था, घटना, स्वास्थ्य सेवा वा सार्वजनिक सेवाबारे रिपोर्ट होइनन्।"
            en="All Society content on this page is fictional design material, not reporting about real people, organizations, events, health care, or public services."
          />
        </p>
      </main>
    </>
  );
}
