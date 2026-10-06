import Link from "next/link";
import { LeadStory, StoryCard } from "@/components/content/story-card";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { contentGateway } from "@/lib/content/gateway";

export default async function Home() {
  const home = await contentGateway.getHome("ne-NP");
  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1}>
        <div className="page-shell py-6 sm:py-9">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--rule-strong)] pb-3 text-xs text-[var(--ink-soft)]">
            <p>पूर्वावलोकन अंक · काठमाडौं</p>
            <p>नेपाली संस्करण · काल्पनिक नमुना सामग्री</p>
          </div>
          <section className="mt-5" aria-labelledby="lead-heading">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-[var(--urgent-dark)]">आजका मुख्य समाचार</p>
                <h1 id="lead-heading" className="sr-only">
                  आजका मुख्य समाचार
                </h1>
              </div>
              <Link className="text-sm font-bold" href="/latest">
                सबै ताजा समाचार →
              </Link>
            </div>
            {home.lead ? <LeadStory article={home.lead} /> : null}
          </section>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(17rem,0.8fr)]">
            <section aria-labelledby="latest-heading">
              <div className="mb-2 flex items-center justify-between border-b-4 border-[var(--ink)] pb-2">
                <h2 id="latest-heading" className="editorial-heading text-2xl font-bold">
                  ताजा अपडेट
                </h2>
                <Link className="text-sm font-bold" href="/latest">
                  सबै हेर्नुहोस्
                </Link>
              </div>
              <div className="grid gap-x-6 sm:grid-cols-2">
                {home.latest.slice(1).map((story) => (
                  <StoryCard key={story.id} article={story} density="compact" />
                ))}
              </div>
            </section>
            <aside
              aria-labelledby="trending-heading"
              className="border-t-4 border-[var(--urgent-dark)] pt-3 lg:border-t-0 lg:border-l lg:border-[var(--rule-strong)] lg:pl-6"
            >
              <p className="eyebrow text-[var(--urgent-dark)]">सम्पादकको छनोट</p>
              <h2 id="trending-heading" className="editorial-heading mt-1 text-2xl font-bold">
                चर्चामा
              </h2>
              <ol className="mt-3 divide-y divide-[var(--rule)]">
                {home.trending.map((story, index) => (
                  <li key={story.id} className="py-4">
                    <span className="mr-3 font-serif text-3xl font-bold text-[var(--rule-strong)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Link className="font-bold leading-7" href={story.href}>
                      {story.headline}
                    </Link>
                    <p className="mt-1 text-xs text-[var(--ink-soft)]">
                      {story.category.name} · काल्पनिक नमुना
                    </p>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
          {home.sections.map((section) => (
            <section
              key={section.category.id}
              className="mt-12"
              aria-labelledby={`section-${section.category.slug}`}
            >
              <div className="mb-2 flex items-end justify-between border-b-4 border-[var(--ink)] pb-2">
                <h2
                  id={`section-${section.category.slug}`}
                  className="editorial-heading text-2xl font-bold"
                >
                  {section.category.name}
                </h2>
                <Link className="text-sm font-bold" href={`/category/${section.category.slug}`}>
                  थप समाचार →
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {section.articles.map((story) => (
                  <StoryCard key={story.id} article={story} density="compact" />
                ))}
              </div>
            </section>
          ))}
          <section
            className="mt-12 border-y-2 border-[var(--ink)] bg-[var(--paper-muted)] px-5 py-6 sm:px-8"
            aria-labelledby="hub-title"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">सन्दर्भ र उपयोगी जानकारी</p>
                <h2 id="hub-title" className="editorial-heading mt-1 text-2xl font-bold">
                  जानकारी केन्द्र
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                  व्याख्या, मार्गदर्शिका र तथ्य-जाँचका ढाँचा — यहाँका सबै सामग्री काल्पनिक नमुना हुन्।
                </p>
              </div>
              <Link className="button-secondary" href="/information-hub">
                सबै सामग्री हेर्नुहोस्
              </Link>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {home.hubHighlights.map((entry) => (
                <Link
                  key={entry.id}
                  className="border border-[var(--rule)] bg-[var(--paper-raised)] p-4 font-bold leading-7"
                  href={`/information-hub/${entry.slug}`}
                >
                  <span className="eyebrow block text-[var(--ink-soft)]">
                    {entry.kind === "fact_check"
                      ? "तथ्य जाँच नमुना"
                      : entry.kind === "guide"
                        ? "मार्गदर्शिका नमुना"
                        : "व्याख्या नमुना"}
                  </span>
                  <span className="mt-2 block">{entry.title}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
