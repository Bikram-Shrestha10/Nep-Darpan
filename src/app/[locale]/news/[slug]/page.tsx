import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/content/article-body";
import { ArticleMedia, MediaSlot } from "@/components/content/article-media";
import { ArticleShare } from "@/components/content/article-share";
import { CorrectionNoticePanel } from "@/components/content/correction-notice";
import { RelatedStories } from "@/components/content/related-stories";
import { SourceAttribution } from "@/components/content/source-attribution";
import {
  AuthorByline,
  CategoryTag,
  EditorialTags,
  PublishedTime,
} from "@/components/content/story-metadata";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { LocalizedText } from "@/components/layout/site-preferences";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import type { LocaleCode } from "@/lib/content/contracts";
import { contentGateway } from "@/lib/content/gateway";

type Props = { params: Promise<{ locale: string; slug: string }> };
function isSupportedLocale(locale: string): locale is LocaleCode {
  return locale === "ne-NP";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) return { title: "सामग्री उपलब्ध छैन" };
  const article = await contentGateway.getArticle(locale, slug);
  return article
    ? {
        title: article.seo.title,
        description: article.seo.description,
        alternates: { canonical: article.seo.canonicalUrl },
      }
    : { title: "समाचार भेटिएन" };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const article = await contentGateway.getArticle(locale, slug);
  if (article?.status !== "published") notFound();
  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: "गृहपृष्ठ", href: "/" },
            { label: article.category.name, href: `/category/${article.category.slug}` },
            { label: article.headline },
          ]}
        />
        <article className="article-page mx-auto mt-8 max-w-5xl">
          <header className="article-page__header border-b-4 border-[var(--ink)] pb-6">
            <div className="flex flex-wrap gap-2">
              <CategoryTag category={article.category} />
              <EditorialTags labels={article.labels} kind={article.kind} />
            </div>
            <h1 className="article-page__title editorial-heading mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              <LocalizedText ne={article.headline} />
            </h1>
            <p className="article-page__summary mt-4 max-w-4xl text-lg leading-8 text-[var(--ink-soft)]">
              <LocalizedText ne={article.summary ?? ""} />
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              <AuthorByline authors={article.authors} />
              <PublishedTime value={article.publishedAt} label="प्रकाशित" />
              {article.updatedAt ? <PublishedTime value={article.updatedAt} label="अपडेट" /> : null}
            </div>
            <div className="mt-5">
              <ArticleShare />
            </div>
          </header>
          <div className="mt-6">
            {article.leadMedia ? <ArticleMedia media={article.leadMedia} /> : <MediaSlot />}
          </div>
          <div className="article-page__layout mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <div>
              {article.corrections.length ? (
                <div className="mb-7">
                  {article.corrections.map((notice) => (
                    <CorrectionNoticePanel key={notice.id} notice={notice} />
                  ))}
                </div>
              ) : null}
              <ArticleBody blocks={article.body} />
              <SourceAttribution sources={article.sources} />
            </div>
            <aside className="article-page__sidebar h-fit border-t-4 border-[var(--ink)] bg-[var(--paper-muted)] p-4">
              <p className="eyebrow">
                <LocalizedText ne="सम्पादकीय जानकारी" />
              </p>
              <p className="mt-2 text-sm leading-7">
                <LocalizedText ne="यस पृष्ठका सबै विवरण काल्पनिक छन् र केवल वेबसाइटको पूर्वावलोकनका लागि राखिएका हुन्।" />
              </p>
              <Link className="mt-3 inline-block text-sm font-bold" href="/information-hub">
                <LocalizedText ne="सन्दर्भ केन्द्र →" />
              </Link>
            </aside>
          </div>
          <RelatedStories articles={article.related} />
        </article>
      </main>
    </>
  );
}
