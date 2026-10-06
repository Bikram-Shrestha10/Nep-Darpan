import type { Metadata } from "next";
import Link from "next/link";
import { StoryCard } from "@/components/content/story-card";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { contentGateway } from "@/lib/content/gateway";

export const metadata: Metadata = {
  title: "ताजा समाचार",
  description: "ताजा समाचारका काल्पनिक नमुना",
};

export default async function LatestPage() {
  const home = await contentGateway.getHome("ne-NP");
  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "गृहपृष्ठ", href: "/" }, { label: "ताजा समाचार" }]} />
        <header className="mt-8 border-b-4 border-[var(--ink)] pb-5">
          <p className="eyebrow text-[var(--urgent-dark)]">सम्पादकीय फिड · काल्पनिक</p>
          <h1 className="editorial-heading mt-2 text-4xl font-bold sm:text-5xl">ताजा समाचार</h1>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--ink-soft)]">
            प्रकाशन समयअनुसार क्रमबद्ध नमुना समाचार। कुनै सामग्रीले वास्तविक घटना जनाउँदैन।
          </p>
        </header>
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(15rem,0.8fr)]">
          <section aria-label="ताजा समाचार सूची" className="divide-y divide-[var(--rule)]">
            {home.latest.map((story) => (
              <StoryCard key={story.id} article={story} density="standard" />
            ))}
          </section>
          <aside className="h-fit border-t-4 border-[var(--ink)] bg-[var(--paper-muted)] p-5">
            <h2 className="editorial-heading text-xl font-bold">सम्पादकीय छनोट</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
              चर्चामा रहेका सामग्री सम्पादकले छनोट गर्नेछन्। यस पूर्वावलोकनमा सूची परीक्षणका लागि मात्र हो।
            </p>
            <ul className="mt-4 list-inside list-disc space-y-3">
              {home.trending.map((story) => (
                <li key={story.id}>
                  <Link className="font-bold" href={story.href}>
                    {story.headline}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </>
  );
}
