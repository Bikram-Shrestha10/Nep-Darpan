import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/content/article-body";
import { RelatedStories } from "@/components/content/related-stories";
import { SourceAttribution } from "@/components/content/source-attribution";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { contentGateway } from "@/lib/content/gateway";

type Props = { params: Promise<{ slug: string }> };
const label = (kind: string) =>
  kind === "fact_check" ? "तथ्य जाँच नमुना" : kind === "guide" ? "मार्गदर्शिका नमुना" : "व्याख्या नमुना";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await contentGateway.getHubEntry("ne-NP", slug);
  return entry ? { title: entry.title, description: entry.summary } : { title: "सामग्री भेटिएन" };
}
export default async function HubEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = await contentGateway.getHubEntry("ne-NP", slug);
  if (!entry) notFound();
  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: "गृहपृष्ठ", href: "/" },
            { label: "जानकारी केन्द्र", href: "/information-hub" },
            { label: entry.title },
          ]}
        />
        <article className="mx-auto mt-8 max-w-4xl">
          <header className="border-b-4 border-[var(--ink)] pb-6">
            <p className="eyebrow text-[var(--urgent-dark)]">{label(entry.kind)} · काल्पनिक</p>
            <h1 className="editorial-heading mt-3 text-3xl font-bold leading-tight sm:text-5xl">
              {entry.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-[var(--ink-soft)]">{entry.summary}</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--ink-soft)]">
              <span>
                समीक्षा नमुना:{" "}
                <time dateTime={entry.reviewedAt}>
                  {new Intl.DateTimeFormat("ne-NP", {
                    dateStyle: "medium",
                    timeZone: "Asia/Kathmandu",
                  }).format(new Date(entry.reviewedAt))}
                </time>
              </span>
              {entry.nextReviewAt ? (
                <span>
                  अर्को समीक्षा नमुना:{" "}
                  <time dateTime={entry.nextReviewAt}>
                    {new Intl.DateTimeFormat("ne-NP", {
                      dateStyle: "medium",
                      timeZone: "Asia/Kathmandu",
                    }).format(new Date(entry.nextReviewAt))}
                  </time>
                </span>
              ) : null}
            </div>
          </header>
          {entry.kind === "fact_check" ? (
            <aside className="mt-6 border-2 border-[var(--ink)] bg-[var(--paper-muted)] p-4">
              <p className="eyebrow">निष्कर्ष छैन</p>
              <p className="mt-1 font-bold leading-7">
                यो लेआउट नमुना हो; कुनै वास्तविक दाबीको परीक्षण वा निष्कर्ष गरिएको छैन।
              </p>
            </aside>
          ) : null}
          <ArticleBody blocks={entry.body} />
          <SourceAttribution sources={entry.evidence} />
          <Link className="mt-8 inline-block font-bold" href="/information-hub">
            ← जानकारी केन्द्रमा फर्कनुहोस्
          </Link>
          <RelatedStories articles={entry.related} />
        </article>
      </main>
    </>
  );
}
