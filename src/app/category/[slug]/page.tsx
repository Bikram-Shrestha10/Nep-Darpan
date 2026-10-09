import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EconomyCategoryPage } from "@/components/content/economy-category-page";
import { OpinionCategoryPage } from "@/components/content/opinion-category-page";
import { PoliticsCategoryPage } from "@/components/content/politics-category-page";
import { SocietyCategoryPage } from "@/components/content/society-category-page";
import { LeadStory, StoryCard } from "@/components/content/story-card";
import { TechnologyCategoryPage } from "@/components/content/technology-category-page";
import { WorldCategoryPage } from "@/components/content/world-category-page";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { LocalizedText } from "@/components/layout/site-preferences";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageNavigation } from "@/components/ui/page-navigation";
import type { EconomySearchParams } from "@/lib/content/economy-feed";
import { contentGateway } from "@/lib/content/gateway";
import type { OpinionSearchParams } from "@/lib/content/opinion-feed";
import type { PoliticsSearchParams } from "@/lib/content/politics-feed";
import type { SocietySearchParams } from "@/lib/content/society-feed";
import type { TechnologySearchParams } from "@/lib/content/technology-feed";
import type { WorldSearchParams } from "@/lib/content/world-feed";
import { translateToEnglish } from "@/lib/i18n/english";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<
    | PoliticsSearchParams
    | EconomySearchParams
    | SocietySearchParams
    | TechnologySearchParams
    | WorldSearchParams
    | OpinionSearchParams
  >;
};
function requestedPage(value: string | string[] | undefined): number {
  if (typeof value !== "string" || !/^[1-9]\d*$/u.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
}

async function listAllHubEntries() {
  const firstPage = await contentGateway.listHub("ne-NP");
  const additionalPages = await Promise.all(
    Array.from({ length: firstPage.pageInfo.totalPages - 1 }, (_, index) =>
      contentGateway.listHub("ne-NP", index + 2),
    ),
  );
  return [firstPage, ...additionalPages].flatMap((page) => page.entries);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await contentGateway.getCategory("ne-NP", slug);
  return page
    ? { title: page.category.name, description: `${page.category.name} का काल्पनिक समाचार नमुना` }
    : { title: "खण्ड भेटिएन" };
}
export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const politicsPage = slug === "politics";
  const economyPage = slug === "economy";
  const societyPage = slug === "society";
  const technologyPage = slug === "technology";
  const worldPage = slug === "world";
  const opinionPage = slug === "opinion";
  const customFeed =
    politicsPage || economyPage || societyPage || technologyPage || worldPage || opinionPage;
  const [page, categories] = await Promise.all([
    contentGateway.getCategory("ne-NP", slug, customFeed ? 1 : requestedPage(query.page)),
    contentGateway.listCategories("ne-NP"),
  ]);
  if (!page) notFound();
  if (politicsPage) {
    const hubEntries = await listAllHubEntries();
    return (
      <PoliticsCategoryPage
        categoryPage={page}
        categories={categories}
        hubEntries={hubEntries}
        searchParams={query}
      />
    );
  }
  if (economyPage) {
    const hubEntries = await listAllHubEntries();
    return (
      <EconomyCategoryPage
        categoryPage={page}
        categories={categories}
        hubEntries={hubEntries}
        searchParams={query}
      />
    );
  }
  if (societyPage) {
    const hubEntries = await listAllHubEntries();
    return (
      <SocietyCategoryPage
        categoryPage={page}
        categories={categories}
        hubEntries={hubEntries}
        searchParams={query}
      />
    );
  }
  if (technologyPage) {
    const hubEntries = await listAllHubEntries();
    return (
      <TechnologyCategoryPage
        categoryPage={page}
        categories={categories}
        hubEntries={hubEntries}
        searchParams={query}
      />
    );
  }
  if (worldPage) {
    const hubEntries = await listAllHubEntries();
    return (
      <WorldCategoryPage
        categoryPage={page}
        categories={categories}
        hubEntries={hubEntries}
        searchParams={query}
      />
    );
  }
  if (opinionPage) {
    return <OpinionCategoryPage categoryPage={page} categories={categories} searchParams={query} />;
  }
  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "गृहपृष्ठ", href: "/" }, { label: page.category.name }]} />
        <header className="category-page__header mt-6">
          <p className="eyebrow text-[var(--ink)]">
            <LocalizedText ne="समाचार खण्ड · नमुना सामग्री" />
          </p>
          <h1 id="category-title" className="editorial-heading mt-1 text-4xl font-bold sm:text-5xl">
            <LocalizedText ne={page.category.name} />
          </h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            <LocalizedText ne="यस खण्डका समाचार र विवरणहरू डिजाइन पूर्वावलोकनका लागि तयार गरिएका काल्पनिक नमुना हुन्।" />
          </p>
          <nav className="category-topic-nav mt-4" aria-labelledby="other-category-label">
            <span className="sr-only" id="other-category-label">
              <LocalizedText ne="समाचारका अन्य खण्डहरू" />
            </span>
            {categories.map((category) => (
              <Link
                aria-current={category.slug === slug ? "page" : undefined}
                className={category.slug === slug ? "story-category is-active" : "story-category"}
                href={`/category/${category.slug}`}
                key={category.slug}
              >
                <LocalizedText ne={category.name} />
              </Link>
            ))}
          </nav>
        </header>
        {page.pageInfo.page === 1 && page.lead ? (
          <section className="mt-5" aria-labelledby={`lead-${page.lead.id}`}>
            <LeadStory article={page.lead} />
          </section>
        ) : null}
        <section
          className="category-stories mt-8 grid gap-x-5 md:grid-cols-2"
          aria-labelledby="category-stories-label"
        >
          <h2 className="sr-only" id="category-stories-label">
            <LocalizedText ne="यस खण्डका समाचार" />
          </h2>
          {page.articles
            .filter((story) => page.pageInfo.page !== 1 || story.id !== page.lead?.id)
            .map((story) => (
              <StoryCard key={story.id} article={story} />
            ))}
        </section>
        <PageNavigation
          pageInfo={page.pageInfo}
          label={`${page.category.name} समाचार पृष्ठहरू`}
          labelEn={`${translateToEnglish(page.category.name)} story pages`}
          previousHref={
            page.pageInfo.page > 1
              ? `/category/${encodeURIComponent(slug)}?page=${page.pageInfo.page - 1}`
              : undefined
          }
          nextHref={
            page.pageInfo.page < page.pageInfo.totalPages
              ? `/category/${encodeURIComponent(slug)}?page=${page.pageInfo.page + 1}`
              : undefined
          }
        />
      </main>
    </>
  );
}
