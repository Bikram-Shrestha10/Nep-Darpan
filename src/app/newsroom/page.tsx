import type { Metadata } from "next";
import Link from "next/link";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";
import { NewsroomStatus } from "@/components/newsroom/newsroom-status";
import { newsroomStories } from "@/lib/newsroom/fixtures";

export const metadata: Metadata = { title: "समाचार कक्ष प्रोटोटाइप" };
export default function NewsroomDashboard() {
  const reviewCount = newsroomStories.filter((story) => story.status === "in_review").length;
  return (
    <>
      <NewsroomNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-[var(--ink)] pb-5">
          <div>
            <p className="eyebrow text-[var(--urgent-dark)]">सम्पादकीय कार्यक्षेत्र · डेमो</p>
            <h1 className="editorial-heading mt-2 text-4xl font-bold">ड्यासबोर्ड</h1>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">भूमिका: सम्पादक (काल्पनिक नमुना)</p>
          </div>
          <Link className="button-primary" href="/newsroom/stories/new">
            + नयाँ समाचार
          </Link>
        </header>
        <section className="mt-6 grid gap-4 sm:grid-cols-3" aria-label="नमुना कार्य सारांश">
          <article className="border border-[var(--rule)] bg-[var(--paper-raised)] p-5">
            <p className="eyebrow">मस्यौदा</p>
            <p className="mt-2 text-3xl font-bold">
              {newsroomStories.filter((story) => story.status === "draft").length}
            </p>
            <Link
              className="mt-2 inline-block text-sm font-bold"
              href="/newsroom/stories?status=draft"
            >
              मस्यौदा सूची
            </Link>
          </article>
          <article className="border border-[var(--rule)] bg-[var(--paper-raised)] p-5">
            <p className="eyebrow">समीक्षाका लागि</p>
            <p className="mt-2 text-3xl font-bold">{reviewCount}</p>
            <Link className="mt-2 inline-block text-sm font-bold" href="/newsroom/review">
              समीक्षा सूची
            </Link>
          </article>
          <article className="border border-[var(--rule)] bg-[var(--paper-raised)] p-5">
            <p className="eyebrow">मिडिया</p>
            <p className="mt-2 text-3xl font-bold">—</p>
            <Link className="mt-2 inline-block text-sm font-bold" href="/newsroom/media">
              मिडिया प्यानल खोल्नुहोस्
            </Link>
          </article>
        </section>
        <section className="mt-9" aria-labelledby="recent-stories">
          <div className="flex items-end justify-between border-b-4 border-[var(--ink)] pb-2">
            <h2 id="recent-stories" className="editorial-heading text-2xl font-bold">
              हालका नमुना समाचार
            </h2>
            <Link className="text-sm font-bold" href="/newsroom/stories">
              सबै हेर्नुहोस् →
            </Link>
          </div>
          <ul className="divide-y divide-[var(--rule)]">
            {newsroomStories.slice(0, 3).map((story) => (
              <li key={story.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <Link className="font-bold" href={`/newsroom/stories/${story.id}`}>
                    {story.title}
                  </Link>
                  <p className="mt-1 text-xs text-[var(--ink-soft)]">
                    {story.category} · {story.author}
                  </p>
                </div>
                <NewsroomStatus status={story.status} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
