import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryCard } from "@/components/content/story-card";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageNavigation } from "@/components/ui/page-navigation";
import { contentGateway } from "@/lib/content/gateway";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};
function requestedPage(value: string | string[] | undefined): number {
  if (typeof value !== "string" || !/^[1-9]\d*$/u.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
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
  const page = await contentGateway.getCategory("ne-NP", slug, requestedPage(query.page));
  if (!page) notFound();
  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "गृहपृष्ठ", href: "/" }, { label: page.category.name }]} />
        <header className="mt-8 border-b-4 border-[var(--ink)] pb-5">
          <p className="eyebrow">समाचार खण्ड · काल्पनिक नमुना</p>
          <h1 className="editorial-heading mt-2 text-4xl font-bold sm:text-5xl">
            {page.category.name}
          </h1>
          <p className="mt-3 text-[var(--ink-soft)]">
            यस खण्डका सामग्रीहरू केवल पृष्ठ संरचना परीक्षणका लागि हुन्।
          </p>
        </header>
        <section
          className="mt-7 grid gap-x-8 md:grid-cols-2"
          aria-label={`${page.category.name} का नमुना समाचार`}
        >
          {page.articles.map((story) => (
            <StoryCard key={story.id} article={story} />
          ))}
        </section>
        <PageNavigation
          pageInfo={page.pageInfo}
          label={`${page.category.name} समाचार पृष्ठहरू`}
          hrefForPage={(nextPage) => `/category/${encodeURIComponent(slug)}?page=${nextPage}`}
        />
      </main>
    </>
  );
}
