import type { Metadata } from "next";
import Link from "next/link";
import { StoryCard } from "@/components/content/story-card";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { ContentState } from "@/components/ui/content-state";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import type { SearchFilters, SearchPage as SearchPageResult } from "@/lib/content/contracts";
import { contentGateway } from "@/lib/content/gateway";
import {
  parseSearchParams,
  type SearchParamIssue,
  type SearchParamRecord,
} from "@/lib/content/search-params";

export const metadata: Metadata = {
  title: "समाचार खोज",
  description: "नेप दर्पणका समाचार र जानकारीका काल्पनिक नमुना खोज्नुहोस्।",
};

type Props = { searchParams: Promise<SearchParamRecord> };
const querySuggestions = ["डिजिटल", "पुस्तकालय", "व्यवसाय", "नमुना"];
const kindOptions = [
  ["news", "समाचार"],
  ["analysis", "विश्लेषण"],
  ["opinion", "विचार"],
  ["explainer", "व्याख्या"],
  ["guide", "मार्गदर्शिका"],
  ["fact_check", "तथ्य जाँच"],
] as const;
const issueCopy: Record<SearchParamIssue, string> = {
  duplicate: "एउटै खोज विकल्प एकभन्दा बढी पटक आएको छ। कृपया फारमबाट फेरि खोज्नुहोस्।",
  query_too_long: "खोज शब्द १२० वर्णभन्दा छोटो राख्नुहोस्।",
  invalid_filter: "एउटा खोज फिल्टर मान्य थिएन; त्यसलाई हटाएर नतिजा देखाइएको छ।",
  invalid_page: "पृष्ठ नम्बर मान्य थिएन; पहिलो पृष्ठ देखाइएको छ।",
  invalid_date: "प्रकाशन मिति मान्य छैन; मिति YYYY-MM-DD ढाँचामा छान्नुहोस्।",
  invalid_date_range: "सुरु मिति अन्तिम मितिभन्दा पछाडि हुन मिल्दैन।",
};

function hasSearchCriteria(filters: SearchFilters): boolean {
  return Boolean(
    filters.query || filters.categorySlug || filters.kind || filters.from || filters.to,
  );
}

function pageHref(filters: SearchFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.locale !== "ne-NP") params.set("locale", filters.locale);
  if (filters.categorySlug) params.set("category", filters.categorySlug);
  if (filters.kind) params.set("kind", filters.kind);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.sort && filters.sort !== "relevance") params.set("sort", filters.sort);
  params.set("page", String(page));
  return `/search?${params.toString()}`;
}

