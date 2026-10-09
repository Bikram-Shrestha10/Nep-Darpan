import Link from "next/link";
import { ReelsCarousel } from "@/components/content/reels-carousel";
import { HomepageHero, selectHomepageHeroStories } from "@/components/content/homepage-hero";
import { StoryCard } from "@/components/content/story-card";
import { AdvertisementSlot } from "@/components/content/advertisement-slot";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { LocalizedText } from "@/components/layout/site-preferences";
import { contentGateway } from "@/lib/content/gateway";

export default async function Home() {
  const home = await contentGateway.getHome("ne-NP");
  const homepageHeroStories = selectHomepageHeroStories(home);
  const remainingLatest = home.latest.filter(
    (story) => !homepageHeroStories.usedStoryIds.has(story.id),
  );
  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1}>
        <div className="page-shell py-5 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-[var(--rule)] pb-2 text-[0.7rem] text-[var(--ink-soft)]">
            <p>
              <LocalizedText
                ne="नेपाली संस्करण · काल्पनिक नमुना सामग्री"
                en="English edition · fictional sample stories"
              />
            </p>
            <p>
              <LocalizedText ne="सम्पादकीय डिजाइन पूर्वावलोकन" en="Editorial design preview" />
            </p>
          </div>
          <div className="mt-4 sm:mt-5">
            <HomepageHero lead={home.lead} latest={home.latest} />
          </div>
          <AdvertisementSlot />
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(17rem,0.8fr)]">
            {remainingLatest.length > 0 ? (
              <section aria-labelledby="latest-heading">
                <div className="home-section-heading">
                  <h2 id="latest-heading" className="editorial-heading text-2xl font-bold">
                    <LocalizedText ne="ताजा अपडेट" en="Latest updates" />
                  </h2>
                  <Link className="text-sm font-bold" href="/latest">
                    <LocalizedText ne="सबै हेर्नुहोस्" en="View all" />
                  </Link>
                </div>
                <div className="grid gap-x-6 sm:grid-cols-2">
                  {remainingLatest.map((story) => (
                    <StoryCard key={story.id} article={story} density="compact" />
                  ))}
                </div>
              </section>
            ) : null}
            <aside
              aria-labelledby="trending-heading"
              className="border-t-2 border-[var(--ink)] bg-[var(--paper-muted)] p-4 sm:p-5 lg:border-t-0 lg:border-l-2 lg:border-l-[var(--ink)]"
            >
              <p className="eyebrow text-[var(--ink)]">
                <LocalizedText ne="सम्पादकको छनोट" en="Editor's picks" />
              </p>
              <h2 id="trending-heading" className="editorial-heading mt-1 text-2xl font-bold">
                <LocalizedText ne="चर्चामा" en="Trending" />
              </h2>
              <ol className="mt-3 divide-y divide-[var(--rule)]">
                {home.trending.map((story, index) => (
                  <li key={story.id} className="py-2">
                    <span className="mr-3 font-serif text-3xl font-bold text-[var(--rule-strong)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Link className="font-bold leading-7" href={story.href}>
                      <LocalizedText ne={story.headline} />
                    </Link>
                    <p className="mt-1 text-xs text-[var(--ink-soft)]">
                      <LocalizedText ne={story.category.name} /> ·{" "}
                      <LocalizedText ne="काल्पनिक नमुना" />
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
              <div className="mb-2 flex items-end justify-between border-b-2 border-[var(--ink)] pb-2">
                <h2
                  id={`section-${section.category.slug}`}
                  className="editorial-heading text-2xl font-bold"
                >
                  <LocalizedText ne={section.category.name} />
                </h2>
                <Link className="text-sm font-bold" href={`/category/${section.category.slug}`}>
                  <LocalizedText ne="थप समाचार →" en="More stories →" />
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {section.articles.map((story) => (
                  <StoryCard key={story.id} article={story} density="compact" />
                ))}
              </div>
            </section>
          ))}
          <ReelsCarousel reels={home.reels} />
          <section
            className="mt-12 border-y-2 border-[var(--ink)] bg-[var(--paper-muted)] px-5 py-6 sm:px-8"
            aria-labelledby="hub-title"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">
                  <LocalizedText ne="सन्दर्भ र उपयोगी जानकारी" en="Context and useful information" />
                </p>
                <h2 id="hub-title" className="editorial-heading mt-1 text-2xl font-bold">
                  <LocalizedText ne="जानकारी केन्द्र" en="Information hub" />
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                  <LocalizedText
                    ne="व्याख्या, मार्गदर्शिका र तथ्य-जाँचका ढाँचा — यहाँका सबै सामग्री काल्पनिक नमुना हुन्।"
                    en="Explainers, guides, and fact-check formats. All items shown here are fictional examples."
                  />
                </p>
              </div>
              <Link className="button-secondary" href="/information-hub">
                <LocalizedText ne="सबै सामग्री हेर्नुहोस्" en="Browse all" />
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
                    <LocalizedText
                      ne={
                        entry.kind === "fact_check"
                          ? "तथ्य जाँच नमुना"
                          : entry.kind === "guide"
                            ? "मार्गदर्शिका नमुना"
                            : "व्याख्या नमुना"
                      }
                    />
                  </span>
                  <span className="mt-2 block">
                    <LocalizedText ne={entry.title} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