function SearchIssues({ issues }: { issues: SearchParamIssue[] }) {
  if (!issues.length) return null;
  return (
    <div
      className="mt-4 border-l-4 border-[var(--urgent-dark)] bg-[var(--paper-muted)] p-4 text-sm leading-6"
      role="alert"
    >
      <ul>
        {issues.map((issue) => (
          <li key={issue}>{issueCopy[issue]}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const parsed = parseSearchParams(await searchParams);
  const { filters, issues } = parsed;
  const active = hasSearchCriteria(filters);
  const searchPromise: Promise<SearchPageResult> = issues.includes("query_too_long")
    ? Promise.resolve({
        filters,
        results: [],
        pageInfo: { page: 1, pageSize: 3, totalItems: 0, totalPages: 0 },
      })
    : contentGateway.search(filters);
  const [search, home, categories] = await Promise.all([
    searchPromise,
    active ? Promise.resolve(null) : contentGateway.getHome("ne-NP"),
    contentGateway.listCategories(filters.locale),
  ]);
  const number = new Intl.NumberFormat("ne-NP");

  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "गृहपृष्ठ", href: "/" }, { label: "खोज" }]} />
        <header className="mt-8 border-b-4 border-[var(--ink)] pb-5">
          <p className="eyebrow text-[var(--urgent-dark)]">समाचार र जानकारी खोज</p>
          <h1 className="editorial-heading mt-2 text-4xl font-bold sm:text-5xl">खोज्नुहोस्</h1>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--ink-soft)]">
            शीर्षक, सारांश र विषयमा खोज्नुहोस्। खोज नतिजा अहिले काल्पनिक नमुना सामग्रीमा मात्र सीमित छन्।
          </p>
        </header>

        <form
          action="/search"
          method="get"
          className="mt-6 border border-[var(--rule)] bg-[var(--paper-raised)] p-4 sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,2fr)_repeat(6,minmax(7rem,1fr))]">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="eyebrow mb-2 block" htmlFor="search-query">
                खोज शब्द
              </label>
              <input
                className="field"
                id="search-query"
                name="q"
                type="search"
                maxLength={120}
                placeholder="जस्तै: डिजिटल पुस्तकालय"
                defaultValue={filters.query}
              />
            </div>
            <div>
              <label className="eyebrow mb-2 block" htmlFor="search-locale">
                भाषा
              </label>
              <select
                className="field"
                id="search-locale"
                name="locale"
                defaultValue={filters.locale}
              >
                <option value="ne-NP">नेपाली</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="eyebrow mb-2 block" htmlFor="search-category">
                खण्ड
              </label>
              <select
                className="field"
                id="search-category"
                name="category"
                defaultValue={filters.categorySlug ?? ""}
              >
                <option value="">सबै खण्ड</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="eyebrow mb-2 block" htmlFor="search-kind">
                सामग्री प्रकार
              </label>
              <select
                className="field"
                id="search-kind"
                name="kind"
                defaultValue={filters.kind ?? ""}
              >
                <option value="">सबै प्रकार</option>
                {kindOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="eyebrow mb-2 block" htmlFor="search-sort">
                क्रम
              </label>
              <select
                className="field"
                id="search-sort"
                name="sort"
                defaultValue={filters.sort ?? "relevance"}
              >
                <option value="relevance">सान्दर्भिकता</option>
                <option value="newest">नयाँ पहिले</option>
              </select>
            </div>
            <div>
              <label className="eyebrow mb-2 block" htmlFor="search-from">
                मिति देखि
              </label>
              <input
                className="field"
                id="search-from"
                max={filters.to}
                name="from"
                type="date"
                defaultValue={filters.from ?? ""}
              />
            </div>
            <div>
              <label className="eyebrow mb-2 block" htmlFor="search-to">
                मिति सम्म
              </label>
              <input
                className="field"
                id="search-to"
                min={filters.from}
                name="to"
                type="date"
                defaultValue={filters.to ?? ""}
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--ink-soft)]">
            मिति काठमाडौं समयअनुसार समावेशी रूपमा लागू हुन्छ।
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="button-primary" type="submit">
              नतिजा खोज्नुहोस्
            </button>
            <Link className="button-secondary" href="/search">
              फिल्टर हटाउनुहोस्
            </Link>
            <span className="text-xs text-[var(--ink-soft)]">अधिकतम १२० वर्ण</span>
          </div>
        </form>

        <SearchIssues issues={issues} />
        {filters.locale === "en" ? (
          <p className="mt-4 border-l-4 border-[var(--rule-strong)] bg-[var(--paper-muted)] p-4 text-sm leading-6">
            English विकल्प उपलब्ध छ, तर समीक्षा गरिएका अंग्रेजी नमुना सामग्री अझै छैनन्। नेपाली सामग्रीलाई अनुवाद
            गरेर देखाइएको छैन।
          </p>
        ) : null}

        {active ? (
          <section className="mt-8" aria-labelledby="search-results-title">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b-4 border-[var(--ink)] pb-2">
              <div>
                <p className="eyebrow">
                  {filters.query ? `“${filters.query}” का लागि` : "फिल्टर गरिएका सामग्री"}
                </p>
                <h2 id="search-results-title" className="editorial-heading mt-1 text-2xl font-bold">
                  खोज नतिजा
                </h2>
              </div>
              {search.pageInfo.totalItems > 0 ? (
                <p className="text-sm text-[var(--ink-soft)]">
                  {number.format(search.pageInfo.totalItems)} नतिजा
                </p>
              ) : null}
            </div>
            {search.results.length ? (
              <div className="mt-3 grid gap-x-8 md:grid-cols-2">
                {search.results.map((story) => (
                  <StoryCard key={story.id} article={story} density="standard" />
                ))}
              </div>
            ) : (
              <div className="mt-5">
                <ContentState
                  kind="empty"
                  title={filters.locale === "en" ? "समीक्षा गरिएको सामग्री छैन" : "मिल्दो सामग्री भेटिएन"}
                  description={
                    filters.locale === "en"
                      ? "नेपाली नमुना सामग्री अंग्रेजीमा अनुवाद गरिएको छैन। भाषा नेपाली छानेर प्रयास गर्नुहोस्।"
                      : "अर्को शब्द प्रयोग गर्नुहोस् वा एउटा फिल्टर हटाएर फेरि खोज्नुहोस्।"
                  }
                />
              </div>
            )}
            {search.pageInfo.totalPages > 1 ? (
              <nav
                className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-4"
                aria-label="खोज नतिजा पृष्ठहरू"
              >
                <p className="text-sm">
                  पृष्ठ {number.format(search.pageInfo.page)} /{" "}
                  {number.format(search.pageInfo.totalPages)}
                </p>
                <div className="flex gap-2">
                  {search.pageInfo.page > 1 ? (
                    <Link
                      className="button-secondary"
                      href={pageHref(filters, search.pageInfo.page - 1)}
                    >
                      ← अघिल्लो
                    </Link>
                  ) : null}
                  {search.pageInfo.page < search.pageInfo.totalPages ? (
                    <Link
                      className="button-primary"
                      href={pageHref(filters, search.pageInfo.page + 1)}
                    >
                      अर्को →
                    </Link>
                  ) : null}
                </div>
              </nav>
            ) : null}
          </section>
        ) : (
          <section
            className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,0.8fr)]"
            aria-labelledby="discovery-title"
          >
            <div>
              <div className="border-b-4 border-[var(--ink)] pb-2">
                <p className="eyebrow">खोज सुरु गर्नुहोस्</p>
                <h2 id="discovery-title" className="editorial-heading mt-1 text-2xl font-bold">
                  चर्चित विषय
                </h2>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {querySuggestions.map((term) => (
                  <li key={term}>
                    <Link className="story-category" href={`/search?q=${encodeURIComponent(term)}`}>
                      {term}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                देवनागरी वा अंग्रेजी अक्षर, विराम चिह्न र खाली ठाउँले खोज मिलानमा बाधा गर्दैन।
              </p>
            </div>
            <aside className="border-t-4 border-[var(--ink)] pt-3">
              <p className="eyebrow">पढ्नका लागि नमुना</p>
              <h2 className="editorial-heading mt-1 text-xl font-bold">ताजा सामग्री</h2>
              <ul className="mt-3 divide-y divide-[var(--rule)]">
                {home?.latest.slice(0, 3).map((story) => (
                  <li className="py-3" key={story.id}>
                    <Link className="font-bold leading-7" href={story.href}>
                      {story.headline}
                    </Link>
                    <p className="mt-1 text-xs text-[var(--ink-soft)]">
                      {story.category.name} · काल्पनिक नमुना
                    </p>
                  </li>
                ))}
              </ul>
            </aside>
          </section>
        )}
      </main>
    </>
  );
}
